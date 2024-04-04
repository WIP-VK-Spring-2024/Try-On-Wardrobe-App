import { makeObservable, observable, action, computed, autorun } from 'mobx';
import { GarmentCard, garmentStore } from './stores/GarmentStore';
import { userPhotoStore } from './stores/UserPhotoStore';
import { FilterStore } from './stores/FilterStore';
import { MultipleSelectionStore, SingleSelectionStore } from './stores/SelectionStore';

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

const makeGarmentFilter = (): [
  FilterStore,
  SingleSelectionStore,
  SingleSelectionStore,
  SingleSelectionStore,
  MultipleSelectionStore,
  MultipleSelectionStore
] => {
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

  const styleFilterSelectionStore = new MultipleSelectionStore(garmentStore.styles.map(style=>style.uuid));

  autorun(() => {
    styleFilterSelectionStore.setItems(garmentStore.styles.map(style=>style.uuid));
  })

  const tagFilterSelectionStore = new MultipleSelectionStore(garmentStore.tags);

  autorun(() => {
    tagFilterSelectionStore.setItems(garmentStore.tags);
  })

  autorun(() => {
    if (styleFilterSelectionStore.selectedItems.length > 0) {
      filteredGarmentStore.setFilter('style_filter', (item: GarmentCard) => styleFilterSelectionStore.selectedItems.includes(item.style?.uuid))
    } else {
      filteredGarmentStore.removeFilter('style_filter');
    }
  })

  autorun(() => {
    if (tagFilterSelectionStore.selectedItems.length > 0) {
      filteredGarmentStore.setFilter('tag_filter', 
        (item: GarmentCard) => item.tags.map(tag => tagFilterSelectionStore.selectedItems.includes(tag)).some((b => b)))
    } else {
      filteredGarmentStore.removeFilter('tag_filter');
    }
  })

  return [
    filteredGarmentStore,
    garmentSelectionStore,
    garmentTypeSelectionStore,
    garmentSubtypeSelectionStore,
    styleFilterSelectionStore,
    tagFilterSelectionStore
  ]
}

const [
  garmentScreenFilteredGarmentStore,
  garmentScreenGarmentSelectionStore,
  garmentScreenTypeSelectionStore,
  garmentScreenSubtypeSelectionStore,
  garmentScreenStyleSelectionStore,
  garmentScreenTagsSelectionStore,
] = makeGarmentFilter();

const [
  tryOnScreenFilteredGarmentStore,
  tryOnScreenGarmentSelectionStore,
  tryOnScreenTypeSelectionStore,
  tryOnScreenSubtypeSelectionStore,
  tryOnScreenStyleSelectionStore,
  tryOnScreenTagsSelectionStore,
] = makeGarmentFilter();

export {
  garmentScreenFilteredGarmentStore,
  garmentScreenGarmentSelectionStore,
  garmentScreenTypeSelectionStore,
  garmentScreenSubtypeSelectionStore,
  garmentScreenStyleSelectionStore,
  garmentScreenTagsSelectionStore,

  tryOnScreenFilteredGarmentStore,
  tryOnScreenGarmentSelectionStore,
  tryOnScreenTypeSelectionStore,
  tryOnScreenSubtypeSelectionStore,
  tryOnScreenStyleSelectionStore,
  tryOnScreenTagsSelectionStore,
}

export const userPhotoSelectionStore = new SingleSelectionStore(userPhotoStore.photos);

autorun(() => {
  userPhotoSelectionStore.setItems(userPhotoStore.photos);
})

export const resultStore = new ResultStore();
