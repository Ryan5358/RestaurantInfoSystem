import React from "react";

import WizardProvider, { wizProps } from "@contexts/FormWizardContext";
import FormWizard from "@components/ui/FormWizard";
import CustomerInput from "@components/CustomerInput";
import NewReservation from "@components/NewReservation";

const steps = [
    {
        name: "Customer Details",
        render: CustomerInput,
        dataName: "customer"
    },
    {
        name: "Reservation Details",
        render: NewReservation,
        dataName: "reservation"
    },
];

wizProps.wizResultMapping = {
    "Customer #": "_customerID",
    "Date & Time": "_dateTime",
    Table: "_tableId"
}

wizProps.wizRequestPath = "/reservations"

wizProps.wizRequestOptions = {
    requestBodyKey: "reservation"
}


export default function ReservationRequest() {

    return (
        <WizardProvider 
            category="Reservation"  
            wizSteps={steps}
        >
            <FormWizard title="Make a Reservation"/>
        </WizardProvider>
    );
}