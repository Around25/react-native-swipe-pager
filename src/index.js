import React, { Component } from 'react';
import { Dimensions, StyleSheet, View, PanResponder, Animated } from 'react-native';
import StaticRenderer from 'react-native/Libraries/Components/StaticRenderer';
import RNSwiperIndicator from './components/RNSwiperIndicator';
import RNSwiperDataSource from './components/RNSwiperDataSource';
let deviceWidth = Dimensions.get('window').width;
import styles from './styles';

class RNSwipePager extends Component {
  
  constructor(props){
    super(props);
    this.state = {
      fling: false,
      isLoop: false,
      locked: false,
      autoPlay: false,
      viewWidth: 0,
      initialPage: 0,
      currentPage: 0,
      scrollValue: new Animated.Value(0),
      animation: function (animate, toValue, gs) {
        return Animated.spring(animate, {
          toValue: toValue,
          friction: 10,
          tension: 50
        })
      }
    };
  }
  
  componentWillMount() {
    this.childIndex = 0;
    let release = (e, gestureState) => {
      let relativeGestureDistance = gestureState.dx / deviceWidth,
        vx = gestureState.vx;
      
      let step = 0;
      if (relativeGestureDistance < -0.5 || (relativeGestureDistance < 0 && vx <= -1e-6)) {
        step = 1;
      } else if (relativeGestureDistance > 0.5 || (relativeGestureDistance > 0 && vx >= 1e-6)) {
        step = -1;
      }
      this.props.hasTouch && this.props.hasTouch(false);
      this.movePage(step, gestureState);
    };
    
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (e, gestureState) => {
        if (Math.abs(gestureState.dx) > Math.abs(gestureState.dy)) {
          if (this.props.locked !== true && !this.fling) {
            this.props.hasTouch && this.props.hasTouch(true);
            return true;
          }
        }
      },
      
      onPanResponderRelease: release,
      onPanResponderTerminate: release,
      
      onPanResponderMove: (e, gestureState) => {
        let dx = gestureState.dx;
        let offsetX = -dx / this.state.viewWidth + this.childIndex;
        this.state.scrollValue.setValue(offsetX);
      },
    });
    
    if (this.props.isLoop) {
      this.childIndex = 1;
      this.state.scrollValue.setValue(1);
    }
    if (this.props.initialPage) {
      let initialPage = Number(this.props.initialPage);
      if (initialPage > 0) {
        this.goToPage(initialPage, false);
      }
    }
  }
  
  componentDidMount() {
    if (this.props.autoPlay) {
      this.startAutoPlay();
    }
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.autoPlay) {
      this.startAutoPlay();
    } else {
      if (this.auto) {
        clearInterval(this.auto);
        this.auto = null;
      }
    }
    
    if (nextProps.dataSource) {
      let maxPage = nextProps.dataSource.getPageCount() - 1;
      let constrainedPage = Math.max(0, Math.min(this.state.currentPage, maxPage));
      this.setState({
        currentPage: constrainedPage,
      });
      
      if (!nextProps.isLoop) {
        this.state.scrollValue.setValue(constrainedPage > 0 ? 1 : 0);
      }
      
      this.childIndex = Math.min(this.childIndex, constrainedPage);
      this.fling = false;
    }
    
  }
  
  startAutoPlay() {
    if (!this.auto) {
      this.auto = setInterval(() => {this.movePage(1)}, this.props.autoPlayTimeout ? this.props.autoPlayTimeout : 5000 );
    }
  }
  
  goToPage(pageNumber, animate = true) {
    let pageCount = this.props.dataSource.getPageCount();
    if (pageNumber < 0 || pageNumber >= pageCount) {
      console.error('Invalid page number: ', pageNumber);
      return
    }
    
    let step = pageNumber - this.state.currentPage;
    this.movePage(step, null, animate);
  }
  
  movePage(step, gs, animate = true) {
    let pageCount = this.props.dataSource.getPageCount();
    let pageNumber = this.state.currentPage + step;
    if (this.props.isLoop) {
      pageNumber = pageCount === 0 ? pageNumber = 0 : ((pageNumber + pageCount) % pageCount);
    } else {
      pageNumber = Math.min(Math.max(0, pageNumber), pageCount - 1);
    }
    
    const moved = pageNumber !== this.state.currentPage;
    const scrollStep = (moved ? step : 0) + this.childIndex;
    const nextChildIdx = (pageNumber > 0 || this.props.isLoop) ? 1 : 0;
    
    const postChange = () => {
      this.fling = false;
      this.childIndex = nextChildIdx;
      this.state.scrollValue.setValue(nextChildIdx);
      this.setState({
        currentPage: pageNumber,
      });
    };
    
    if (animate) {
      this.fling = true;
      if(this.props.animation){
        this.props.animation(this.state.scrollValue, scrollStep, gs)
          .start((event) => {
            if (event.finished) {
              postChange();
            }
            moved && this.props.onSwipe && this.props.onSwipe(pageNumber);
          });
      }else{
        this.state.animation(this.state.scrollValue, scrollStep, gs)
          .start((event) => {
            if (event.finished) {
              postChange();
            }
            moved && this.props.onSwipe && this.props.onSwipe(pageNumber);
          });
      }
      
    } else {
      postChange();
      moved && this.props.onSwipe && this.props.onSwipe(pageNumber);
    }
  }
  
  getCurrentPage() {
    return this.state.currentPage;
  }
  
  renderPageIndicator(props) {
    if (this.props.renderPageIndicator === false) {
      return null;
    } else if (this.props.renderPageIndicator) {
      return React.cloneElement(this.props.renderPageIndicator(), props);
    } else {
      return (
        <View style={styles.indicators}>
          <RNSwiperIndicator {...props} />
        </View>
      );
    }
  }
  
  _getPage(pageIdx, loop = false) {
    let dataSource = this.props.dataSource;
    let pageID = dataSource.pageIdentities[pageIdx];
    return (
      <StaticRenderer
        key={'p_' + pageID + (loop ? '_1' : '')}
        shouldUpdate={true}
        render={this.props.renderSwipePage.bind(
          null,
          dataSource.getPageData(pageIdx),
          pageID,
          this.state.currentPage
        )}
      />
    );
  }
  
  render() {
    let dataSource = this.props.dataSource;
    let pageIDs = dataSource.pageIdentities;
    
    let bodyComponents = [];
    
    let pagesNum = 0;
    let viewWidth = this.state.viewWidth;
    
    if (pageIDs.length > 0 && viewWidth > 0) {
      if (this.state.currentPage > 0) {
        bodyComponents.push(this._getPage(this.state.currentPage - 1));
        pagesNum++;
      } else if (this.state.currentPage === 0 && this.props.isLoop) {
        bodyComponents.push(this._getPage(pageIDs.length - 1, true));
        pagesNum++;
      }
      
      bodyComponents.push(this._getPage(this.state.currentPage));
      pagesNum++;
      
      if (this.state.currentPage < pageIDs.length - 1) {
        bodyComponents.push(this._getPage(this.state.currentPage + 1));
        pagesNum++;
      } else if (this.state.currentPage === pageIDs.length - 1 && this.props.isLoop) {
        bodyComponents.push(this._getPage(0, true));
        pagesNum++;
      }
    }
    
    let sceneContainerStyle = {
      width: viewWidth * pagesNum,
      flex: 1,
      
      flexDirection: 'row'
    };
    
    let translateX = this.state.scrollValue.interpolate({
      inputRange: [0, 1], outputRange: [0, -viewWidth]
    });
    
    return (
      <View style={styles.container}
            onLayout={(event) => {
              const viewWidth = event.nativeEvent.layout.width;
              if (!viewWidth || this.state.viewWidth === viewWidth) {
                return;
              }
              this.setState({
                currentPage: this.state.currentPage,
                viewWidth: viewWidth,
              });
            }}
      >
        
        <Animated.View style={[sceneContainerStyle, {transform: [{translateX}]}]}
                       {...this._panResponder.panHandlers}>
          {bodyComponents}
        </Animated.View>
        
        {this.renderPageIndicator({
          goToPage: this.goToPage,
          pageCount: pageIDs.length,
          activePage: this.state.currentPage,
          scrollValue: this.state.scrollValue,
          scrollOffset: this.childIndex,
        })}
      </View>
    );
  }
}

RNSwipePager.DataSource = RNSwiperDataSource;

export default RNSwipePager