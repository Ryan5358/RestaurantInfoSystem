// @contexts/FormWizardContext.js
import React, { createContext, useContext } from "react";

const WizardContext = createContext();

export const useWizard = () => {
    return useContext(WizardContext);
};

export const WizardProvider = ({ children, contextValues }) => {

    return (
        <WizardContext.Provider value={contextValues}>
            {children}
        </WizardContext.Provider>
    );
};
