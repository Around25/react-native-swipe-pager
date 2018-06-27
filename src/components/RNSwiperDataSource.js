function defaultGetPageData(dataBlob, pageID,) {
  return dataBlob[pageID];
}

class RNSwiperDataSource {
  
  constructor(params) {
    this._getPageData = params.getPageData || defaultGetPageData;
    this._pageHasChanged = params.pageHasChanged;
    this.pageIdentities = [];
  }
  
  cloneWithPages(dataBlob, pageIdentities) {
    let newSource = new RNSwiperDataSource({
      getPageData: this._getPageData,
      pageHasChanged: this._pageHasChanged,
    });
    
    newSource._dataBlob = dataBlob;
    
    if (pageIdentities) {
      newSource.pageIdentities = pageIdentities;
    } else {
      newSource.pageIdentities = Object.keys(dataBlob);
    }
    
    newSource._cachedPageCount = newSource.pageIdentities.length;
    newSource._calculateDirtyPages(
      this._dataBlob,
      this.pageIdentities
    );
    return newSource;
  }
  
  getPageCount(){
    return this._cachedPageCount;
  }
  
  /**
   * Returns if the row is dirtied and needs to be rerendered
   */
  pageShouldUpdate(pageIndex) {
    return this._dirtyPages[pageIndex];
  }
  
  /**
   * Gets the data required to render the page
   */
  getPageData(pageIndex) {
    if (!this.getPageData) {
      return null;
    }
    let pageID = this.pageIdentities[pageIndex];
    return this._getPageData(this._dataBlob,pageID);
  }
  
  
  _calculateDirtyPages( prevDataBlob, prevPageIDs,) {
    let prevPagesHash = keyedDictionaryFromArray(prevPageIDs);
    this._dirtyPages = [];
    
    let dirty;
    for (let sIndex = 0; sIndex < this.pageIdentities.length; sIndex++) {
      let pageID = this.pageIdentities[sIndex];
      dirty = !prevPagesHash[pageID];
      let pageHasChanged = this._pageHasChanged;
      if (!dirty && pageHasChanged) {
        dirty = pageHasChanged(
          this._getPageData(prevDataBlob, pageID),
          this._getPageData(this._dataBlob, pageID)
        );
      }
      this._dirtyPages.push(!!dirty);
    }
  }
  
}

function keyedDictionaryFromArray(arr) {
  if (arr.length === 0) {
    return {};
  }
  let result = {};
  for (let ii = 0; ii < arr.length; ii++) {
    let key = arr[ii];
    result[key] = true;
  }
  return result;
}

export default RNSwiperDataSource
