import React, { useState, useEffect } from "react";

import { useWizard } from "@contexts/FormWizardContext";
import { getFieldNames } from "@utils/utils";

const tables = [
    {
        id: 1,
        size: 4,
        available: true,
    },
    {
        id: 2,
        size: 4,
        available: false,
    },
]

export default function ReservationInput({ title, dataName }) {
    const { data, setData } = useWizard();

    const [ reservation, setReservation ] = useState({
        customerId: data.customer.id,
        dateTime: "",
        partySize: "",
        table: -1
    })

    useEffect(() => {
        setData(prev => ({...prev, [dataName]: reservation}))
    }, [reservation])

    return (
        <>
            <h2 className="fs-1 fw-light mb-5">{ title }</h2>
            <div className="row g-5">
                <div>
                    <div className="card shadow border-0 p-3">
                        <form className="card-body">
                            <div className="mb-3">
                                <label htmlFor="customerId" className="form-label">Customer Id</label>
                                <input type="text" className="form-control" id="customerId" value={reservation.customerId} disabled/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="dateTime" className="form-label">Date and Time</label>
                                <input type="datetime-local" className="form-control" id="dateTime" placeholder="Date and Time" value={reservation.dateTime} onChange={(event) => setReservation(prev => ({...prev, dateTime: event.target.value}))}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="partySize" className="form-label">Party size</label>
                                <input type="number" className="form-control" id="partySize" value={reservation.partySize} placeholder="Party size" onChange={(event) => setReservation(prev =>({...prev, partySize: event.target.value}))}/>
                            </div>
                            <div className="mb-5">
                                <label htmlFor="customerId" className="form-label">Table</label>
                                <input type="text" className="form-control" id="customerId" value={reservation.table == -1 ? "" : reservation.table} disabled/>
                            </div>
                            <button type="submit" className="btn btn-primary w-100"><i className="bi bi-search me-2"/>Search Table</button>
                        </form>
                    </div>
                </div>
                <div>
                    <table className="table table-hover caption-top border">
                        <caption>Found {tables.length} table{ tables.length > 1 ? "s" : ""}</caption>
                        <thead className="table-light">
                            <tr>
                                <th><i className="bi bi-check2-square me-2"/></th>
                                {
                                    getFieldNames(tables).map((fieldName) => {
                                        return <th scope="col" key={fieldName}>{fieldName}</th>
                                    })
                                }
                            </tr>
                        </thead>
                        <tbody>
                                {tables.map((record, rowIndex) => {
                                    return (
                                        <tr key={rowIndex}>
                                            <td key={rowIndex}>
                                                <input type="radio" className="btn-check" name="table" value="" onChange={() => setReservation(prev => ({...prev, table: record.id}))} id={"table-"+record.id} autoComplete="off"/>
                                                <label className={`btn btn-sm ${!record.available ? 'disabled border-0' : 'btn-outline-primary'}`} htmlFor={"table-"+record.id}>Select</label>
                                            </td>
                                            { Object.values(record).map((value, columnIndex) => {
                                                return (columnIndex == 0)
                                                    ? <th scope="row" key={columnIndex}>{value}</th>
                                                    : <td key={columnIndex}>{(value === true | value === false) ? (value ? <i className="bi bi-check2 fs-5"/> : <i className="bi bi-x-lg"/>) : value}</td>
                                            })}
                                        </tr>
                                    )
                                })}
                        </tbody>
                    </table>
                </div>
            </div>
            
        </>
    );
}