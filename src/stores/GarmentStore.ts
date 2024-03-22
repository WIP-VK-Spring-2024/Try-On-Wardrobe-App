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

export interface GarmentCardProps {
  uuid?: string,
  name?: string,
  seasons?: Season[],
  note?: string,
  image: ImageType,
  type?: Updateable,
  subtype?: Updateable,
  style?: GarmentStyle,
  color?: string,
}

export class GarmentCard {
  uuid?: string
  name: string
  seasons: Season[]
  // note?: string
  image: ImageType
  type?: Updateable
  subtype?: Updateable
  style?: GarmentStyle
  color?: string

  constructor(props: GarmentCardProps) {
    this.uuid = props.uuid;
    this.name = props.name || 'Без названия';
    this.seasons = props.seasons || [];
    this.image = props.image;
    this.type = props.type;
    this.subtype = props.subtype;
    this.style = props.style;
    this.color = props.color;

    makeObservable(this, {
      uuid: observable,
      name: observable,
      seasons: observable,
      image: observable,
      type: observable,
      subtype: observable,
      style: observable,
      // color: observable,

      setUUID: action,
      setName: action,
      setSeasons: action,
      toggleSeason: action,
      setImage: action,
      setType: action,
      setSubtype: action,
      setStyle: action
    })
  }

  setUUID(uuid: string) {
    this.uuid = uuid;
  }

  setName(name: string) {
    this.name = name;
  }

  setSeasons(seasons: Season[]) {
    this.seasons = seasons;
  }

  toggleSeason(season: Season) {
    let found = false;
    for (let i = 0; i < this.seasons.length; i++) {
      if (this.seasons[i] === season) {
        this.seasons.splice(i, 1);
        break;
      }
    }

    if (!found) {
      this.seasons.push(season);
    }
  }

  setImage(image: ImageType) {
    this.image = image;
  }

  setType(type: Updateable) {
    this.type = type;
  }

  setSubtype(subtype: Updateable) {
    this.subtype = subtype;
  }

  setStyle(style: GarmentStyle) {
    this.style = style;
  }
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

export class GarmentStore {
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

  getAllSubtypes(type: Updateable | undefined) {
    if (type === undefined) {
      return [];
    }

    return this.types.find(t => t.uuid === type.uuid)?.subtypes || [];
  }

  getTypeByUUID(uuid: string) {
    return this.types.find(t => t.uuid === uuid);
  }

  getSubTypeByUUID(uuid: string) {
    return this.subtypes.find(t => t.uuid === uuid);
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

  get subtypes() {
    return this.types.map(type => type.subtypes)
                     .reduce((total, subs) => total.concat(subs));
  }
}

export class GarmentCardEdit extends GarmentCard {
  origin: GarmentCard;

  constructor(origin: GarmentCard) {
    super(origin)

    this.origin = origin;

    this.clearChanges();

    makeObservable(this, {
      origin: observable,
      clearChanges: action,
      saveChanges: action
    });
  }

  clearChanges() {
    this.uuid = this.origin.uuid;
    this.name = this.origin.name;
    this.seasons = this.origin.seasons;
    this.image = this.origin.image;
    this.type = this.origin.type;
    this.subtype = this.origin.subtype;
    this.style = this.origin.style;
    this.color = this.origin.color;
  }

  saveChanges() {
    this.origin.uuid = this.uuid;
    this.origin.name = this.name;
    this.origin.seasons = this.seasons;
    this.origin.image = this.image;
    this.origin.type = this.type;
    this.origin.subtype = this.subtype;
    this.origin.style = this.style;
    this.origin.color = this.color;
  }
};

export const garmentStore = new GarmentStore();
