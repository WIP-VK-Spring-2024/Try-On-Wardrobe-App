import {makeObservable, observable, action, computed, runInAction, observe} from 'mobx';
import { ImageType } from '../models';
import { GarmentCard, garmentStore } from './GarmentStore';
import { Image } from 'react-native';
import { getImageSource } from '../utils';
import { Privacy } from './common';

interface OutfitItemRectProps {
    x?: number
    y?: number
    width?: number
    height?: number
    angle?: number
    scale?: number
    zIndex?: number
}

export class OutfitItemRect {
    x: number
    y: number
    width: number
    height: number
    angle: number
    scale: number
    zIndex: number

    halfWidth: number;
    halfHeight: number;

    constructor(props: OutfitItemRectProps) {
        this.x = props.x || 0;
        this.y = props.y || 0;
        this.width = props.width || 0;
        this.height = props.height || 0;
        this.angle = props.angle || 0;
        this.scale = props.scale || 1;
        this.zIndex = props.zIndex || 0;

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
            zIndex: this.zIndex,
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
    name?: string
    privacy?: Privacy
    updated_at?: string
    items?: OutfitItem[]
    image?: ImageType
    try_on_result_id?: string
}

export class Outfit {
    uuid: string | undefined
    name: string
    privacy: Privacy
    updated_at: string | undefined
    image: ImageType | undefined
    items: OutfitItem[]
    try_on_result_id?: string

    constructor(props?: OutfitProps) {
        this.uuid = props?.uuid
        this.updated_at = props?.updated_at;
        this.image = props?.image;
        this.privacy = props?.privacy || 'public'
        this.name = props?.name || 'Без названия';
        this.items = props?.items || [];
        this.try_on_result_id = props?.try_on_result_id

        makeObservable(this, {
            uuid: observable,
            name: observable,
            privacy: observable,
            updated_at: observable,
            image: observable,
            items: observable,
            try_on_result_id: observable,

            setUUID: action,
            setUpdatedAt: action,
            setImage: action,
            setName: action,
            setPrivacy: action,
            setItems: action,
            setTryOnResult: action,
            addItem: action,
            addItems: action,
            addGarments: action,
            removeGarment: action,
        })
    }

    setUUID(uuid: string) {
        this.uuid = uuid;
    }

    setName(name: string) {
        this.name = name;
    }

    setPrivacy(privacy: Privacy) {
        this.privacy = privacy;
    }

    setUpdatedAt(updated_at: string) {
        this.updated_at = updated_at;
    }

    setImage(image: ImageType) {
        this.image = image;
    }

    setItems(items: OutfitItem[]) {
        this.items = items;
    }

    setTryOnResult(try_on_result_id: string) {
        this.try_on_result_id = try_on_result_id;
    }

    addItem(item: OutfitItem) {
        this.items.push(item);
    }

    addItems(items: OutfitItem[]) {
        this.items = this.items.concat(items);
    }

    async addGarments(garments: GarmentCard[]) {
        const getDimensions = (img: ImageType): Promise<{width: number, height: number}> => {
            return new Promise((resolve, reject) => {
                Image.getSize(getImageSource(img).uri, (width: number, height: number) => {
                    resolve({width, height});
                })
            })
        }

        const maxZIndex = Math.max(...this.items.map(i => i.rect.zIndex));

        const cardToItem = async (garment: GarmentCard, i: number) => {
            const dimensions = await getDimensions(garment.image);
            const aspectRatio = dimensions.width / dimensions.height;
            return new OutfitItem({
                garmentUUID: garment.uuid!,
                rect: new OutfitItemRect({
                    x: 200,
                    y: 300,
                    width: 200 * aspectRatio,
                    height: 200,
                    zIndex: maxZIndex + i + 1
                })
            })
        }

        const items = await Promise.all(garments.map(cardToItem));

        this.addItems(items);
    }

    removeGarment(garment: GarmentCard) {
        this.items = this.items.filter(item => item.garmentUUID !== garment.uuid!);
    }
}

export class OutfitEdit extends Outfit {
    origin: Outfit;

    constructor(origin: Outfit) {
      super(origin)
  
      this.origin = origin;
      this.clearChanges();
  
      makeObservable(this, {
        origin: observable,
  
        setOrigin: action,
        clearChanges: action,
        saveChanges: action,
  
        hasChanges: computed
      });
    }
  
    setOrigin(origin: Outfit) {
      this.origin = origin;
    }
  
    get hasChanges() {
      return !(
        this.name === this.origin.name &&
        this.privacy === this.origin.privacy
      );
    }
  
    clearChanges() {
        this.name = this.origin.name;
        this.privacy = this.origin.privacy;
    }
  
    saveChanges() {
        this.origin.name = this.name;
        this.origin.privacy = this.privacy;
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
            clear: action,
        })
    }

    setOutfits(outfits: Outfit[]) {
        this.outfits = outfits;
    }

    addOutfit(outfit?: Outfit) {
        if (outfit === undefined) {
            this.outfits.unshift(new Outfit());
        } else {
            this.outfits.unshift(outfit);
        }
    }

    removeOutfit(outfitUUID: string) {
        this.outfits = this.outfits.filter(outfit => outfit.uuid !== outfitUUID);
    }

    getOutfitByUUID(outfitUUID: string) {
        return this.outfits.find(outfit => outfit.uuid === outfitUUID);
    }

    clear() {
        this.outfits = [];
    }
};

export const outfitStore = new OutfitStore();
