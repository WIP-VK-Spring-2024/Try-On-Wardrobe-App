import { getOutfitImageName } from "../cacheManager/utils";
import { Outfit, OutfitItem, outfitStore } from "../stores/OutfitStore";
import RNFS from 'react-native-fs';
import { ajax } from "./common";
import { userPhotoStore } from "../stores/UserPhotoStore";

const makeFormData = (outfit: Outfit) => {
    const image_p = outfit.image!.uri.split('/');
    const image_name = image_p[image_p.length - 1];

    console.log(outfit);

    const formData = new FormData();

    formData.append('name', outfit.name);
    formData.append('privacy', outfit.privacy);
    
    const uri = 'file://' + outfit.image!.uri

    console.log(uri)

    formData.append('img', {
        type: "image/png",
        name: image_name,
        uri: uri
    });

    const transforms =  Object.fromEntries(outfit.items
        .map(item => ([item.garmentUUID, {...item.rect.getTransforms(), z_index: item.rect.zIndex}])));

    formData.append('transforms', JSON.stringify(transforms));
    
    return formData;
};

export const updateOutfitFields = async (outfit: Outfit) => {
    const formData = new FormData();

    formData.append('name', outfit.name);
    formData.append('privacy', outfit.privacy);

    return ajax.apiPut(`/outfits/${outfit.uuid}`, {
        credentials: true,
        body: formData
    })
};

export const updateOutfit = async (outfit: Outfit, oldItems: string[]) => {
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

    return ajax.apiPut(`/outfits/${outfit.uuid}`, {
        credentials: true,
        body: formData
    }).then(resp => {
        console.log(resp);

        return resp.json()
            .then(res => {
                console.log(res);

                outfit.setUpdatedAt(res.updated_at);
                
                const newName = getOutfitImageName(outfit);
                const newPath = RNFS.DocumentDirectoryPath + `/images/outfits/${newName}`;

                RNFS.moveFile(outfit.image!.uri, newPath)
                .catch(reason => console.error(reason))

                outfit.setImage({
                    type: 'local',
                    uri: newPath
                })

                const items = outfit.items.map(elem => elem.garmentUUID);
                console.log("items", items);
                console.log("old items", oldItems);

                if (oldItems && items.some(uuid => !oldItems.includes(uuid)) &&
                  userPhotoStore.photos.length > 0
                ) {
                    outfit.setTryOnResult(undefined);

                    ajax.apiPost('/try-on/outfit', {
                        body: JSON.stringify({
                        user_image_id: userPhotoStore.photos[0].uuid,
                        outfit_id: outfit.uuid,
                        }),
                        credentials: true,
                    });
                }

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
};

export const uploadOutfit = async (outfit: Outfit) => {
    console.log('upload outfit', outfit)
    if (outfit.image === undefined) {
        console.error('no outfit image');
        return false;
    }

    const formData = makeFormData(outfit);

    return ajax.apiPost('/outfits', {
        credentials: true,
        body: formData,
    }).then(resp => {
        console.log(resp);

        return resp.json()
            .then(res => {
                console.log('outfit upload:', res);
                outfit.setUUID(res.uuid);
                outfit.setUpdatedAt(res.updated_at);
                
                if (userPhotoStore.photos.length > 0) {
                  ajax.apiPost('/try-on/outfit', {
                    body: JSON.stringify({
                      user_image_id: userPhotoStore.photos[0].uuid,
                      outfit_id: res.uuid,
                    }),
                    credentials: true,
                  });
                }

                const newName = getOutfitImageName(outfit);
                const newPath = RNFS.DocumentDirectoryPath + `/images/outfits/${newName}`;
                
                console.log(outfit.image?.uri, newPath);

                RNFS.moveFile(outfit.image!.uri, newPath);

                outfit.setImage({
                    type: 'local',
                    uri: newPath
                });

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
}

export const deleteOutfit = async (outfitUUID: string) => {
    return ajax.apiDelete(`/outfits/${outfitUUID}`, {
        credentials: true
    }).then(resp => {
        console.log(resp);
        outfitStore.removeOutfit(outfitUUID);
        return true;
    }).catch(reason => {
        console.error(reason);
        return false;
    } );
}
