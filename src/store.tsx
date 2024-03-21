import {makeObservable, observable, action, computed} from 'mobx';
import { ImageType } from './models';
import { garmentStore } from './stores/GarmentStore';

type ItemGetter = (id: number) => any;

export class SingleSelectionStore {
  // getItem: ItemGetter;
  items: any[];
  selectedItemId: number | undefined;

  constructor(items: any[]) {
    this.items = items;
    this.selectedItemId = undefined;

    makeObservable(this, {
      selectedItemId: observable,

      select: action,
      toggle: action,

      somethingIsSelected: computed,
      selectedItem: computed
    });
  }

  // setItemGetter(getItem: ItemGetter) {
  //   this.getItem = getItem;
  // }

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
    });
  }

  setResultUrl(url: string) {
    this.resultUrl = url;
  }
}

export const garmentScreenSelectionStore = new SingleSelectionStore(garmentStore.garments);
export const resultStore = new ResultStore();
