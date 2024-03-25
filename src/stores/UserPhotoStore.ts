import {makeObservable, observable, action, computed, runInAction} from 'mobx';
import { ImageType } from '../models';

interface UserPhoto {
    uuid: string,
    image: ImageType
}


class UserPhotoStore {
    photos: UserPhoto[]

    constructor(photos?: UserPhoto[]) {
        this.photos = photos || [];

        makeObservable(this, {
            photos: observable,

            setPhotos: action,
            addPhoto: action,
        })
    }

    setPhotos(photos: UserPhoto[]) {
        this.photos = photos;
    }

    addPhoto(photo: UserPhoto) {
        this.photos.push(photo);
    }
}

export const userPhotoStore = new UserPhotoStore();
