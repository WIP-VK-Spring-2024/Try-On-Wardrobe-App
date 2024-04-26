import { ImageType } from "./models";
import { Rating } from "./stores/common"
import { staticEndpoint } from "../config";
import { GarmentCard, Season, garmentStore } from "./stores/GarmentStore";
import { TryOnResultCard} from "./stores/TryOnStore";
import { Gender, Privacy, PostData } from "./stores/common";
import { User } from "./stores/ProfileStore";

export interface ImageSourceType {
  uri: string
}

export interface LoginSuccessResponse {
    token: string
    user_id: string
    user_name: string
    email: string
    privacy: Privacy
    gender: Gender
  } 

export const getImageSource = (image: ImageType) => {
  if (image.type === 'local') {
    return { 
      uri: 'file://' + image.uri// + `?time=${Date.now()}`
    }
  } else {
    return {
      uri: staticEndpoint + image.uri
    }
  }
}

export const deepEqualArr = (arr1: any[], arr2: any[]) => {
  return arr1.every(el => arr2.includes(el)) && arr2.every(el => arr1.includes(el));
}

interface GarmentResponse {
  uuid: string,
  name: string,
  image: string,
  type_id: string,
  subtype_id: string,
  style_id: string,
  tags: string[],
  seasons: Season[],
  tryonable: boolean,
}

export const convertLoginResponse = (resp: LoginSuccessResponse): User => {
    return new User({
        name: resp.user_name,
        uuid: resp.user_id,
        privacy: resp.privacy,
        email: resp.email,
        gender: resp.gender,
    })
}

export const convertPostResponse = (item: any): PostData => {
    return {
      ...item,
      outfit_image: {
        type: 'remote',
        uri: item.outfit_image,
      },
    };
}

export const convertGarmentResponse = (cloth: GarmentResponse) => {
  const garmentType = garmentStore.getTypeByUUID(cloth.type_id);
  const garmentSubtype = garmentStore.getSubTypeByUUID(cloth.subtype_id);
  const garmentStyle = garmentStore.getStyleByUUID(cloth.style_id);

  return new GarmentCard({
    uuid: cloth.uuid,
    name: cloth.name,
    type: garmentType,
    subtype: garmentSubtype,
    style: garmentStyle,
    image: {
      uri: cloth.image,
      type: 'remote'
    },
    tags: cloth.tags,
    seasons: cloth.seasons,
    tryOnAble: cloth.tryonable
  })
}

interface TryOnResultResponse {
  uuid: string;
  created_at: string;
  image: string;
  rating: Rating;
  user_image_id: string;
  clothes_id: string[];
}

export const convertTryOnResponse = (result: TryOnResultResponse) => {
  return new TryOnResultCard({
    uuid: result.uuid,
    created_at: result.created_at,
    image: {
      uri: result.image,
      type: 'remote',
    },
    rating: result.rating,
    user_image_id: result.user_image_id,
    clothes_id: result.clothes_id
  })
}

export const isEmpty = (obj: object) => {
  return Object.keys(obj).length === 0;
}

export const isObject = (object: any) => {
  return typeof object === 'object' && object !== null;
}

export function getUnique<G> (arr: G[]) {
  return [...new Set(arr)];
}

export function getLast (arr: string): string;
export function getLast<T> (arr: T[]): T;

export function getLast<T> (arr: string | T[]) {
  return arr[arr.length - 1];
}

export const joinPath = (...strings: string[]) => {
  const removeFirstSlash = (str: string) => {
      if (str[0] === '/') {
          return str.slice(1);
      }

      return str;
  }

  const removeLastSlash = (str: string) => {
      if (getLast(str) === '/') {
          return str.slice(0, str.length - 1)
      }

      return str;
  }

  const removeSlashes = (str: string) => {
      return removeFirstSlash(removeLastSlash(str));
  }

  const first = removeLastSlash(strings[0]);
  const last = removeFirstSlash(getLast(strings));

  return [first, ...strings.slice(1, -1).map(removeSlashes), last].join('/');
}

export function imageExists<T extends {image: ImageType | undefined}>(value: T): value is T & {image: ImageType} {
  return value.image !== undefined;
}

export function notEmpty<T>(value: T | undefined): value is T {
  return value !== undefined;
}
