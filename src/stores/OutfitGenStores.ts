import { action, autorun, makeObservable, observable } from "mobx";
import { garmentStore, Updateable } from "./GarmentStore";
import { MultipleSelectionStore } from "./SelectionStore";
import { OutfitStore } from "./OutfitStore";
import { act } from "react-test-renderer";

export type OutfitPurpose = Updateable;

export const outfitPurposeStore = new MultipleSelectionStore<OutfitPurpose>([
    {
        uuid: '0',
        name: 'Для отдыха'
    },
    {
        uuid: '1',
        name: 'На работу'
    },
    {
        uuid: '2',
        name: 'В спортзал'
    },
    {
        uuid: '3',
        name: 'На пляж'
    },
]);

export const outfitGenFormTagsStore = new MultipleSelectionStore<string>(
    garmentStore.tags
)

autorun(() => {
    outfitGenFormTagsStore.setItems(garmentStore.tags);
})

export const outfitGenResutlStore = new OutfitStore();

type GenOutfit =  {uuids: string[]};
class UUIDStore {
    outfits: GenOutfit[]

    constructor() {
        this.outfits = [];

        makeObservable(this, {
            outfits: observable,

            setOutfits: action,
        })
    }

    setOutfits(outfits: GenOutfit[]) {
        this.outfits = outfits;
    }
}

export const outfitGenUUIDStore = new UUIDStore();
