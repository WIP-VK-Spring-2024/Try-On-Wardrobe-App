import {makeObservable, observable, action, computed, runInAction, observe, autorun} from 'mobx';
import { ImageType } from '../models';
import { deepEqualArr, getUnique, notEmpty } from '../utils';

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
  type?: GarmentType,
  subtype?: Updateable,
  style?: GarmentStyle,
  color?: string,
  tags?: string[],
  tryOnAble?: boolean
}

export class GarmentCard {
  uuid?: string
  name: string
  seasons: Season[]
  // note?: string
  image: ImageType
  type?: GarmentType
  subtype?: Updateable
  style?: GarmentStyle
  color?: string
  tags: string[]
  tryOnAble: boolean

  constructor(props: GarmentCardProps) {
    this.uuid = props.uuid;
    this.name = props.name || 'Без названия';
    this.seasons = props.seasons || [];
    this.image = props.image;
    this.type = props.type;
    this.subtype = props.subtype;
    this.style = props.style;
    // this.color = props.color;
    this.tags = props.tags || [];
    this.tryOnAble = props.tryOnAble || false;

    makeObservable(this, {
      uuid: observable,
      name: observable,
      seasons: observable,
      image: observable,
      type: observable,
      subtype: observable,
      style: observable,
      // color: observable,
      tags: observable,
      tryOnAble: observable,

      setUUID: action,
      setName: action,
      setSeasons: action,
      toggleSeason: action,
      setImage: action,
      setType: action,
      setSubtype: action,
      setStyle: action,
      setTags: action,
      addTag: action,
      removeTag: action,
      setTryOnAble: action,
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
        found = true;
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

  setType(type: GarmentType) {
    this.type = type;
  }

  setSubtype(subtype: Updateable | undefined) {
    this.subtype = subtype;
  }

  setStyle(style: GarmentStyle) {
    this.style = style;
  }

  setTags(tags: string[]) {
    this.tags = tags;
  }

  addTag(tag: string) {
    this.tags.push(tag);
  }

  removeTag(tag: string) {
    const index = this.tags.indexOf(tag);

    if (index > -1) {
      this.tags.splice(index, 1);
    }
  }

  setTryOnAble(tryOnAble: boolean) {
    this.tryOnAble = tryOnAble;
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
    this.garments = [];
    this.styles = [];
    this.types = [];

    makeObservable(this, {
      garments: observable,
      styles: observable,
      types: observable,

      setStyles: action,
      setTypes: action,
      setGarments: action,

      addGarment: action,
      removeGarment: action,

      tags: computed,
      subtypes: computed,

      usedTypes: computed,
      usedSubtypes: computed,
    })
  }

  setStyles(styles: GarmentStyle[]) {
    this.styles = styles;
  }

  setTypes(types: GarmentType[]) {
    this.types = types;
  }

  setGarments(garments: GarmentCard[]) {
    this.garments = garments;
  }

  addGarment(garment: GarmentCard) {
    this.garments.push(garment);
  }

  removeGarment(garment_uuid: string) {
    const index = this.garments.findIndex(g => g.uuid === garment_uuid);

    if (index !== -1) {
      this.garments.splice(index, 1);
    }
  }

  getAllSubtypes(type: Updateable | undefined) {
    if (type === undefined) {
      return [];
    }

    return this.types.find(t => t.uuid === type.uuid)?.subtypes || [];
  }

  getTypeByUUID = (uuid: string) => {
    return this.types.find(t => t.uuid === uuid);
  }

  getSubTypeByUUID = (uuid: string) => {
    return this.subtypes.find(t => t.uuid === uuid);
  }

  getStyleByUUID = (uuid: string) => {
    return this.styles.find(st => st.uuid === uuid);
  }

  get tags() {
    return Array.from(
                new Set(
                  this.garments.reduce(
                    (tags: string[], garment) => tags.concat(garment.tags), []
                  )
                )
              ).sort((a, b) => a < b ? -1 : 1);
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

  getGarmentByUUID(uuid: string) {
    return this.garments.find(garment => garment.uuid === uuid);
  }

  get subtypes() {
    return this.types.map(type => type.subtypes)
                     .reduce((total, subs) => total.concat(subs));
  }

  get usedTypes(): GarmentType[] {
    return getUnique(this.garments.map(garment => garment.type?.uuid))
            .filter(notEmpty)
            .map(garmentStore.getTypeByUUID)
            .filter(notEmpty)
            .map(type => ({
              name: type.name,
              uuid: type.uuid,
              subtypes: type.subtypes.filter(sub => this.usedSubtypes.has(sub))
            }));
  }

  get usedSubtypes() {
    return new Set(this.garments.map(garment => garment.subtype));
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

      setOrigin: action,
      clearChanges: action,
      saveChanges: action,

      hasChanges: computed
    });
  }

  setOrigin(origin: GarmentCard) {
    this.origin = origin;
  }

  get hasChanges() {
    return !(
      this.uuid === this.origin.uuid &&
      this.name === this.origin.name &&
      deepEqualArr(this.seasons, this.origin.seasons) &&
      deepEqualArr(this.tags, this.origin.tags) &&
      this.type === this.origin.type &&
      this.subtype === this.origin.subtype &&
      this.style === this.origin.style &&
      this.color === this.origin.color
    );
  }

  clearChanges() {
    this.uuid = this.origin.uuid;
    this.name = this.origin.name;
    this.seasons = this.origin.seasons.slice();
    this.image = this.origin.image;
    this.type = this.origin.type;
    this.subtype = this.origin.subtype;
    this.style = this.origin.style;
    this.color = this.origin.color;

    this.tags = this.origin.tags.slice();
  }

  saveChanges() {
    this.origin.uuid = this.uuid;
    this.origin.name = this.name;
    this.origin.seasons = this.seasons.slice();
    this.origin.image = this.image;
    this.origin.type = this.type;
    this.origin.subtype = this.subtype;
    this.origin.style = this.style;
    this.origin.color = this.color;

    this.origin.tags = this.tags.slice();
  }
};

export const garmentStore = new GarmentStore();
