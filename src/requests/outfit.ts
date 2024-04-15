import { apiEndpoint } from "../../config";
import { Outfit, outfitStore } from "../stores/OutfitStore";
import RNFS from 'react-native-fs';

const makeFormData = (outfit: Outfit) => {
    const image_p = outfit.image!.uri.split('/');
    const image_name = image_p[image_p.length - 1];

    let formData = new FormData();
    
    const uri = 'file://' + outfit.image!.uri

    console.log(uri)

    formData.append('img', {
        type: "image/png",
        name: image_name,
        uri: uri
    });

    const transforms =  Object.fromEntries(outfit.items
        .map(item => ([item.garmentUUID, item.rect.getTransforms()])));

    formData.append('transforms', JSON.stringify(transforms));

    return formData;
}

export const updateOutfit = async (outfit: Outfit) => {
    console.log('update outfit')
    if (outfit.uuid === undefined) {
        console.error('no outfit uuid');
        return false;
    }

    if (outfit.image === undefined) {
        console.error('no outfit image');
        return false;
    }

    const formData = makeFormData(outfit);

    return fetch(apiEndpoint + `outfits/${outfit.uuid}`, {
        method: 'PUT',
        body: formData
    }).then(resp => {
        console.log(resp);

        return resp.json()
            .then(res => {
                console.log(res);
                return true;
            })
            .catch(reason => {
                console.error(reason);
                return false;
            })
    }).catch(reason => {
        console.error(reason);
        return false;
    })
}

export const uploadOutfit = async (outfit: Outfit) => {
    console.log('upload outfit')
    if (outfit.image === undefined) {
        console.error('no outfit image');
        return false;
    }

    const formData = makeFormData(outfit);

    return fetch(apiEndpoint + 'outfits', {
        method: 'POST',
        body: formData
    }).then(resp => {
        console.log(resp);

        return resp.json()
            .then(res => {
                outfit.setUUID(res.uuid);
                return true;
            })
            .catch(reason => {
                console.error(reason);
                return false;
            })
    }).catch(reason => {
        console.error(reason)
        return false;
    })
};

export const deleteOutfit = async (outfitUUID: string) => {
    return fetch(apiEndpoint + `outfits/${outfitUUID}`, {
        method: 'DELETE'
    }).then(resp => {
        console.log(resp);
        outfitStore.removeOutfit(outfitUUID);
        return true;
    }).catch(reason => {
        console.error(reason);
        return false;
    } );
}
