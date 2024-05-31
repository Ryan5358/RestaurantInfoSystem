import React, { useEffect, useState } from "react";

import { useWizard } from "@contexts/FormWizardContext";
import { getFieldNames } from "@utils/utils";

const options = [{
        name: "Search a Customer",
        render: SearchCustomerForm,
    }, 
    {
        name: "New Customer",
        render: NewCustomerForm,
    }
]

const data = [
    {
        id: 1,
        name: "Cust1",
        phone: "0412315334",
        email: "cust1@example.com"
    },
    {
        id: 2,
        name: "Cust2",
        phone: "0414525264",
        email: "cust2@example.com"
    }
]

export default function CustomerInput({ title, dataName }) {
    const [ curOption, setOption ] = useState(0);
    const [ customer, setCustomer ] = useState({
        id: -1,
        name: "",
        phone: "",
        email: "",
    });
    const { setData } = useWizard();

    useEffect(() => {
        setData(prev => ({...prev, [dataName]: customer}))
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
    return (
        <>
            <div>
                <div className="card shadow border-0 p-3">
                    <form className="card-body">
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input type="text" className="form-control" id="name" placeholder="Customer name"/>
                        </div>
                        <div className="mb-5">
                            <label htmlFor="phone" className="form-label">Phone</label>
                            <input type="text" className="form-control" id="phone" placeholder="Customer phone number"/>
                        </div>
                        <button type="submit" className="btn btn-primary w-100"><i className="bi bi-search me-2"/>Search</button>
                    </form>
                </div>
            </div>
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
                                return (
                                    <tr key={rowIndex}>
                                        <td key={rowIndex}>
                                            <input type="radio" className="btn-check" name="customer" value="" onChange={() => setCustomer(record)} id={"customer-"+record.id} autoComplete="off"/>
                                            <label className="btn btn-outline-primary btn-sm " htmlFor={"customer-"+record.id}>Select</label>
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
        </>
    );
}

const newCustomer = {
    name: "",
    phone: "",
    email: ""
}

function NewCustomerForm({ customer, setCustomer }) {
    return (
        <>
            <div>
                <div className="card shadow border-0 p-3">
                    <form className="card-body">
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input type="text" className="form-control" id="name" placeholder="Customer name"/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="phone" className="form-label">Phone</label>
                            <input type="text" className="form-control" id="phone" placeholder="Customer phone number"/>
                        </div>
                        <div className="mb-5">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input type="text" className="form-control" id="email" placeholder="Customer email"/>
                        </div>
                        <button type="submit" className="btn btn-primary w-100"><i className="bi bi-plus-lg me-2"/>Submit</button>
                    </form>
                </div>
            </div>
            { customer.id != -1 &&
                <div>
                    <div className="card shadow border-0 p-3">
                        <div className="card-body">
                            <div className="mb-5">
                                <label htmlFor="customerId" className="form-label">New customer registered with <strong>id</strong></label>
                                <input type="text" className="form-control" id="customerId" value={customer.id} disabled/>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
            
    );
}