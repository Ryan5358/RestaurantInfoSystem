// use-fetch-data.js
import { useEffect, useState} from 'react';
import axios from 'axios';

export const METHODS = {
    GET,
    POST,
    PUT,
    DELETE
}

export default function useAxiosRequest({ method, path, params, requestBody }) {
    const [respData, setData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function execute() {
                try {
                    let response;
                    switch (method) {
                        case METHODS.GET:
                            response = { data } = await axios.get(path, { params });
                            break;
                        case METHODS.POST:
                            response = { data } = await axios.post(path, requestBody);
                        case METHODS.PUT:
                            response = { data } = await axios.put(path, requestBody);
                        case METHODS.DELETE:
                            response = { data } = await axios.delete(path)
                        default:
                            break;
                    }
                    
                    setData(response);
                } catch (error) {
                    console.error(error)
                }

                setLoading(false);
            };

            execute();
        }, []);

    return {
        respData,
        loading,
    };
};