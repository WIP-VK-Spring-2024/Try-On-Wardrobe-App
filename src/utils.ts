import { ImageType } from "./models";
import RNFS from 'react-native-fs';
import { staticEndpoint } from "../config";

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