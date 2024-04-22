import { makeObservable, observable, action } from "mobx"
import { Gender, Privacy } from "./common"

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
}

export interface Subscription {
    name: string
    uuid: string
}

class ProfileStore {
    currentUser?: User
    users: Subscription[]
    lastUserName: string
    
    constructor() {
        this.currentUser = undefined;
        this.users = [];
        this.lastUserName = '';

        makeObservable(this, {
            currentUser: observable,
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
}


export const profileStore = new ProfileStore();
