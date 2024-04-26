import { makeObservable, observable, action, autorun } from 'mobx';
import { GarmentCard, GarmentType, garmentStore, Updateable, typeIsTryOnAble } from './stores/GarmentStore';
import { userPhotoStore } from './stores/UserPhotoStore';
import { FilterStore } from './stores/FilterStore';
import { MultipleSelectionStore, SingleSelectionStore } from './stores/SelectionStore';
import { Rating } from './stores/common'

class ResultStore {
  resultUrl: string | undefined;
  resultUUID: string | undefined;
  resultRating: Rating;

  constructor() {
    this.resultUrl = undefined;
    this.resultUUID = undefined;
    this.resultRating = Rating.None;

    makeObservable(this, {
      resultUrl: observable,
      resultUUID: observable,
      resultRating: observable,

      setResultUrl: action,
      setResultUUID: action,
      setResultRating: action,
      clearResult: action
    });
  }

  setResultUrl(url: string) {
    this.resultUrl = url;
  }

  setResultUUID(uuid: string) {
    this.resultUUID = uuid;
  }

  setResultRating(rating: Rating) {
    this.resultRating = rating;
  }

  clearResult() {
    this.resultUrl = undefined;
    this.resultUUID = undefined;
    this.resultRating = Rating.None;
  }
}

const makeGarmentFilter = (): [
  FilterStore<GarmentCard>,
  MultipleSelectionStore<GarmentCard>,
  SingleSelectionStore<GarmentType>,
  SingleSelectionStore<Updateable>,
  MultipleSelectionStore<string>,
  MultipleSelectionStore<string>
] => {
  const filteredGarmentStore = new FilterStore({
    origin: garmentStore.garments
  });
  
  const garmentSelectionStore = new MultipleSelectionStore(filteredGarmentStore.items);

  autorun(() => {
    JSON.stringify(garmentStore.garments)
    filteredGarmentStore.setOrigin(garmentStore.garments);
  })

  autorun(() => {
    garmentSelectionStore.setItems(filteredGarmentStore.items);
  })

  const garmentTypeSelectionStore = new SingleSelectionStore(garmentStore.usedTypes);
  const garmentSubtypeSelectionStore = new SingleSelectionStore<Updateable>([]);

  autorun(() => {
    garmentTypeSelectionStore.setItems(garmentStore.usedTypes);
  })

  autorun(() => {
    if (garmentTypeSelectionStore.somethingIsSelected) {
      garmentSubtypeSelectionStore.setItems(garmentTypeSelectionStore.selectedItem?.subtypes || []);
      filteredGarmentStore.setFilter('type_filter', (item: GarmentCard) => item.type?.uuid === garmentTypeSelectionStore.selectedItem?.uuid);
    } else {
      garmentSubtypeSelectionStore.setItems([]);
      garmentSubtypeSelectionStore.unselect();
      filteredGarmentStore.removeFilter('type_filter');
    }
  })
  
  autorun(() => {
    if (garmentTypeSelectionStore.somethingIsSelected && 
        garmentSubtypeSelectionStore.somethingIsSelected) {
      filteredGarmentStore.setFilter('subtype_filter', (item: GarmentCard) => item.subtype?.uuid === garmentSubtypeSelectionStore.selectedItem?.uuid);
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
      filteredGarmentStore.setFilter('style_filter', 
        (item: GarmentCard) => styleFilterSelectionStore.selectedItems.includes(item.style?.uuid!))
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

// tryOnScreenFilteredGarmentStore.setFilter('tryonable', item => item.tryOnAble)

// autorun(() => {
//   const values = garmentStore.garments.filter(garment => typeIsTryOnAble(garment.type!));
//   console.log('values', values);
//   tryOnScreenFilteredGarmentStore.setOrigin(values)
// })

const [
  outfitScreenFilteredGarmentStore,
  outfitScreenGarmentSelectionStore,
  outfitScreenTypeSelectionStore,
  outfitScreenSubtypeSelectionStore,
  outfitScreenStyleSelectionStore,
  outfitScreenTagsSelectionStore,
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

  outfitScreenFilteredGarmentStore,
  outfitScreenGarmentSelectionStore,
  outfitScreenTypeSelectionStore,
  outfitScreenSubtypeSelectionStore,
  outfitScreenStyleSelectionStore,
  outfitScreenTagsSelectionStore,
}

export const userPhotoSelectionStore = new SingleSelectionStore(userPhotoStore.photos);

autorun(() => {
  userPhotoSelectionStore.setItems(userPhotoStore.photos);
})

export const resultStore = new ResultStore();
