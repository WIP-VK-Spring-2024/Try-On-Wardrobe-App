import {Rating, tryOnStore} from '../stores/TryOnStore';
import {apiEndpoint} from '../../config';
import { resultStore } from "../store";
import { ajax } from './common';
import { joinPath } from '../utils';


const rateTryOnResult = (uuid: string, rating: Rating) => {
    return () => {
        ajax.apiPatch(joinPath('/try-on/', uuid, '/rate'), {
            credentials: true,
            body: JSON.stringify({rating: rating}),
        })
            .then(data => {
                data.json()
                    .then(_ => {
                        tryOnStore.rateResult(uuid, rating);
                        if (resultStore.resultUUID === uuid) {
                            resultStore.setResultRating(rating)
                        }
                    })
                    .catch(err => console.error(err));
            })
            .catch(err => console.error(err));
    }
};

export const likeTryOnResult = (uuid: string) => rateTryOnResult(uuid, Rating.Like);

export const dislikeTryOnResult = (uuid: string) => rateTryOnResult(uuid, Rating.Dislike);

export const removeTryOnResultRating = (uuid: string) => rateTryOnResult(uuid, Rating.None);
