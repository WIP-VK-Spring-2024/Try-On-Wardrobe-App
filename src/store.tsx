import { makeObservable, observable, action, computed, autorun } from 'mobx';
import { GarmentCard, garmentStore } from './stores/GarmentStore';
import { userPhotoStore } from './stores/UserPhotoStore';
import { FilterStore } from './stores/FilterStore';

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

const makeTypeFilter = (): [FilterStore, SingleSelectionStore, SingleSelectionStore, SingleSelectionStore] => {
  const filteredGarmentStore = new FilterStore({
    origin: garmentStore.garments
  });
  
  const garmentSelectionStore = new SingleSelectionStore(filteredGarmentStore.items);

  autorun(() => {
    filteredGarmentStore.setOrigin(garmentStore.garments);
  })

  autorun(() => {
    garmentSelectionStore.setItems(filteredGarmentStore.items);
  })

  const garmentTypeSelectionStore = new SingleSelectionStore(garmentStore.types);
  const garmentSubtypeSelectionStore = new SingleSelectionStore([]);

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

  return [
    filteredGarmentStore,
    garmentSelectionStore,
    garmentTypeSelectionStore,
    garmentSubtypeSelectionStore
  ]
}

const [
  garmentScreenFilteredGarmentStore,
  garmentScreenGarmentSelectionStore,
  garmentScreenTypeSelectionStore,
  garmentScreenSubtypeSelectionStore
] = makeTypeFilter();

const [
  tryOnScreenFilteredGarmentStore,
  tryOnScreenGarmentSelectionStore,
  tryOnScreenTypeSelectionStore,
  tryOnScreenSubtypeSelectionStore
] = makeTypeFilter();

export {
  garmentScreenFilteredGarmentStore,
  garmentScreenGarmentSelectionStore,
  garmentScreenTypeSelectionStore,
  garmentScreenSubtypeSelectionStore,

  tryOnScreenFilteredGarmentStore,
  tryOnScreenGarmentSelectionStore,
  tryOnScreenTypeSelectionStore,
  tryOnScreenSubtypeSelectionStore,
}

export const userPhotoSelectionStore = new SingleSelectionStore(userPhotoStore.photos);

autorun(() => {
  userPhotoSelectionStore.setItems(userPhotoStore.photos);
})

export const resultStore = new ResultStore();
