import React, { useEffect, useState } from "react";
import { startCase } from "lodash";

import { useWizard } from "@contexts/FormWizardContext";


function WizardSummary({ title }) {
    const { data, steps } = useWizard();

    function displayValue(value) {
        if (!value || value == -1) return "null";
        if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return value;

        const date = new Date(value);
        return `${date.toLocaleString(undefined, { timeZoneName: "short", hour12: true })}`.toUpperCase()

    }

    return (
        <>
            <h2 className="fs-1 fw-light mb-5">{ title }</h2>
            
            <div className="row g-5">
                { steps.map(({ name, dataName }, index) => {
                    if (index != (steps.length - 1)) {
                        return (
                            <div>
                                <div className="card shadow border-0 p-3" key={index}>
                                    <div className="card-body">
                                        <h3 className="fw-light mb-3">{ name }</h3>
                                        <ul className="list-group list-group-flush">
                                            { Object.entries(data[dataName]).map(([field, value], index) => {
                                                return (
                                                    <li className="list-group-item bg-transparent d-flex justify-content-between" key={index}>
                                                        <span className="fw-semibold">{startCase(field)}:</span> {displayValue(value)}
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )
                    }                    
                })}
            </div>
        </>
    )
}

export default function FormWizard({ title, category }) {
    const [ curStep, setStep ] = useState(0)
    const [ unlockTill, setUpper ] = useState(0)
    const { steps } = useWizard()

    function renderComponent() {
        const Component = steps[curStep].render
        return <Component title={steps[curStep].name} dataName={steps[curStep].dataName} />
    }
    
    function checkBoundary(boundary) {
        if (boundary == "lower") return curStep == 0
        if (boundary == "upper") return curStep == steps.length - 1
    }

    useEffect(() => {
        if (!steps.some((step) => step.name == `${category} Summary`)) {
            steps.push({
                name:  `${category} Summary`,
                render: WizardSummary
            });
        }
    }, []);

    return (
        <div className="row h-100">
            <div className="col-lg-3 col-md-4 col-12 bg-body-tertiary rounded-4">
                <div className="px-3 py-4">
                    <h1 className="fs-2 fw-light mb-4">{ title }</h1>
                    <ol className="list-group list-group-flush">
                        { steps.map(({name}, index) => {
                            return (
                                <li className="list-group-item bg-transparent" key={index}>
                                    <button type="button" className={`btn w-100 text-start ${curStep == index ? 'btn-primary' : 'text-primary'} ${index > unlockTill ? 'border-0 text-secondary disabled' : ''}`} key={index} onClick={() => setStep(index)}>
                                        {index + 1}. {name}
                                    </button>
                                </li>
                            )
                        })}
                    </ol>
                </div>
            </div>
            <div className="col-lg-9 col-md-8 col-12">
                <div className="d-flex justify-content-center h-100">
                    <div className="container col-7">
                        <div className="h-100 py-5">
                            <div className="mb-4">
                                { renderComponent() }
                            </div>
                            <hr/>
                            <div className="d-flex justify-content-between">
                                <button type="button" className={`btn btn-primary ${checkBoundary("lower") ? 'invisible' : ''}`} onClick={() => setStep(prev => --prev)}>Previous</button>
                                <button type="button" className={`btn btn-primary ${checkBoundary("upper") ? 'invisible' : ''}`} onClick={() => {setStep(prev => ++prev); ((curStep - unlockTill) == 0) ? setUpper(prev => ++prev) : null}}>Next</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}