import { makeObservable, observable, action, computed } from 'mobx';

type FilterPredicateType = (item: any) => boolean

interface FilterStoreProps {
    origin: any[],
    filterPredicates?: FilterPredicateType[]
}

class FilterStore {
    origin: any[]
    filterPredicates: FilterPredicateType[]

    constructor(props: FilterStoreProps) {
        this.origin = props.origin;
        this.filterPredicates = props.filterPredicates || []

        makeObservable(this, {
            origin: observable,
        })
    }


}
