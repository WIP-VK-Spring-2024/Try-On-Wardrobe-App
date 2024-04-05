import {makeObservable, observable, action, computed, runInAction, observe} from 'mobx';
import { ImageType } from '../models';
import { staticEndpoint } from '../../config';

interface GarmentKitItemRectProps {
    x?: number
    y?: number
    width?: number
    height?: number
    angle?: number
    scale?: number 
}

export class GarmentKitItemRect {
    x: number
    y: number
    width: number
    height: number
    angle: number
    scale: number

    halfWidth: number;
    halfHeight: number;

    constructor(props: GarmentKitItemRectProps) {
        this.x = props.x || 0;
        this.y = props.y || 0;
        this.width = props.width || 0;
        this.height = props.height || 0;
        this.angle = props.angle || 0;
        this.scale = props.scale || 1;

        this.halfWidth = this.width / 2;
        this.halfHeight = this.height / 2;
    }

    getParams() {
        return {
          x: this.x,
          y: this.y,
          angle: this.angle,
          width: this.width,
          height: this.height,
          halfWidth: this.halfWidth,
          halfHeight: this.halfHeight,
          scale: this.scale,
        }
    }
}

interface GarmentKitItemProps {
    image: ImageType
    rect: GarmentKitItemRect
}

export class GarmentKitItem {
    image: ImageType
    rect: GarmentKitItemRect

    constructor(props: GarmentKitItemProps) {
        this.image = props.image;
        this.rect = props.rect;

        makeObservable(this, {
            image: observable,
            rect: observable,

            setRect: action
        })
    }

    setRect(rect: GarmentKitItemRect) {
        this.rect = rect
    }
}

export class GarmentKit {
    items: GarmentKitItem[]

    constructor(items?: GarmentKitItem[]) {
        this.items = items || [];

        makeObservable(this, {
            items: observable,

            setItems: action,
            addItem: action,
        })
    }

    setItems(items: GarmentKitItem[]) {
        this.items = items;
    }

    addItem(item: GarmentKitItem) {
        this.items.push(item);
    }
}

const item = new GarmentKitItem({
    image: {
        type: 'remote',
        uri: staticEndpoint + 'cut/6366006a-b909-4381-a741-9e6fe0cbbf74',
    },
    rect: new GarmentKitItemRect({
        x: 200,
        y: 40,
        angle: Math.PI / 4,
        width: 100,
        height: 100,
        scale: 1
    })
})

export const garmentKit = new GarmentKit([item]);
