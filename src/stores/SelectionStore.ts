import { action, computed, makeObservable, observable } from "mobx";

export class SingleSelectionStore {
    items: any[];
    selectedItemId: number | undefined;
  
    constructor(items: any[]) {
      this.items = items;
      this.selectedItemId = undefined;
  
      makeObservable(this, {
        items: observable,
        selectedItemId: observable,
  
        select: action,
        toggle: action,
        setItems: action,
        unselect: action,
  
        somethingIsSelected: computed,
        selectedItem: computed
      });
    }
  
    setItems(items: any) {
      this.items = items;
    }
  
    select(id: number) {
      this.selectedItemId = id;
    }
  
    toggle(id: number) {
      if (this.selectedItemId === id) {
        this.selectedItemId = undefined;
      } else {
        this.selectedItemId = id;
      }
    }
  
    unselect() {
      this.selectedItemId = undefined;
    }
  
    get somethingIsSelected() {
      return this.selectedItemId !== undefined;
    }
  
    get selectedItem() {
      if (this.selectedItemId === undefined)
        return undefined;
  
      return this.items[this.selectedItemId];
    }
}

export class MultipleSelectionStore {
    items: any[]
    selectedItems: any[]

    constructor(items: any[]) {
        this.items = items;
        this.selectedItems = [];

        makeObservable(this, {
            items: observable,
            selectedItems: observable,

            select: action,
            deselect: action,
            toggle: action,
            setItems: action,
            setSelectedItems: action,
            clearSelectedItems: action,
        })
    }

    select(item: any) : boolean {
        if (this.items.includes(item) && !this.selectedItems.includes(item)) {
            this.selectedItems.push(item);
            return true;
        }
        return false;
    }

    deselect(toRemove: any) {
        this.selectedItems = this.selectedItems.filter(item => item.uuid !== toRemove.uuid)
    }

    toggle(item: any) {
        if (this.select(item)) {
            return
        }
        this.deselect(item)
    }

    setItems(items: any[]) {
        const selected = this.selectedItems;

        this.items = items;

        selected.forEach(item => this.select(item));
    }

    setSelectedItems(selectedItems: any[]) {
        this.selectedItems = selectedItems;
    }

    clearSelectedItems() {
        this.selectedItems = [];
    }
}
