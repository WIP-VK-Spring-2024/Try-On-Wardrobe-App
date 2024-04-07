import { apiEndpoint } from "../../config";
import { appState } from "../stores/AppState";
import { garmentStore } from "../stores/GarmentStore";
import { tryOnStore } from "../stores/TryOnStore";
import { userPhotoStore } from "../stores/UserPhotoStore";
import { convertGarmentResponse, convertTryOnResponse } from "../utils";

const processNetworkError = (err: any) => {
    console.log(err);
    appState.setError('network')
}

const typesRequest = fetch(apiEndpoint + '/types').then(data => {
    return data.json().then(types => {
        garmentStore.setTypes(types)
        return true;
    }).catch(err => processNetworkError(err))
}).catch(err => processNetworkError(err))

const stylesRequest = fetch(apiEndpoint + '/styles').then(data => {
    return data.json().then(styles => {
        garmentStore.setStyles(styles);
        return true;
    }).catch(err => processNetworkError(err))
}).catch(err => processNetworkError(err))

export const initStores = () => {
    fetch(apiEndpoint + '/clothes').then(async data => {
        data.json().then(async clothes => {
            await Promise.all([typesRequest, stylesRequest]);
    
            console.log(clothes[0])
    
            const garmentCards = clothes.map(convertGarmentResponse);
    
            garmentStore.setGarments(garmentCards);
        }).catch(err => processNetworkError(err))
    }).catch(err => processNetworkError(err))
    
    fetch(apiEndpoint + '/photos').then(async data => {
        data.json().then(async photos => {
            console.log('photos', photos)
            userPhotoStore.setPhotos(photos.map((photo: { uuid: string, image: string }) => ({
                uuid: photo.uuid,
                image: {
                    type: 'remote',
                    uri: '/'+photo.image
                }
            })))
        }).catch(err => console.error(err))
    }).catch(err => console.error(err))

    fetch(apiEndpoint + '/try-on').then(async data => {
        data.json().then(async results => {
            console.log('try-on results', results)
            tryOnStore.setResults(results.map(convertTryOnResponse));
        }).catch(err => console.error(err))
    }).catch(err => console.error(err))
}
