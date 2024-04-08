import {makeObservable, observable, action, computed, runInAction, observe} from 'mobx';
import { ImageType } from '../models';
import { staticEndpoint } from '../../config';
import { GarmentCard, garmentStore } from './GarmentStore';

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
    garmentUUID: string
    rect: GarmentKitItemRect
}

export class GarmentKitItem {
    garmentUUID: string
    rect: GarmentKitItemRect

    constructor(props: GarmentKitItemProps) {
        this.garmentUUID = props.garmentUUID;
        this.rect = props.rect;

        makeObservable(this, {
            rect: observable,

            setRect: action,

            garment: computed,
            image: computed,
        })
    }

    setRect(rect: GarmentKitItemRect) {
        this.rect = rect
    }

    get garment() {
        return garmentStore.getGarmentByUUID(this.garmentUUID);
    }

    get image() {
        return this.garment?.image;
    }
}

interface GarmentKitProps {
    items?: GarmentKitItem[]
    image?: ImageType
}

export class GarmentKit {
    image: ImageType | undefined
    items: GarmentKitItem[]

    constructor(props: GarmentKitProps) {
        this.image = props.image;
        this.items = props.items || [];

        makeObservable(this, {
            image: observable,
            items: observable,

            setImage: action,
            setItems: action,
            addItem: action,
            addItems: action,
            addGarments: action,
            removeGarment: action,
        })
    }

    setImage(image: ImageType) {
        this.image = image;
    }

    setItems(items: GarmentKitItem[]) {
        this.items = items;
    }

    addItem(item: GarmentKitItem) {
        this.items.push(item);
    }

    addItems(items: GarmentKitItem[]) {
        this.items = this.items.concat(items);
    }

    addGarments(garments: GarmentCard[]) {
        const cardToItem = (garment: GarmentCard) => {
            return new GarmentKitItem({
                garmentUUID: garment.uuid!,
                rect: new GarmentKitItemRect({
                    x: 300,
                    y: 300,
                    width: 100,
                    height: 100,
                })
            })
        }

        this.addItems(garments.map(cardToItem));
    }

    removeGarment(garment: GarmentCard) {
        this.items = this.items.filter(item => item.garmentUUID !== garment.uuid!);
    }
}

const item1 = new GarmentKitItem({
    garmentUUID: '6366006a-b909-4381-a741-9e6fe0cbbf74',
    rect: new GarmentKitItemRect({
        x: 200,
        y: 40,
        angle: Math.PI / 4,
        width: 100,
        height: 100,
        scale: 1
    })
})

const item2 = new GarmentKitItem({
    garmentUUID: '0208edd3-5dcc-4543-993c-f8da2764bb03',
    rect: new GarmentKitItemRect({
        x: 200,
        y: 200,
        angle: Math.PI / 16,
        width: 100,
        height: 100,
        scale: 1
    })
})

export const garmentKit = new GarmentKit({image: {type: 'local', uri: '/outfit/1.png'}, items: [item1, item2]});
