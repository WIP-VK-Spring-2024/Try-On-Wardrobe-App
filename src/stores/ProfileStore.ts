import { makeObservable, observable, action } from "mobx"
import { Gender, Privacy } from "./common"
import { Outfit } from "./OutfitStore"

export interface UserProps {
    name: string
    email: string
    uuid: string
    gender: Gender
    privacy: Privacy
    subs?: Subscription[]
}

export class User {
    name: string
    email: string
    uuid: string
    gender: Gender
    privacy: Privacy
    subs: Subscription[]

    constructor(props: UserProps) {
        this.name = props.name;
        this.email = props.email;
        this.uuid = props.uuid;
        this.gender = props.gender;
        this.privacy = props.privacy;
        this.subs = props.subs || [];

        makeObservable(this, {
            name: observable,
            email: observable,
            gender: observable,
            privacy: observable,
            subs: observable,

            setPrivacy: action,
            setName: action,
            setGender: action,
            setSubs: action,
            addSub: action,
            removeSub: action,
        });
    }

    setPrivacy(privacy: Privacy) {
        this.privacy = privacy;
    }

    setGender(gender: Gender) {
        this.gender = gender;
    }

    setName(name: string) {
        this.name = name;
    }

    setSubs(subs: Subscription[]) {
        this.subs = subs;
    }

    addSub(sub: Subscription) {
        this.subs.unshift(sub);
    }

    removeSub(uuid: string) {
        const idx = this.subs.findIndex(sub => sub.uuid === uuid);
        if (idx != -1) {
            this.subs.splice(idx, 1);
        }
    }
}

export interface Subscription {
    name: string
    uuid: string
    isSubbed?: boolean
}

export interface ProfileProps extends Subscription {
    outfits?: Outfit[]
}

export class Profile {
    name: string
    uuid: string
    isSubbed?: boolean
    outfits?: Outfit[]

    constructor(props: ProfileProps) {
        this.name = props.name;
        this.uuid = props.uuid;
        this.outfits = props.outfits || [];

        makeObservable(this, {
            name: observable,
            outfits: observable,

            setOutfits: action,
            setName: action
        });
    }

    setName(name: string) {
        this.name = name;
    }

    setOutfits(outfits: Outfit[]) {
        this.outfits = outfits;
    }
}

class ProfileStore {
    currentUser?: User
    users: Subscription[]
    otherProfile?: Profile
    
    lastUserName: string
    
    constructor() {
        this.currentUser = undefined;
        this.otherProfile = undefined;
        this.users = [];
        this.lastUserName = '';

        makeObservable(this, {
            currentUser: observable,
            otherProfile: observable,
            users: observable,
            lastUserName: observable,

            setUser: action,
            appendUsers: action,
            clearUsers: action,
            setLastUserName: action,
        });
    }

    setUser(user: User) {
        this.currentUser = user;
    }

    appendUsers(users: Subscription[]) {
        this.users = this.users.concat(users);
    }

    clearUsers() {
        this.users = [];
    }

    setLastUserName(name: string) {
        this.lastUserName = name;
    }

    setOtherProfile(profile: Profile) {
        this.otherProfile = profile;
    }
}


export const profileStore = new ProfileStore();
