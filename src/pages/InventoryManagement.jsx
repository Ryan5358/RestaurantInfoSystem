import React, { useState } from "react";

import { WizardProvider } from "@contexts/FormWizardContext";
import FormWizard from "@components/ui/FormWizard";
import CustomerInput from "@components/CustomerInput";
import ReservationInput from "@components/ReservationInput";

import { createObjectFromKey } from "@utils/utils";

const steps = [
    {
        name: "Customer Details",
        render: CustomerInput,
        dataName: "customer"
    },
    {
        name: "Reservation Details",
        render: ReservationInput,
        dataName: "reservation"
    },
];


export default function ReservationRequest() {
    const [data, setData] = useState(createObjectFromKey(steps, "dataName"));
    
    return (
        <WizardProvider contextValues={{data, setData, steps}}>
            <FormWizard title="Make a Reservation" category="Reservation"/>
        </WizardProvider>
    );
}