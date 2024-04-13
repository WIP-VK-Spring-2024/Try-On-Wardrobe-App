import {makeObservable, observable, action, computed, runInAction, observe} from 'mobx';
import { ImageType } from '../models';
import { staticEndpoint } from '../../config';
import { GarmentCard, garmentStore } from './GarmentStore';

interface OutfitItemRectProps {
    x?: number
    y?: number
    width?: number
    height?: number
    angle?: number
    scale?: number 
}

export class OutfitItemRect {
    x: number
    y: number
    width: number
    height: number
    angle: number
    scale: number

    halfWidth: number;
    halfHeight: number;

    constructor(props: OutfitItemRectProps) {
        this.x = props.x || 0;
        this.y = props.y || 0;
        this.width = props.width || 0;
        this.height = props.height || 0;
        this.angle = props.angle || 0;
        this.scale = props.scale || 1;

        this.halfWidth = this.width / 2;
        this.halfHeight = this.height / 2;
    }

    getTransforms() {
        return {
            x: this.x,
            y: this.y,
            angle: this.angle,
            width: this.width,
            height: this.height,
            scale: this.scale,     
        }
    }

    getParams() {
        return Object.assign(this.getTransforms(), {
            halfWidth: this.halfWidth,
            halfHeight: this.halfHeight
        })
    }
}

interface OutfitItemProps {
    garmentUUID: string
    rect: OutfitItemRect
}

export class OutfitItem {
    garmentUUID: string
    rect: OutfitItemRect

    constructor(props: OutfitItemProps) {
        this.garmentUUID = props.garmentUUID;
        this.rect = props.rect;

        makeObservable(this, {
            rect: observable,

            setRect: action,

            garment: computed,
            image: computed,
        })
    }

    setRect(rect: OutfitItemRect) {
        this.rect = rect
    }

    get garment() {
        return garmentStore.getGarmentByUUID(this.garmentUUID);
    }

    get image() {
        return this.garment?.image;
    }
}

interface OutfitProps {
    uuid?: string
    items?: OutfitItem[]
    image?: ImageType
}

export class Outfit {
    uuid: string | undefined
    image: ImageType | undefined
    items: OutfitItem[]

    constructor(props?: OutfitProps) {
        this.uuid = props?.uuid
        this.image = props?.image;
        this.items = props?.items || [];

        makeObservable(this, {
            uuid: observable,
            image: observable,
            items: observable,

            setUUID: action,
            setImage: action,
            setItems: action,
            addItem: action,
            addItems: action,
            addGarments: action,
            removeGarment: action,
        })
    }

    setUUID(uuid: string) {
        this.uuid = uuid;
    }

    setImage(image: ImageType) {
        this.image = image;
    }

    setItems(items: OutfitItem[]) {
        this.items = items;
    }

    addItem(item: OutfitItem) {
        this.items.push(item);
    }

    addItems(items: OutfitItem[]) {
        this.items = this.items.concat(items);
    }

    addGarments(garments: GarmentCard[]) {
        const cardToItem = (garment: GarmentCard) => {
            return new OutfitItem({
                garmentUUID: garment.uuid!,
                rect: new OutfitItemRect({
                    x: 200,
                    y: 300,
                    width: 200,
                    height: 200,
                })
            })
        }

        this.addItems(garments.map(cardToItem));
    }

    removeGarment(garment: GarmentCard) {
        this.items = this.items.filter(item => item.garmentUUID !== garment.uuid!);
    }
}

interface OutfitStoreProps {
    outfits?: Outfit[];
}

export class OutfitStore {
    outfits: Outfit[];

    constructor(props?: OutfitStoreProps) {
        this.outfits = props?.outfits || [];

        makeObservable(this, {
            outfits: observable,

            setOutfits: action,
            addOutfit: action,
            removeOutfit: action,
        })
    }

    setOutfits(outfits: Outfit[]) {
        this.outfits = outfits;
    }

    addOutfit(outfit?: Outfit) {
        if (outfit === undefined) {
            this.outfits.push(new Outfit());
        } else {
            this.outfits.push(outfit);
        }
    }

    removeOutfit(outfitUUID: string) {
        this.outfits = this.outfits.filter(outfit => outfit.uuid !== outfitUUID);
    }

    getOutfitByUUID(outfitUUID: string) {
        return this.outfits.find(outfit => outfit.uuid === outfitUUID);
    }
};

export const outfitStore = new OutfitStore();
