import { makeObservable, observable, action, computed, autorun } from 'mobx';

type FilterPredicateType<T> = (item: T) => boolean
type FilterPredicatesType<T> = {[key: string]: FilterPredicateType<T>}

interface FilterStoreProps<T> {
    origin: T[],
    filterPredicates?: FilterPredicatesType<T>
}

export class FilterStore<T> {
    origin: any[]
    filterPredicates: FilterPredicatesType<T>

    constructor(props: FilterStoreProps<T>) {
        this.origin = props.origin;
        this.filterPredicates = props.filterPredicates || {}

        makeObservable(this, {
            origin: observable,
            filterPredicates: observable,
            setOrigin: action,

            setFilter: action,
            removeFilter: action,

            items: computed,    // all computed properties are calculated lazily
        })
    }

    hasFilter(key: string) {
        return key in this.filterPredicates;
    }

    setOrigin(origin: any[]) {
        this.origin = origin;
    }

    setFilter(key: string, filter: FilterPredicateType<T>) {
        this.filterPredicates[key] = filter;
    }

    removeFilter(key: string) {
        delete this.filterPredicates[key];
    }

    get items() {
        const filters = Object.values(this.filterPredicates)
        return filters.reduce((result, filterPredicate) => result.filter(filterPredicate), this.origin);
    }
}
