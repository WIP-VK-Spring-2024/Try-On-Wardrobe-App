import { makeObservable, observable, action, computed, autorun } from 'mobx';

type FilterPredicateType = (item: any) => boolean
type FilterPredicatesType = {[key: string]: FilterPredicateType}

interface FilterStoreProps {
    origin: any[],
    filterPredicates?: FilterPredicatesType
}

export class FilterStore {
    origin: any[]
    filterPredicates: FilterPredicatesType

    constructor(props: FilterStoreProps) {
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

    setOrigin(origin: any[]) {
        this.origin = origin;
    }

    setFilter(key: string, filter: FilterPredicateType) {
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
