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
    is_subbed: boolean
}

class ProfileStore {
    currentUser?: User
    users: Subscription[]
    
    constructor() {
        this.currentUser = undefined;
        this.users = [];

        makeObservable(this, {
            currentUser: observable,
            users: observable,

            setUser: action,
            appendUsers: action,
            clearUsers: action,
            clear: action,
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
    
    clear() {
        this.users = [];
        this.currentUser = undefined;
    }
}

export const profileStore = new ProfileStore();
