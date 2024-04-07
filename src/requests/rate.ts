import {Rating, tryOnStore} from '../stores/TryOnStore';
import {apiEndpoint} from '../../config';
import { resultStore } from "../store";


const rateTryOnResult = (uuid: string, rating: Rating) => {
    return () => {
        fetch(apiEndpoint + '/try-on/' + uuid + '/rate', {
            method: 'PATCH',
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
