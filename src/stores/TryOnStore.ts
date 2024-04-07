import {makeObservable, observable, action} from 'mobx';
import { ImageType } from "../models"

export enum Rating {
  None = 0,
  Like = 1,
  Dislike = -1,
}

export interface TryOnResultCardProps {
  uuid: string;
  created_at: string;
  image: ImageType;
  rating: Rating;
  user_image_id: string;
  clothes_id: string;
}

export class TryOnResultCard {
  uuid: string;
  created_at: string;
  image: ImageType;
  rating: Rating;
  user_image_id: string;
  clothes_id: string;

  constructor(props: TryOnResultCardProps) {
    this.uuid = props.uuid;
    this.created_at = props.created_at;
    this.image = props.image;
    this.rating = props.rating;
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
  results: TryOnResultCard[] = [];

  constructor() {
    makeObservable(this, {
      results: observable,

      setResults: action,
      removeResult: action,
      addResult: action,
    });
  }

  setResults(results: TryOnResultCard[]) {
    this.results = results;
  }

  removeResult(result: TryOnResultCard) {
    this.results.push(result);
  }

  addResult(result_uuid: string) {
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
}

export const tryOnStore = new TryOnStore();
