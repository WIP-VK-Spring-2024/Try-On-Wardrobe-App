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

    subscribe ({ id, cb }: CallbackObj<T, PropsType>) {
        this.listeners = [...this.listeners.filter((x)=> x.id !== id), { id, cb }]
    }

    unsubscribe ({ id }: {id: number}) {
        this.listeners = this.listeners.filter((x)=> x.id !== id)
    }

    propogate (id: number, newProps: any) {
        this.listeners.forEach((x)=> x.id === id && x.cb(newProps))
    }
}

export const feedPropsMediator = new Mediator<string, {status: RatingStatus}>();
