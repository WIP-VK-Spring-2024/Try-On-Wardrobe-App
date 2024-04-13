import { isEmpty, isObject } from "../utils";

function getIndexesF<T> (f: (el: T)=>boolean) {
    return (arr: T[]) => {
        const res: number[] = [];
        arr.forEach((el, i) => {
            if (f(el)) {
                res.push(i);
            }
        })
        return res;
    }
}

const isTrue = (el: boolean) => el;
const isFalse = (el: boolean) => !el;

type comparatorType<T> = (first: T, second: T) => boolean;

type diffObjFabric = (key: string, a: any, b: any) => any;

const defaultDiffObjFabric: diffObjFabric = (key: string, a: any, b: any) => ({
    key,
    current: a,
    target: b
});

function getDiff (a: any, b: any, createDiffObj: diffObjFabric) {
    let diff: any = {}
    for (const prop in a) {
        if (b.hasOwnProperty(prop)) {
            if (isObject(a[prop]) && isObject(b[prop])) {
                const localDiff = getDiff(a[prop], b[prop], createDiffObj);
                if (!isEmpty(localDiff)) {
                    diff[prop] = localDiff;
                }
            } else {
                if (a[prop] !== b[prop]) {
                    diff[prop] = createDiffObj(prop, a[prop], b[prop])
                }
            }
        } else {
            diff[prop] = createDiffObj(prop, a[prop], undefined)
        }
    }

    return diff;
}

/* returns difference of 2 arrays in special format:
// [
//   [ indexes of elements to copy from arr2 to arr1 ]
//   [ indexes of elements to delete from arr1 ]
//   [ 
        {
            arr1 id,
            key,
            current value,
            target value
        }
     ] - changes to arr1
// ]
*/
export function arrayComp<T>(arr1: T[], arr2: T[], comparator: comparatorType<T>)
: {
    toAddIndices: number[],
    toDeleteIndices: number[],
    diffs: {
        id: number,
        key: string,
        current: any,
        value: any
    }[]
} {
    const getFalseIndexes = getIndexesF(isFalse);

    const findNotExisting = (arr2: T[], arr1: T[]) => {
        return arr2.map(el => arr1.map(item => comparator(el, item)).some(isTrue))
    }

    const toAddIndices: number[] = [];
    const diffs: any[] = [];

    arr2.forEach((el, i2) => {
        const i1 = arr1.findIndex(item => comparator(el, item));

        if (i1 === -1) {
            toAddIndices.push(i2);
        } else {
            let diff = getDiff(el, arr1[i1], defaultDiffObjFabric);
            diff.id = i1;

            if (!isEmpty(diff)) {
                diffs.push({
                    currentId: i1,
                    ...diff
                })
            }
        }
    })

    const toDeleteIndices = getFalseIndexes(findNotExisting(arr1, arr2))

    return {
        toAddIndices: toAddIndices,
        toDeleteIndices: toDeleteIndices,
        diffs: diffs
    }
}
