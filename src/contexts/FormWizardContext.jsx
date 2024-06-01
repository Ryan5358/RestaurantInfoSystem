import React, { createContext, useContext, useState } from "react";

import useAxiosRequest from "@hooks/useAxiosRequest";

import { createObjectFromKey, METHODS } from "@utils/utils";

const WizardContext = createContext();

export const useWizard = () => {
    return useContext(WizardContext);
};

export default function WizardProvider ({ children, category, requestInitialData, wizSteps, contextValues }) {
    const [wizData, setData] = useState(createObjectFromKey(wizSteps, "dataName"));
    const wizRequest = useAxiosRequest(requestInitialData || {}, METHODS.POST, wizProps.wizRequestPath)

    const { paramsKey, requestBodyKey } = wizProps.wizRequestOptions;

    wizRequest.setRequestOptions({ params: wizData[paramsKey] || null, requestBody: wizData[requestBodyKey] || null});

    return (
        <WizardContext.Provider value={{category, wizData, setData, wizRequest, wizSteps, ...wizProps, ...contextValues}}>
            {children}
        </WizardContext.Provider>
    );
};

export const wizProps = { 
    wizResultMapping: {},
    wizRequestPath: "",
    wizRequestOptions: {
        paramsKey: "",
        requestBodyKey:"",
    }
}
