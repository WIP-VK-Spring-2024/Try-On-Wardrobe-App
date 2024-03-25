import { makeObservable, observable, action, computed, observe } from 'mobx';
import { garmentStore } from './stores/GarmentStore';
import { userPhotoStore } from './stores/UserPhotoStore';

export class SingleSelectionStore {
  items: any[];
  selectedItemId: number | undefined;

  constructor(items: any[]) {
    this.items = items;
    this.selectedItemId = undefined;

    makeObservable(this, {
      items: observable,
      selectedItemId: observable,

      select: action,
      toggle: action,
      setItems: action,

      somethingIsSelected: computed,
      selectedItem: computed
    });

    const disposer = observe(items, change => {
      console.log('changed', change.object)
    })
  }

  setItems(items: any) {
    this.items = items;
  }

  select(id: number) {
    this.selectedItemId = id;
  }

  toggle(id: number) {
    if (this.selectedItemId === id) {
      this.selectedItemId = undefined;
    } else {
      this.selectedItemId = id;
    }
  }

  unselect() {
    this.selectedItemId = undefined;
  }

  get somethingIsSelected() {
    return this.selectedItemId !== undefined;
  }

  get selectedItem() {
    if (this.selectedItemId === undefined)
      return undefined;

    return this.items[this.selectedItemId];
  }
}

class ResultStore {
  resultUrl: string | undefined;

  constructor() {
    this.resultUrl = undefined;
    makeObservable(this, {
      resultUrl: observable,

      setResultUrl: action,
      clearResult: action
    });
  }

  setResultUrl(url: string) {
    this.resultUrl = url;
  }

  clearResult() {
    this.resultUrl = undefined;
  }
}

export const garmentScreenSelectionStore = new SingleSelectionStore(garmentStore.garments);

observe(garmentStore, 'garments', change => {
  garmentScreenSelectionStore.setItems(garmentStore.garments);
})


export const userPhotoSelectionStore = new SingleSelectionStore(userPhotoStore.photos);

observe(userPhotoStore, 'photos', change => {
  userPhotoSelectionStore.setItems(userPhotoStore.photos);
})

export const resultStore = new ResultStore();
