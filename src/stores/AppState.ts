import {makeObservable, observable, action, computed} from 'mobx';

class AppStateStore {
    error: string | undefined
    createMenuVisible: boolean
    filterModalVisible: boolean

    JWTToken: string | undefined
    userID: string | undefined
  
    constructor() {
      this.error = undefined
      this.createMenuVisible = false
      this.filterModalVisible = false;
      
      makeObservable(this, {
        error: observable,
        createMenuVisible: observable,
        filterModalVisible: observable,
  
        setError: action,
        closeError: action,
        setCreateMenuVisible: action,
        setFilterModalVisible: action,
        toggleCreateMenuVisible: action,
  
        hasError: computed
      })
    }
  
    login(JWTToken: string, userID: string) {
      this.JWTToken = JWTToken;
      this.userID = userID;
    }
    
    setError(error: string | undefined) {
      this.error = error;
    }
  
    setCreateMenuVisible(isVisible: boolean) {
      this.createMenuVisible = isVisible;
    }

    setFilterModalVisible(isVisible: boolean) {
      this.filterModalVisible = isVisible;
    }
  
    toggleCreateMenuVisible() {
      this.createMenuVisible = !this.createMenuVisible;
    }
  
    closeError() {
      this.error = undefined;
    }
  
    get hasError() {
      return this.error != undefined;
    }
}

export const appState = new AppStateStore();
