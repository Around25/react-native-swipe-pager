# @around25/react-native-swipe-pager

![npm](https://img.shields.io/npm/v/@around25/react-native-swipe-pager.svg) ![npm](https://img.shields.io/npm/l/@around25/react-native-swipe-pager.svg) ![npm](https://img.shields.io/npm/dw/@around25/react-native-swipe-pager.svg) ![npm](https://img.shields.io/npm/dt/@around25/react-native-swipe-pager.svg)

This component is a implementation of pager for React Native. It allows you to swipe between pages, turn on auto play, to set timeout for auto plat and so on.

  - works on iOS and Android

### Features
  - can render hundreds of pages
  - set auto play
  - lock swipe action
  - set timeout for auto play
  - render custom page indicator
  - enable/disable loop

### Installation

```sh
$ npm i @around25/react-native-swipe-pager --save
```

### Options

| Option | iOS    | Android | Description | Default | Options | Type
|:------:|:------:|:-------:|:----:|:-------------:|:--------:|:----:|
| `dataSource` | YES | YES | ***Required*** - Provide pages data | - | - | -
| `renderPage` | YES | YES | Render page view  | - | - | **{component}**
| `autoPlay` | YES | YES | If is set to `true`, pages will change automatically | ***false*** | *true*, *false* | **{boolean}**
| `initialPage` | YES | YES | The initial page to display. It requires the index of the page. | ***0*** | - | **{number}**
| `isLoop` | YES | YES | If is set to `true`, infinite swipe is enabled | ***false*** | *true*, *false* | **{boolean}**
| `locked` | YES | YES | If is set to `true`, swipe to change pages is disabled | ***false*** | *true*, *false* | **{boolean}**
| `renderPageIndicator` | YES | YES | If is set to `true`, indicator will hide. If is set to nothing, it will show the default indicator with dots. Custom component can be passed instead of `false` | -  | *false*, *<CustomComponent/>* | **{boolean/component}**
| `autoPlayTimeout` | YES | YES | Specify the timeout of auto play. | ***5000***  | - | **{number(miliseconds)}**
| `animation` | YES | YES | Pass custom function with animation, if not, the default animation will be applied. | -  | - | **{function}**

### Methods
| Method | Description | Type
|:------:|:-----------:|:----:|
| `onChangePage` | Callback when the page is changed | ***{function}***

### Example 

## App.js

```javascript
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

```

## styles.js
```javascript
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gray',
    height: '100%',
    width: '100%'
  },
  pager: {
    flex: 1,
    backgroundColor: 'red',
    width: '100%',
    height: '100%'
  },
  name: {
    fontSize: 40
  }
});

```
## An example with `animation` 
``` javascript
<RNSwipePager
          style={styles.pager}
          dataSource={this.state.dataSource}
          renderSwipePage={this.renderPage}
          isLoop={true}
          animation={(animatedValue, toValue, gestureState) => {
            let velocity = Math.abs(gestureState.vx);
            let baseDuration = 300;
            let duration = (velocity > 1) ? 1 / velocity * baseDuration : baseDuration;
            
            return Animated.timing(animatedValue,
              {
                toValue: toValue,
                duration: duration,
                easing: Easing.out(Easing.exp),
                bounce: 10
              });
          }}
          onSwipe={this.onSwipe}
          autoPlay={false}
        />
```

# License

MIT
