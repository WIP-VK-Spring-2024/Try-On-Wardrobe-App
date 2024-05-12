import { ImageType } from "../../models";
import { RatingStatus } from "./RatingBlock";

interface CallbackObj<T, PropsType> {
    id: T
    cb: (props: PropsType) => void
}

class Mediator<T, PropsType> {
    listeners: CallbackObj<T, PropsType>[] = [];

    constructor() {
        this.listeners = []
    }

    subscribe({ id, cb }: CallbackObj<T, PropsType>) {
        this.listeners = [...this.listeners.filter((x) => x.id !== id), { id, cb }]
    }

    unsubscribe({ id }: {id: number}) {
        this.listeners = this.listeners.filter((x) => x.id !== id)
    }

    propagate(id: T, newProps: PropsType) {
        this.listeners.forEach((x) => x.id === id && x.cb(newProps))
    }

    clear() {
        this.listeners = [];
    }
}

interface StatusProp {
    propType: "status"
    payload: RatingStatus
}

interface IsSubbedProp {
    user_id: string
    isSubbed: boolean
}

export type MediatorPropType = StatusProp

export const feedPropsMediator = new Mediator<string, MediatorPropType>();

export const feedAvatarMediator = new Mediator<string, {avatar: ImageType}>();

export const feedUserMediator = new Mediator<string, IsSubbedProp>();
