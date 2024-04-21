import {makeObservable, observable, action, computed} from 'mobx';

export type Screen = 'Home' | 'TryOn' | 'Feed' | 'OutfitSelection'

export const processNetworkError = (err: any) => {
  console.log(err);
  appState.setError('network')
}

class AppStateStore {
    error: string | undefined
    successMessage: string | undefined

    createMenuVisible: boolean
    filterModalVisible: boolean

    JWTToken: string | undefined
    userID: string | undefined
    userName: string

    screen: Screen
  
    constructor() {
      this.error = undefined
      this.successMessage = undefined
      this.createMenuVisible = false
      this.filterModalVisible = false;
      this.screen = 'Home'
      this.userName = ''
      
      makeObservable(this, {
        error: observable,
        successMessage: observable,
        createMenuVisible: observable,
        filterModalVisible: observable,
        userName: observable,
        screen: observable,
  
        setError: action,
        setUserName: action,
        setSuccessMessage: action,
        closeError: action,
        closeSuccessMessage: action,
        setCreateMenuVisible: action,
        setFilterModalVisible: action,
        toggleCreateMenuVisible: action,
        setScreen: action,
  
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

    setScreen(screen: Screen) {
      this.screen = screen;
    }
  
    setUserName(name: string) {
      this.userName = name;
    }

    setSuccessMessage(msg: string | undefined) {
      this.successMessage = msg;
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
    
    closeSuccessMessage() {
      this.successMessage = undefined;
    }
  
    get hasError() {
      return this.error != undefined;
    }
}

export const appState = new AppStateStore();
