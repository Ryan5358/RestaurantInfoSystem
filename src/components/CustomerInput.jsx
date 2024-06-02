import React, { useEffect, useState } from "react";

import Loader from "@components/ui/Loader";

import { useWizard } from "@contexts/FormWizardContext";
import { getFieldNames, METHODS, wrapWithArrary, removeProps, updateKeys, updateStateObj } from "@utils/utils";
import useAxiosRequest from "@hooks/useAxiosRequest";

const options = [{
        name: "Search a Customer",
        render: SearchCustomerForm,
    }, 
    {
        name: "New Customer",
        render: NewCustomerForm,
    }
]

const { rHandle } = updateKeys({
    id: "_customerId",
    name: "_customerName",
    phone: "_customerPhone",
    email: "_customerEmail"
})

export default function CustomerInput({ title, dataName }) {
    const [ curOption, setOption ] = useState(0);
    const [ customer, setCustomer ] = useState({
        id: -1,
        name: "",
        phone: "",
        phone: "",
    });
    const { setData } = useWizard();

    useEffect(() => {
        if(customer.id != -1) updateStateObj(setData).update(customer, [dataName])
    }, [customer])

    function renderComponent() {
        const Component = options[curOption].render
        return <Component customer={customer} setCustomer={setCustomer} />
    }
    
    return (
        <>
            <h2 className="fs-1 fw-light mb-5">{ title }</h2>
            <div className="d-flex gap-2 mb-5 border border-2 p-2 rounded-3">
                { options.map(({name}, index) => {
                    return <button type="button" className={`btn w-100 ${curOption == index ? 'btn-primary' : 'text-primary'}`} key={index} onClick={() => setOption(index)}>{name}</button>
                })}
            </div>
            <div className="row g-5">
                { renderComponent() }
            </div>
        </>
    );
}

function SearchCustomerForm({ setCustomer }) {
    const [ params, setParams ] = useState({ name: "", phone: "" })
    const { update } = updateStateObj(setParams)

    let { data, loading, error, showResult, isDataEmpty, enabled, setEnabled } = useAxiosRequest([], METHODS.GET, "/customers", { params })

    data = wrapWithArrary(data) 

    return (
        <>
            <div>
                <div className="card shadow border-0 p-3">
                    <form className="card-body">
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input type="text" className="form-control" id="name" placeholder="Customer name" value={params.name} onChange={e => update(e, "name")}/>
                        </div>
                        <div className="mb-5">
                            <label htmlFor="phone" className="form-label">Phone</label>
                            <input type="text" className="form-control" id="phone" placeholder="Customer phone number" value={params.phone} onChange={e => update(e, "phone")}/>
                        </div>
                        <button type="button" className={`btn w-100 ${!params.name && !params.phone || enabled ? 'disabled btn-secondary' : 'btn-primary'}`} onClick={() => setEnabled(true)}><i className="bi bi-search me-2"/>Search</button>
                    </form>
                </div>
            </div>
            {showResult && <Loader loading={loading} error={error} isEmpty={isDataEmpty()}>
                <div>
                    <table className="table table-hover caption-top border">
                        <caption>Found {data.length} customer{ data.length > 1 ? "s" : ""}</caption>
                        <thead className="table-light">
                            <tr>
                                <th><i className="bi bi-check2-square me-2"/></th>
                                {
                                    getFieldNames(data).map((fieldName) => {
                                        return <th scope="col" key={fieldName}>{fieldName}</th>
                                    })
                                }
                            </tr>
                        </thead>
                        <tbody>
                                {data.map((record, rowIndex) => {
                                    record = rHandle(record)

                                    return (
                                        <tr key={rowIndex}>
                                            <td key={rowIndex}>
                                                <input type="radio" className="btn-check" name="customer" onChange={() => setCustomer(record)} id={"customer-" + rowIndex} autoComplete="off"/>
                                                <label className="btn btn-outline-primary btn-sm " htmlFor={"customer-" + rowIndex}>Select</label>
                                            </td>
                                            { Object.values(record).map((value, columnIndex) => {
                                                return (columnIndex == 0)
                                                    ? <th scope="row" key={columnIndex}>{value}</th>
                                                    : <td key={columnIndex}>{value}</td>
                                            })}
                                        </tr>
                                    )
                                })}
                        </tbody>
                    </table>
                </div>
            </Loader>}
            
        </>
    );
}

function NewCustomerForm({ customer, setCustomer }) {
    let { data, loading, error, showResult, enabled, isDataEmpty, setEnabled } = useAxiosRequest({}, METHODS.POST, "/customers", {requestBody: removeProps(customer, ["id"])})
    const { update } = updateStateObj(setCustomer)

    useEffect(() => {
        if (isDataEmpty()) updateStateObj(setCustomer).update(data, "id")
    }, [data]);
    
    return (
        <>
            <div>
                <div className="card shadow border-0 p-3">
                    <form className="card-body">
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input type="text" className="form-control" id="name" placeholder="Customer name" value={customer.name} onChange={e => update(e, "name")} required/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="phone" className="form-label">Phone</label>
                            <input type="text" className="form-control" id="phone" placeholder="Customer phone number" value={customer.phone} onChange={e => update(e, "phone")} required/>
                        </div>
                        <div className="mb-5">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input type="text" className="form-control" id="email" placeholder="Customer email" value={customer.email} onChange={e => update(e, "email")}/>
                        </div>
                        <button type="button" className={`btn w-100 ${!customer.name || !customer.phone || enabled ? 'disabled btn-secondary' : 'btn-primary'}`} onClick={() => setEnabled(true)}><i className="bi bi-plus-lg me-2"/>Submit</button>
                    </form>
                </div>
            </div>
            {showResult && <Loader loading={loading} error={error}>
                <div>
                    <div className="card shadow border-0 p-3">
                        <div className="card-body">
                            <div className="d-flex align-items-center">
                                <div className="flex-grow-1">New customer registered with <strong>id</strong></div>
                                <div className="fs-1">{customer.id}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </Loader>}
        </>
            
    );
}