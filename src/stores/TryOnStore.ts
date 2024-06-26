import {makeObservable, observable, action, computed} from 'mobx';
import { ImageType } from "../models"
import { MultipleSelectionStore } from './SelectionStore';
import { GARMENT_TYPE_DRESS, GARMENT_TYPE_LOWER, GARMENT_TYPE_UPPER, GarmentCard } from './GarmentStore';
import { tryOnScreenGarmentSelectionStore } from '../store';
import { Rating } from './common'
import { asCreateObservableOptions } from 'mobx/dist/internal';

export interface TryOnResultProps {
  uuid: string;
  created_at: string;
  image: ImageType;
  rating?: Rating;
  user_image_id: string;
  clothes_id: string[];
}

export class TryOnResult {
  uuid: string;
  created_at: string;
  image: ImageType;
  rating: Rating;
  user_image_id: string;
  clothes_id: string[];

  constructor(props: TryOnResultProps) {
    this.uuid = props.uuid;
    this.created_at = props.created_at;
    this.image = props.image;
    this.rating = props.rating || 0;
    this.user_image_id = props.user_image_id;
    this.clothes_id = props.clothes_id;

    makeObservable(this, {
      uuid: observable,
      created_at: observable,
      image: observable,
      rating: observable,
      user_image_id: observable,
      clothes_id: observable,

      setRating: action,
    });
  }

  setRating(rating: Rating) {
    this.rating = rating;
  }
}

export class TryOnStore {
  results: TryOnResult[] = [];

  constructor() {
    makeObservable(this, {
      results: observable,

      setResults: action,
      removeResult: action,
      addResult: action,
      clear: action,
    });
  }

  setResults(results: TryOnResult[]) {
    this.results = results;
  }

  addResult(result: TryOnResult) {
    this.results.unshift(result);
  }

  removeResult(result_uuid: string) {
    const index = this.results.findIndex(r => r.uuid === result_uuid);

    if (index !== -1) {
      this.results.splice(index, 1);
    }
  }

  rateResult(result_uuid: string, rating: Rating) {
    const index = this.results.findIndex(r => r.uuid === result_uuid);

    if (index !== -1) {
      this.results[index].setRating(rating);
    }
  }

  clear() {
    this.results = [];
  }
}

export const tryOnStore = new TryOnStore();

const allTypes = new Set([GARMENT_TYPE_DRESS, GARMENT_TYPE_LOWER, GARMENT_TYPE_UPPER]);

class TryOnValidationStore {
  origin: MultipleSelectionStore<GarmentCard>

  constructor(origin: MultipleSelectionStore<GarmentCard>) {
    this.origin = origin; 

    makeObservable(this, {
      origin: observable,
      selectedTypes: computed,
      selectableTypes: computed,
    });
  }

  get selectedTypes(): Set<string> {
    return new Set(this.origin.selectedItems.map(item => item.type!.name));
  }

  get selectableTypes(): Set<string> {
    if (this.selectedTypes.has(GARMENT_TYPE_DRESS)) {
        return new Set();
    }

    const result = new Set(allTypes);

    if (this.selectedTypes.has(GARMENT_TYPE_LOWER)) {
        result.delete(GARMENT_TYPE_LOWER);
        result.delete(GARMENT_TYPE_DRESS);
    }

    if (this.selectedTypes.has(GARMENT_TYPE_UPPER)) {
        result.delete(GARMENT_TYPE_UPPER);
        result.delete(GARMENT_TYPE_DRESS);
    }

    return result;
  }

  isSelectable(type: string): boolean {
    return type != '' && this.selectableTypes.has(type)
  }
}

export const tryOnValidationStore = new TryOnValidationStore(tryOnScreenGarmentSelectionStore);
