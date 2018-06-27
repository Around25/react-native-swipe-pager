import { StyleSheet, Dimensions } from 'react-native';

let DOT_SIZE = 6;
let DOT_SPACE = 4;

export default StyleSheet.create({
  tab: {
    alignItems: 'center',
  },
  
  tabs: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: '#E0E1E2',
    marginLeft: DOT_SPACE,
    marginRight: DOT_SPACE,
  },
  
  curDot: {
    position: 'absolute',
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: '#80ACD0',
    margin: DOT_SPACE,
    bottom: 0,
  },
});
