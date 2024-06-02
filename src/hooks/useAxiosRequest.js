import { useEffect, useState } from 'react';
import { isEmpty, isNumber } from 'lodash';

import { handleAxiosRequest } from '@utils/utils';


export default function useAxiosRequest(initialData, method, path, options) {
    const [ enabled, setEnabled ] = useState(false)
    const [ data, setData ] = useState(initialData);
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState();
    const [ showResult, setShowResult ] = useState(false);

    const { execute, setRequestOptions } = handleAxiosRequest(method, path, options)

    function isDataEmpty() {
        return !(!isEmpty(data) || (isNumber(data) && !!data))
    }
    
    useEffect(() => {
        if (enabled) {
            console.log("Requesting...")
            setShowResult(true);
            setError();
            setLoading(true);
            execute(setData, setLoading, setError);
        }
        setEnabled(false);
    }, [enabled, data]);

    return {
        data,
        loading,
        error,
        showResult,
        enabled,
        setEnabled,
        setRequestOptions,
        isDataEmpty,
    };
};