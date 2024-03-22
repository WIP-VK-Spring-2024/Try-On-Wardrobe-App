import {makeObservable, observable, action, computed} from 'mobx';
import { garmentStore } from './stores/GarmentStore';

export class SingleSelectionStore {
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
