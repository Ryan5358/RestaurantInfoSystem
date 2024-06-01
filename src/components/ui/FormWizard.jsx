import React, { useEffect, useState } from "react";
import { set, startCase } from "lodash";

import Loader from "@components/ui/Loader";
import { useWizard } from "@contexts/FormWizardContext";
import useAxiosRequest from "@hooks/useAxiosRequest";
import { updateKeys, METHODS, displayValue } from "@utils/utils";

function WizardResult({ id }) {
    const { category, wizResultMapping, wizRequestPath } = useWizard();

    const { data, loading, error, showResult, setEnabled } = useAxiosRequest([], METHODS.GET, `${wizRequestPath}/${id}`)


    const { rHandle } = updateKeys(wizResultMapping)

    useEffect(() => {
        setEnabled(true)
    }, [])

    return (
        <div>
            {showResult && <Loader loading={loading} error={error} trigger={() => setEnabled(true)} text={`Retrieving your ${category.toLowerCase()}`} justify={"start"} size={"1.5rem"}>
                <div>
                    <p>Below is your {category.toLowerCase()} information:</p>
                    <ul class="list-group list-group-flush">
                        { Object.entries(rHandle(data)).map(([key, value]) => {
                            return (
                                <li class="list-group-item d-flex justify-content-between align-items-start" key={key}>
                                    <div class="ms-2 me-auto">
                                        <div class="fw-bold">{key}</div>
                                        {displayValue(value)}
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </Loader>}
        </div>
    );
}

function WizardSummary({ title }) {
    const { category, wizData, wizRequest, wizSteps } = useWizard();
    const [ result, setResult ] = useState()

    let { data, loading, error, isDataReceived, showResult } = wizRequest;

    useEffect(() => {
        if(isDataReceived()) setResult(data)
    }, [data])

    return (
        <>
            <h2 className="fs-1 fw-light mb-5">{ isDataReceived() ? "Thank you" : title }</h2>
            
            <div className="row g-5">
                { !isDataReceived() && wizSteps.map(({ name, dataName }, index) => {
                    return (
                        <div>
                            <div className="card shadow border-0 p-3" key={index}>
                                <div className="card-body">
                                    <h3 className="fw-light mb-3">{ name }</h3>
                                    <ul className="list-group list-group-flush">
                                        { Object.entries(wizData[dataName]).map(([field, value]) => {
                                            return (
                                                <li className="list-group-item bg-transparent d-flex justify-content-between" key={field}>
                                                    <span className="fw-semibold">{startCase(field)}:</span> {displayValue(value)}
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )
                })}
                {showResult && <Loader loading={loading} error={error}>
                    <div>
                        <div className="card border-0 shadow">
                            <div className="card-body px-4">
                                <h4 className="card-title mb-3 d-flex"><i className="bi bi-check-circle-fill me-2 fs-5"/>Your {category.toLowerCase()} is confirmed</h4>
                                <div className="d-flex align-items-center gap-5 mb-3">
                                    <div className="flex-grow-1 fs-4">
                                        Your {category.toLowerCase()}:
                                    </div>
                                    <div className="fs-1">#{ result }</div>
                                </div>
                                <WizardResult id={result}/>
                            </div>
                        </div>
                    </div>
                </Loader>}
            </div>
        </>
    )
}

export default function FormWizard({ title }) {
    const { category, wizSteps, wizRequest } = useWizard();
    const [ steps, setSteps ] = useState(wizSteps)
    const [ curStep, setStep ] = useState(0);
    const [ unlockTill, setUnlockTill ] = useState(0);

    const { isDataReceived, enabled, setEnabled } = wizRequest;

    function renderComponent() {
        const Component = steps[curStep].render
        return <Component title={steps[curStep].name} dataName={steps[curStep].dataName} />
    }
    
    function checkBoundary(boundary) {
        if (boundary == "lower") return curStep == 0
        if (boundary == "upper") return curStep == steps.length - 1
    }

    function handlePrev() {
        setStep(prev => --prev);
        if (curStep - unlockTill == 0) setUnlockTill(prev => --prev)
    }

    function handleNext() {
        if (checkBoundary("upper")) {
            setEnabled(true)
        } else {
            setStep(prev => ++prev);
        }
        if (curStep - unlockTill == 0) setUnlockTill(prev => ++prev)
    }


    useEffect(() => {
        setSteps(prevSteps => {
            if (!prevSteps.some(step => step.name === `${category} Summary`)) {
                return [...prevSteps, {
                    name: `${category} Summary`,
                    render: WizardSummary
                }];
            }
            return prevSteps;
        });
    }, []);

    return (
        <div className="row h-100">
            <div className="col-xxl-3 col-lg-4 col-12 bg-body-tertiary rounded-4">
                <div className="px-3 py-4">
                    <h1 className="fs-2 fw-light mb-4">{ title }</h1>
                    <ol className="list-group list-group-flush">
                        { steps.map(({name}, index) => {
                            return (
                                <li className="list-group-item bg-transparent" key={index}>
                                    <button type="button" className={`btn w-100 text-start ${curStep == index && !isDataReceived() ? 'btn-primary' : 'text-primary'} ${index > unlockTill || isDataReceived() ? 'border-0 text-secondary disabled' : ''}`} key={index} onClick={() => setStep(index)}>
                                        {index + 1}. {name}
                                    </button>
                                </li>
                            )
                        })}
                    </ol>
                </div>
            </div>
            <div className="col-xxl-9 col-lg-8 col-12">
                <div className="d-flex justify-content-center h-100">
                    <div className="container col-xl-7 col-lg-8">
                        <div className="h-100 py-5">
                            <div className="mb-4">
                                { renderComponent() }
                            </div>
                            {!isDataReceived() && <><hr/>
                            <div className="d-flex justify-content-between">
                                <button type="button" className={`btn btn-primary ${checkBoundary("lower") ? 'invisible' : ''}`} onClick={handlePrev}>Previous</button>
                                <button type="button" className={`btn ${checkBoundary('upper') ? 'btn-success' : (enabled ? 'disabled btn-secondary' : 'btn-primary')}`} onClick={handleNext}>{checkBoundary("upper") ? <span><i className="bi bi-send me-2"/>Submit</span> : 'Next'}</button>
                            </div></>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}