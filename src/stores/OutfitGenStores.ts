import { autorun } from "mobx";
import { garmentStore, Updateable } from "./GarmentStore";
import { MultipleSelectionStore } from "./SelectionStore";
import { OutfitStore } from "./OutfitStore";

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
