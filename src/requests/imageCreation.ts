import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';
import { apiEndpoint } from '../../config';
import { GarmentCard, garmentStore } from '../stores/GarmentStore';
import { garmentScreenSelectionStore } from '../store';

const uploadImage = (image: ImageOrVideo) => {
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
            uri: `/clothes/${res.uuid}`,
            type: 'remote'
            },
            tags: [],
            seasons: []
        }))
        return true;
    }))
    .catch(err => console.error(err));
}

export const createGarmentFromGallery = async () => {
    return ImagePicker.openPicker({
      cropping: true,
    })
        .then(uploadImage)
        .catch(reason => console.log(reason))
}

export const createGarmentFromCamera = async () => {
    return ImagePicker.openCamera({
        cropping: true,
    })
        .then(uploadImage)
        .catch(reason => console.log(reason))
}
