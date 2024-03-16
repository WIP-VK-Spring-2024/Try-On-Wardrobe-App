import { makeObservable, observable, action, computed } from "mobx"

interface ItemCard {
    id: number,
    url: string,
    selected: boolean
}

class SelectionList {
    items: ItemCard[] = []
    selectedItemId: number | undefined;

    constructor(urls: string[] | undefined) {
        this.selectedItemId = undefined;

        makeObservable(this, {
            items: observable,
            selectedItemId: observable,

            select: action,
            toggle: action,
            setItems: action,

            somethingSelected: computed
        });

        if (urls !== undefined) {
            this.setItems(urls);
        }
    }

    setItems(urls: string[]) {
        this.items = urls.map((url, id) => ({
            id,
            url,
            selected: false
        }))
    }

    select(id: number) {
        this.selectedItemId = id;
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].id === id) {
                this.items[i].selected = true;
            } else {
                this.items[i].selected = false;
            }
        }
    }

    toggle(id: number) {
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].id === id) {
                if (this.items[i].selected) {
                    this.items[i].selected = false;
                    this.selectedItemId = i;
                } else {
                    this.items[i].selected = true;
                    this.selectedItemId = undefined;
                }
            } else {
                this.items[i].selected = false;
            }
        }
    }

    unselect() {
        this.selectedItemId = undefined;
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].selected = false;
        }
    }
    
    get somethingSelected() {
        return this.selectedItemId !== undefined;
    }
}

export const selectionStore = new SelectionList([]);