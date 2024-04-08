import { action, computed, makeObservable, observable } from "mobx";

export class SingleSelectionStore<T> {
    items: T[];
    selectedItemId: number | undefined;
  
    constructor(items: T[]) {
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
  
    setItems(items: T[]) {
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
  
    get somethingIsSelected() : boolean {
      return this.selectedItemId !== undefined;
    }
  
    get selectedItem() : T | undefined {
      if (this.selectedItemId === undefined)
        return undefined;
  
      return this.items[this.selectedItemId];
    }
}

export class MultipleSelectionStore<T> {
    items: T[]
    selectedItems: T[]

    constructor(items: T[]) {
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

            somethingIsSelected: computed,
        })
    }

    select(item: T) : boolean {
        if (this.items.includes(item) && !this.selectedItems.includes(item)) {
            this.selectedItems.push(item);
            return true;
        }
        return false;
    }

    deselect(toRemove: T) {
        this.selectedItems = this.selectedItems.filter(item => (item as any).uuid !== (toRemove as any).uuid)
    }

    toggle(item: T) {
        if (this.select(item)) {
            return
        }
        this.deselect(item)
    }

    setItems(items: T[]) {
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

    get somethingIsSelected() {
      return this.selectedItems.length > 0;
    }
}
