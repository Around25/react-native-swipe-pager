import React, { Component } from 'react';
import { Text, View, Animated, Easing } from 'react-native';
import RNSwipePager from '@around25/react-native-swipe-pager';

import styles from './styles';

export default class App extends Component {
  constructor(props) {
    let dataSource = new RNSwipePager.DataSource({
      pageHasChanged: (p1, p2) => p1 !== p2,
    });
    super(props);
    this.state = {
      dataSource: dataSource.cloneWithPages([{name: 'Kidgarten'}, {name: 'Engage'}, {name: 'Around25'}, {name: 'CleverWash'}])
    }
  }
  
  /**
   * @description Function called when page is changed
   * @param pageIndex
   */
  onSwipe = (pageIndex) => {
    // Do whatever you want
  };
  
  
  /**
   * @description Render page with content
   * @param data
   * @return {XML}
   */
  renderPage = (data) => {
    return (
      <View style={styles.page}>
        <Text style={styles.name}>{data.name}</Text>
      </View>
    )
  };
  
  render() {
    return (
      <View style={styles.container}>
        <RNSwipePager
          style={styles.pager}
          dataSource={this.state.dataSource}
          renderSwipePage={this.renderPage}
          renderPageIndicator={false}
          autoPlay={true}
          autoPlayTimeout={1000}
          locked={true}
          onSwipe={this.onSwipe}
        />
      </View>
    );
  }
}