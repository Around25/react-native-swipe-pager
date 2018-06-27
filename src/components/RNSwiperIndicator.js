import React, {Component} from 'react';
import  {TouchableOpacity, View, Animated} from 'react-native';

class RNSwiperIndicator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: 0,
      pageCount: 0,
      viewWidth: 0
    }
  }
  
  /**
   * @description Render page dot indicator
   * @param page
   * @return {XML}
   */
  renderIndicator(page) {
    return (
      <TouchableOpacity style={styles.tab} key={'idc_' + page} onPress={() => this.props.goToPage(page)}>
        <View style={styles.dot}/>
      </TouchableOpacity>
    );
  }
  
  render() {
    let DOT_SIZE = 6;
    let DOT_SPACE = 4;
    let pageCount = this.props.pageCount;
    let itemWidth = DOT_SIZE + (DOT_SPACE * 2);
    let offsetX = itemWidth * (this.props.activePage - this.props.scrollOffset);
    let left = this.props.scrollValue.interpolate({
      inputRange: [0, 1], outputRange: [offsetX, offsetX + itemWidth]
    });
    
    let indicators = [];
    for (let i = 0; i < pageCount; i++) {
      indicators.push(this.renderIndicator(i))
    }
    
    return (
      <View style={styles.tabs}
            onLayout={(event) => {
              let viewWidth = event.nativeEvent.layout.width;
              if (!viewWidth || this.state.viewWidth === viewWidth) {
                return;
              }
              this.setState({viewWidth});
            }}>
        {indicators}
        <Animated.View style={[styles.curDot, {left}]}/>
      </View>
    );
  }
}

export default RNSwiperIndicator;
