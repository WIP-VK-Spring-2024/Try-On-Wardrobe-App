import { apiEndpoint } from "../../config";
import { cacheManager } from "../cacheManager/cacheManager";
import { appState } from "../stores/AppState";
import { GarmentCard, garmentStore } from "../stores/GarmentStore";
import { Outfit, OutfitItem, OutfitItemRect, outfitStore } from "../stores/OutfitStore";
import { tryOnStore } from "../stores/TryOnStore";
import { userPhotoStore } from "../stores/UserPhotoStore";
import { convertGarmentResponse, convertTryOnResponse } from "../utils";

const processNetworkError = (err: any) => {
    console.log(err);
    appState.setError('network')
}

const typesRequest = fetch(apiEndpoint + 'types').then(data => {
    return data.json().then(types => {
        garmentStore.setTypes(types)
        return true;
    }).catch(err => processNetworkError(err))
}).catch(err => processNetworkError(err))

const stylesRequest = fetch(apiEndpoint + 'styles').then(data => {
    return data.json().then(styles => {
        garmentStore.setStyles(styles);
        return true;
    }).catch(err => processNetworkError(err))
}).catch(err => processNetworkError(err))

export const initStores = () => {
    const remoteGarments = fetch(apiEndpoint + 'clothes').then(async data => {
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

    Promise.all([localGarments, remoteGarments])
        .then(([local, remote]) => {
            if (typeof remote !== 'boolean') {
                cacheManager.updateGarments(local, remote);
            }
    })

    fetch(apiEndpoint + 'photos').then(async data => {
        data.json().then(async photos => {
            userPhotoStore.setPhotos(photos.map((photo: { uuid: string, image: string }) => ({
                uuid: photo.uuid,
                image: {
                    type: 'remote',
                    uri: photo.image
                }
            })))
        }).catch(err => console.error(err))
    }).catch(err => console.error(err))

    fetch(apiEndpoint + 'try-on').then(async data => {
        data.json().then(async results => {
            tryOnStore.setResults(results.map(convertTryOnResponse));
        }).catch(err => console.error(err))
    }).catch(err => console.error(err))

    interface OutfitResponse {
        created_at: string
        image: string
        public: boolean
        uuid: string
        user_id: string
        transforms: {
            [uuid: string]: {
                x: number
                y: number
                width: number
                height: number
                scale: number
                angle: number
            }
        }
    }

    fetch(apiEndpoint + 'outfits').then(async data => {
        const json = await data.json();

        const outfits = json.map((outfit: OutfitResponse) => {
            const items = Object.entries(outfit.transforms)
                .map(([uuid, transform]) => {
                    return new OutfitItem({
                        garmentUUID: uuid,
                        rect: new OutfitItemRect(transform)
                    })
                })

            return new Outfit({
                uuid: outfit.uuid,
                image: {
                    type: 'remote',
                    uri: outfit.image
                },
                items: items
            })
        })

        outfitStore.setOutfits(outfits);
    })
}
