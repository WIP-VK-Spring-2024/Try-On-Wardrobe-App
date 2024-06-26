import { apiEndpoint } from "../../config";
import { cacheManager } from "../cacheManager/cacheManager";
import { processNetworkError } from "../stores/AppState";
import { GarmentCard, garmentStore } from "../stores/GarmentStore";
import { outfitPurposeStore } from "../stores/OutfitGenStores";
import { Outfit, OutfitItem, OutfitItemRect, outfitStore } from "../stores/OutfitStore";
import { tryOnStore } from "../stores/TryOnStore";
import { userPhotoStore } from "../stores/UserPhotoStore";
import { Privacy } from "../stores/common";
import { convertGarmentResponse, convertTryOnResponse } from "../utils";
import { ajax } from "./common"
import { getSubs } from "./user";

const typesRequest = ajax.apiGet('/types').then(data => {
    return data.json().then(types => {
        garmentStore.setTypes(types)
        return true;
    }).catch(err => processNetworkError(err))
}).catch(err => processNetworkError(err))

const stylesRequest = ajax.apiGet('/styles').then(data => {
    return data.json().then(styles => {
        garmentStore.setStyles(styles);
        return true;
    }).catch(err => processNetworkError(err))
}).catch(err => processNetworkError(err))

export const initStores = () => {
    getSubs();

    const remoteGarments = ajax.apiGet('/clothes', {
        credentials: true
    }).then(async data => {
        return data.json().then(async clothes => {
            await Promise.all([typesRequest, stylesRequest]);

            return clothes.map(convertGarmentResponse) as GarmentCard[];
        }).catch(err => {
            processNetworkError(err)
            return false;
        })
    }).catch(err => {
        processNetworkError(err);
        return false;
    })

    const localGarments = cacheManager.readGarmentCards()
                    .then(cards => {
                        garmentStore.setGarments(cards);
                        return cards as GarmentCard[];
                    })
                    .catch(reason => {
                        console.error(reason);
                        return [];
                    });

    const garmentsUpdated = Promise.all([localGarments, remoteGarments])
        .then(([local, remote]) => {
            if (typeof remote !== 'boolean') {
                return cacheManager.updateGarments(local, remote);
            }

            return remote;
    })

    ajax.apiGet('/photos', {
        credentials: true
    }).then(async data => {
        data.json().then(async photos => {
            console.log(photos)
            userPhotoStore.setPhotos(photos.map((photo: { uuid: string, image: string }) => ({
                uuid: photo.uuid,
                image: {
                    type: 'remote',
                    uri: photo.image
                }
            })))
        }).catch(err => console.error(err))
    }).catch(err => console.error(err))

    ajax.apiGet('try-on', {
        credentials: true
    }).then(async data => {
        data.json().then(async results => {
            // console.log(results)
            tryOnStore.setResults(results.map(convertTryOnResponse));
        }).catch(err => console.error(err))
    }).catch(err => console.error(err))

    interface OutfitResponse {
        created_at: string
        updated_at: string
        try_on_result_id: string
        image: string
        public: boolean
        uuid: string
        user_id: string
        privacy: Privacy
        transforms: {
            [uuid: string]: {
                x: number
                y: number
                width: number
                height: number
                scale: number
                angle: number
                z_index: number
            }
        }
    }

    const remoteOutfits = ajax.apiGet('/outfits', {
        credentials: true
    }).then(async data => {
        const json = await data.json();

        console.log('outfits', json[0])

        return json.map((outfit: OutfitResponse) => {
            let z = 0;
            const items = Object.entries(outfit.transforms)
                .map(([uuid, transform]) => {
                    return new OutfitItem({
                        garmentUUID: uuid,
                        rect: new OutfitItemRect({...transform, zIndex: transform.z_index || z++})
                    })
                })

            return new Outfit({
                uuid: outfit.uuid,
                image: {
                    type: 'remote',
                    uri: outfit.image
                },
                try_on_result_id: outfit.try_on_result_id,
                items: items,
                updated_at: outfit.updated_at,
                privacy: outfit.privacy,
            })
        })

        // outfitStore.setOutfits(outfits);
    })

    const localOutfits = cacheManager.readOutfits()
        .then(outfits => {
            // garmentStore.setGarments(cards);
            outfitStore.setOutfits(outfits);
            return outfits as Outfit[];
        })
        .catch(reason => {
            console.error(reason);
            return [];
        });

    const outfitsUpdated = Promise.all([localOutfits, remoteOutfits])
        .then(([local, remote]) => {
            return cacheManager.updateOutfits(local, remote);
        })
    
    ajax.apiGet('/outfits/purposes', {
        credentials: true
    }).then(res => {
        res.json().then((json: {
            uuid: string,
            created_at: string,
            updated_at: string,
            eng_name: string,
            name: string
        }[]) => {
            outfitPurposeStore.setItems(json);
        }).catch(reason => console.error(reason))
    })

    return Promise.all([garmentsUpdated, outfitsUpdated]);
}
