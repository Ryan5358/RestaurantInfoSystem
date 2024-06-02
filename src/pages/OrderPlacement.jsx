import React from "react";

import WizardProvider, { wizProps } from "@contexts/FormWizardContext";
import ReservationInput from "@components/ReservationInput";
import NewOrder from "@components/NewOrder";

export default function OrderPlacement() {
    const steps = [
        {
            name: "Reservation Details",
            render: ReservationInput,
            dataName: "reservation"
        },
        {
            name: "Order Details",
            render: NewOrder,
            dataName: "order"
        },
    ];
    
    wizProps.wizResultMapping = {
        "Customer #": "_customerID",
        "Date & Time": "_dateTime",
        Table: "_tableId"
    }
    
    wizProps.wizRequestPath = "/orders"
    
    wizProps.wizRequestOptions = {
        requestBodyKey: "order"
    }

    return (
        <WizardProvider 
            title="Place an Order"
            category="Order"  
            wizSteps={steps}
        />
    );
}