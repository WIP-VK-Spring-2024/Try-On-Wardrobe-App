import {makeObservable, observable, action, computed} from 'mobx';
import { ImageType } from '../models';

export type Season = 'winter' | 'spring' | 'summer' | 'autumn';

export interface Updateable {
  uuid: string,
  name: string
}

export interface GarmentType extends Updateable {
  uuid: string,
  name: string,
  subtypes: Updateable[]
}

export type GarmentStyle = Updateable;

export interface GarmentCard {
  uuid: string,
  name: string,
  seasons: Season[],
  note?: string,
  image: ImageType,
  type?: Updateable,
  subtype?: Updateable,
  style?: GarmentStyle,
  color: string,
}

export interface GarmentResponse {
  uuid: string,
  name: string,
  seasons: string[],
  note?: string,
  image_uri: string,
  type_uuid: string,
  subtype_uuid: string,
  style_uuid: string,
  color: string,
}

class GarmentStore {
  garments: GarmentCard[] = [];
  styles: GarmentStyle[] = [];
  types: GarmentType[] = [];

  constructor() {
    makeObservable(this, {
      garments: observable,
      styles: observable,
      types: observable,

      setStyles: action,
      setTypes: action,
      setGarments: action,
    })
  }

  setStyles(styles: GarmentStyle[]) {
    this.styles = styles;
  }

  setTypes(
    types: {uuid: string, name: string}[],
    subtypes: {uuid: string, type_uuid: string, name: string}[]
  ) {
    this.types = types.map(type => ({
      uuid: type.uuid,
      name: type.name,
      subtypes: subtypes
        .filter(subtype => subtype.type_uuid === type.uuid)
        .map(subtype => ({
          uuid: subtype.uuid, 
          name: subtype.name
        }))
    }))
  }

  setGarments(garments: GarmentCard[]) {
    this.garments = garments;
  }

  loadGarments(garments: GarmentResponse[]) {
    const recieved_garments = garments.map(garment => {
        const type = this.types.find(t => t.uuid === garment.type_uuid);
        return {
            uuid: garment.uuid,
            name: garment.name,
            seasons: garment.seasons,
            note: garment.note,
            image: {
                uri: garment.image_uri,
                type: 'remote'
            },
            type: type ? {
            uuid: type.uuid,
            name: type.name
            } : undefined,
            subtype: type?.subtypes.find(s => s.uuid === garment.subtype_uuid),
            style: this.styles.find(s => s.uuid === garment.style_uuid),
            color: garment.color,
        };
    });

    
  }
}

export const garmentStore = new GarmentStore();
