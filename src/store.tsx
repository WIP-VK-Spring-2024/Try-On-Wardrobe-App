import { makeObservable, observable, action, computed, observe, autorun } from 'mobx';
import { GarmentCard, garmentStore } from './stores/GarmentStore';
import { userPhotoStore } from './stores/UserPhotoStore';
import { filteredGarmentStore } from './stores/FilterStore';

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
      unselect: action,

      somethingIsSelected: computed,
      selectedItem: computed
    });
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

autorun(() => {
  garmentScreenSelectionStore.setItems(filteredGarmentStore.items);
})

export const userPhotoSelectionStore = new SingleSelectionStore(userPhotoStore.photos);

autorun(() => {
  userPhotoSelectionStore.setItems(userPhotoStore.photos);
})

export const garmentTypeSelectionStore = new SingleSelectionStore(garmentStore.types);
export const garmentSubtypeSelectionStore = new SingleSelectionStore([]);

autorun(() => {
  garmentTypeSelectionStore.setItems(garmentStore.types);

})

autorun(() => {
  if (garmentTypeSelectionStore.somethingIsSelected) {
    garmentSubtypeSelectionStore.setItems(garmentTypeSelectionStore.selectedItem.subtypes);
    filteredGarmentStore.setFilter('type_filter', (item: GarmentCard) => item.type?.uuid === garmentTypeSelectionStore.selectedItem.uuid);
  } else {
    garmentSubtypeSelectionStore.setItems([]);
    garmentSubtypeSelectionStore.unselect();
    filteredGarmentStore.removeFilter('type_filter');
  }
})

autorun(() => {
  if (garmentTypeSelectionStore.somethingIsSelected && 
      garmentSubtypeSelectionStore.somethingIsSelected) {
    filteredGarmentStore.setFilter('subtype_filter', (item: GarmentCard) => item.subtype?.uuid === garmentSubtypeSelectionStore.selectedItem.uuid);
  } else {
    filteredGarmentStore.removeFilter('subtype_filter');
  }
})

export const resultStore = new ResultStore();
