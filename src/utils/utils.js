import { startCase } from "lodash";
import axios from "axios";

export function getFieldNames(source) {
    if (!source || (Array.isArray(source) ? source.length == 0 : Object.entries(source).length == 0)) return []
    const record = Array.isArray(source) ? source[0] : source
    return Object.keys(record).map(fieldName => {
        if (fieldName == 'id') return '#'
        else return startCase(fieldName)
    })
}

export function toMySQLDateTime(timeString) {
    const time = new Date(timeString);
    const localOffsetMs = new Date().getTimezoneOffset() * 60 * 1000;
    const localTime = new Date(time - localOffsetMs);
    return localTime.toISOString().slice(0, 16).replace('T', ' ') + ":00"
}

export function displayValue(value) {
    if (!value || value == -1) return "null";
    if (!/^\d{4}-\d{2}-\d{2}(T| )\d{2}:\d{2}:\d{2}(.000Z)*$/.test(value)) return value;

    const date = new Date(value);
    return `${date.toLocaleString(undefined, { timeZoneName: "short", hour12: true })}`.toUpperCase()

}

export function createObjectFromKey(arr, commonKey) {
    const result = {};

    for (const item of arr) {
        result[item[commonKey]] = {}; // Create an empty object for each step
    }

    return result;
}

export function wrapWithArrary(obj) {
    if (Array.isArray(obj)) return obj
    else return [obj]
}

export const METHODS = {
    GET: "get",
    POST: "post",
    PUT: "put",
    DELETE: "delete"
}

export function handleAxiosRequest(method, path, options) {
    let usedOptions = options;

    async function execute(setData, setLoading, setError) {
        path = import.meta.env.VITE_APP_API + path

        let params, requestBody;

        if (!!usedOptions) {
            if (usedOptions.hasOwnProperty("params")) params = usedOptions.params;
            if (usedOptions.hasOwnProperty("requestBody")) requestBody = usedOptions.requestBody;
        }

        try {
            let response;
            switch (method) {
                case METHODS.GET:
                    console.log("GET request", params)
                    response = await axios.get(path, { params });
                    break;
                case METHODS.POST:
                    console.log("POST request", requestBody)
                    response = await axios.post(path, requestBody);
                    break;
                case METHODS.PUT:
                    console.log("PUT request", requestBody)
                    response = await axios.put(path, requestBody);
                    break;
                case METHODS.DELETE:
                    console.log("DELETE request")
                    response = await axios.delete(path);
                    break;
                default:
                    console.error("Invalid method")
                    break;
            }
            
            if (setData) {
                setData(response.data);
            }
        } catch (error) {
            if(setError) setError(error)
            console.error(error)
        } finally {
            if(setLoading) setLoading(false);
        }
    };

    function setRequestOptions(options) {
        usedOptions = options;
    }

    return {
        execute,
        setRequestOptions
    };
}

export function removeProps(obj, ...propsToRemove) {
    const result = { ...obj };
    propsToRemove.forEach(prop => delete result[prop]);
    return result;
}

export function updateKeys(mapping) {

    const rMapping = Object.keys(mapping).reduce((result, key) => {
        const value = mapping[key];
        result[value] = key;
        return result;
    }, {});

    let usedMapping = mapping;

    function handle(data) {
        return Object.keys(data).reduce((result, key) => {
            if (usedMapping.hasOwnProperty(key)) {
                const newKey = usedMapping[key];
                result[newKey] = data[key];
            }
            return result;
        }, {})
    }

    function rHandle(data) {
        usedMapping = rMapping;
        return handle(data)
    }

    return {
        handle,
        rHandle
    };
}

export function updateStateObj(setState) {
    function update(updateWith, attribute) {
        const value = updateWith.target ? updateWith.target.value : updateWith
        setState(prev => ({...prev, [attribute]: value}))
    }

    return { update }
}