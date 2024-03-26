import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';
import { apiEndpoint } from '../../config';
import { GarmentCard, garmentStore } from '../stores/GarmentStore';
import { garmentScreenSelectionStore } from '../store';
import { userPhotoStore } from '../stores/UserPhotoStore';
import { appState } from '../stores/AppState';

const uploadGarmentImage = (image: ImageOrVideo) => {
    const image_p = image.path.split('/');
    const image_name = image_p[image_p.length - 1];

    let formData = new FormData();

    formData.append('img', {
        type: "image/png",
        name: image_name,
        uri: image.path
    });

    return fetch(apiEndpoint + '/clothes', {
        method: 'POST',
        body: formData
    }).then(resp => resp.json().then(res => {
        garmentStore.addGarment(new GarmentCard({
            uuid: res.uuid,
            name: 'Без названия',
            image: {
                uri: `/cut/${res.uuid}`,
                type: 'remote'
            },
            tags: [],
            seasons: []
        }))
        appState.setCreateMenuVisible(false);
        return true;
    }))
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

    return fetch(apiEndpoint + '/photos', {
        method: 'POST',
        body: formData
    }).then(resp => resp.json().then(res => {
        userPhotoStore.addPhoto({
            uuid: res.uuid,
            image: {
                uri: `/photos/${res.uuid}`,
                type: 'remote'
            }
        })
        appState.setCreateMenuVisible(false);
        return true;
    }))
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
        .catch(reason => console.log(reason))
}
