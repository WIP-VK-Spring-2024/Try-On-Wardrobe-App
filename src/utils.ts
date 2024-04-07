import { ImageType } from "./models";
import RNFS from 'react-native-fs';
import { staticEndpoint } from "../config";
import { GarmentCard, Season, garmentStore } from "./stores/GarmentStore";
import { Rating, TryOnResultCard} from "./stores/TryOnStore";

export const getImageSource = (image: ImageType) => {
  if (image.type === 'local') {
    return { 
      uri: 'file://' + RNFS.DocumentDirectoryPath + '/images/clothes' + image.uri 
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
  type_id: string,
  subtype_id: string,
  style_id: string,
  tags: string[],
  seasons: Season[]
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
      uri: `/cut/${cloth.uuid}`,
      type: 'remote'
    },
    tags: cloth.tags,
    seasons: cloth.seasons
  })
}

interface TryOnResultResponse {
  uuid: string;
  created_at: string;
  image: string;
  rating: Rating;
  user_image_id: string;
  clothes_id: string;
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
