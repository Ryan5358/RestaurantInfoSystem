import { startCase } from "lodash";

export function getFieldNames(source) {
    if (!source) return
    return Object.keys(source[0]).map(fieldName => {
        if (fieldName == 'id') return '#'
        else return startCase(fieldName)
    })
}

export function createObjectFromKey(arr, commonKey) {
    const result = {};

    for (const item of arr) {
        result[item[commonKey]] = {}; // Create an empty object for each step
    }

    return result;
}