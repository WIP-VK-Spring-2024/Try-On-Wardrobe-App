import { makeObservable, observable, action } from "mobx"
import { Gender, Privacy } from "./common"

export interface User {
    name: string
    email: string
    uuid: string
    gender: Gender
    privacy: Privacy
}

export interface Subscription {
    name: string
    uuid: string
}

class ProfileStore {
    name: string
    email?: string
    uuid?: string
    gender: Gender
    privacy: Privacy

    subs: Subscription[]
    
    // likedPosts:

    constructor() {
        this.name = '';
        this.gender = 'female';
        this.privacy = 'public';
        this.subs = [];
        this.email = undefined;

        makeObservable(this, {
            name: observable,
            email: observable,
            gender: observable,
            privacy: observable,
            subs: observable,

            setPrivacy: action,
            setGender: action,
            setName: action,
            setUser: action,
            setSubs: action,
        });
    }

    setPrivacy(privacy: Privacy) {
        this.privacy = privacy
    }

    setGender(gender: Gender) {
        this.gender = gender
    }

    setName(name: string) {
        this.name = name
    }

    setSubs(subs: Subscription[]) {
        this.subs = subs
    }

    setUser(user: User) {
        this.uuid = user.uuid
        this.name = user.name
        this.email = user.email
        this.gender = user.gender
        this.privacy = user.privacy
    }
}


export const profileStore = new ProfileStore();
