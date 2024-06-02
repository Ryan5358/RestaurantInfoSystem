import React, { useState, useEffect } from "react";
import { startCase } from "lodash";

import { useWizard } from "@contexts/FormWizardContext";
import { getFieldNames, METHODS, wrapWithArrary, updateStateObj, updateKeys , toMySQLDateTime} from "@utils/utils";
import useAxiosRequest from "@hooks/useAxiosRequest";

import Loader from "@components/ui/Loader";

const { rHandle } = updateKeys({
    id: "_tableId",
    size: "_tableSize",
    isAvailable: "_isAvailable",
})

export default function NewReservation({ title, dataName }) {
    const { wizData, setData } = useWizard();
    const [ reservation, setReservation ] = useState({
        customerId: wizData.customer.id,
        dateTime: toMySQLDateTime(new Date()),
        partySize: 0,
        tableId: -1
    })

    const { update } = updateStateObj(setReservation)

    const params = { size: reservation.partySize }
    const { data, loading, isDataEmpty, setEnabled } = useAxiosRequest([], METHODS.GET, "/tables", {params})

    const tables = wrapWithArrary(data) 

    useEffect(() => {
        if(reservation.tableId != -1 && reservation.dateTime != "") updateStateObj(setData).update(reservation, [dataName])
    }, [reservation])

    return (
        <>
            <h2 className="fs-1 fw-light mb-5">{ title }</h2>
            { JSON.stringify(reservation) } { JSON.stringify(useWizard().wizData) }
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
                                <input type="datetime-local" className="form-control" id="dateTime" placeholder="Date and Time" min={toMySQLDateTime(new Date())} value={reservation.dateTime} onChange={e => update(e.target.min <= toMySQLDateTime(e.target.value) ? toMySQLDateTime(e.target.value) : "", "dateTime")}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="partySize" className="form-label">Party size</label>
                                <input type="number" className="form-control" id="partySize" value={reservation.partySize} placeholder="Party size" onChange={e => update(e, "partySize")}/>
                            </div>
                            <div className="mb-5">
                                <label htmlFor="customerId" className="form-label">Table</label>
                                <input type="text" className="form-control" id="customerId" value={reservation.tableId == -1 ? "" : reservation.tableId} disabled/>
                            </div>
                            <button type="button" className="btn btn-primary w-100" onClick={() => setEnabled(true)}><i className="bi bi-search me-2"/>Search Table</button>
                        </form>
                    </div>
                </div>
                {(tables.length > 0 || loading) && <Loader loading={loading} isEmpty={isDataEmpty()}>
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
                                            record = rHandle(record)
                                            return (
                                                <tr key={rowIndex}>
                                                    <td key={rowIndex}>
                                                        <input type="radio" className="btn-check" name="table" value="" onChange={() =>update(record.id, "tableId")} id={"table-"+record.id} autoComplete="off"/>
                                                        <label className={`btn btn-sm ${!record.isAvailable ? 'disabled border-0' : 'btn-outline-primary'}`} htmlFor={"table-"+record.id}>Select</label>
                                                    </td>
                                                    { Object.entries(record).map(([key, value], columnIndex) => {
                                                        return (columnIndex == 0)
                                                            ? <th scope="row" key={key}>{value}</th>
                                                            : <td key={key}>{(startCase(key) == "Is Available" && value == 1 | value == 0) ? (value ? <i className="bi bi-check2 fs-5"/> : <i className="bi bi-x-lg"/>) : value}</td>
                                                    })}
                                                </tr>
                                            )
                                        })}
                                </tbody>
                            </table>
                        </div>
                </Loader>}
            </div>
            
        </>
    );
}