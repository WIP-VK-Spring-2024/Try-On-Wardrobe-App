import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';
import { apiEndpoint } from '../../config';
import { GarmentCard, garmentStore } from '../stores/GarmentStore';
import { userPhotoStore } from '../stores/UserPhotoStore';
import { appState } from '../stores/AppState';
import { Outfit } from '../stores/OutfitStore';

import RNFS from 'react-native-fs';
import { ajax } from './common';

const uploadGarmentImage = (image: ImageOrVideo) => {
    console.log('upload')
    const image_p = image.path.split('/');
    const image_name = image_p[image_p.length - 1];

    let formData = new FormData();

    console.log(image)

    formData.append('img', {
        type: "image/png",
        name: image_name,
        uri: image.path
    });

    return ajax.apiPost('/clothes', {
        credentials: true,
        body: formData
    }).then(resp => {
        console.log(resp);
        
        return resp.json().then(res => {
        garmentStore.addGarment(new GarmentCard({
            uuid: res.uuid,
            name: 'Без названия',
            image: {
                uri: res.image,
                type: 'remote'
            },
            tags: [],
            seasons: []
        }))
        appState.setCreateMenuVisible(false);
        return true;
    }).catch(err => console.error(err))
})
    .catch(err => console.error(err));
}

const uploadUserPhoto = (image: ImageOrVideo) => {
    const image_p = image.path.split('/');
    const image_name = image_p[image_p.length - 1];

    let formData = new FormData();

    formData.append('img', {
        type: "image/png",
        name: image_name,
        uri: image.path
    });

    return ajax.apiPost('/photos', {
        credentials: true,
        body: formData
    }).then(resp => {console.log(resp), resp.json().then(res => {
        userPhotoStore.addPhoto({
            uuid: res.uuid,
            image: {
                uri: '/'+res.image,
                type: 'remote'
            }
        })
        appState.setCreateMenuVisible(false);
        return true;
    })})
    .catch(err => console.error(err));
}

export const createGarmentFromGallery = async () => {
    return ImagePicker.openPicker({
      cropping: true,
    })
        .then(uploadGarmentImage)
        .catch(reason => console.log(reason))
}

export const createGarmentFromCamera = async () => {
    return ImagePicker.openCamera({
        cropping: true,
    })
        .then(uploadGarmentImage)
        .catch(reason => console.log(reason))
}

export const createUserPhotoFromGallery = async () => {
    return ImagePicker.openPicker({
      cropping: true,
    })
        .then(uploadUserPhoto)
        .catch(reason => {console.log(reason); return false})
}
