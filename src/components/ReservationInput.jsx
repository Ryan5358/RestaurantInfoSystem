import React, { useEffect, useState } from "react";

import Loader from "@components/ui/Loader";

import { useWizard } from "@contexts/FormWizardContext";
import { getFieldNames, METHODS, updateKeys, updateStateObj, displayValue } from "@utils/utils";
import useAxiosRequest from "@hooks/useAxiosRequest";
import { isEmpty } from "lodash";


const { rHandle } = updateKeys({
    id: "_reservationID",
    customerId: "_customerID",
    dateTime: "_dateTime",
    table: "_tableId",
})

export default function ReservationInput({ title, dataName }) {
    const { wizData, setData } = useWizard();

    const [ reservation, setReservation ] = useState({
        id: "",
        customerId: "",
        dateTime: "",
        table: ""
    });

    const { update } = updateStateObj(setReservation);

    const { data, loading, error, showResult, enabled, isDataEmpty, setEnabled } = useAxiosRequest([], METHODS.GET, `/reservations/${reservation.id}`)

    const record = rHandle(data);

    useEffect(() => {
        if (!isDataEmpty()) setReservation(record)
    }, [data])

    useEffect(() => {
        if(!isDataEmpty()) updateStateObj(setData).update(reservation, [dataName])
    }, [reservation])

    return (
        <>
            <h2 className="fs-1 fw-light mb-5">{ title }</h2>
            <div className="row g-5">
                <div>
                    <div className="card shadow border-0 p-3">
                        <form className="card-body">
                            <div className="mb-3">
                                <label htmlFor="reservation-id" className="form-label">Reservation #</label>
                                <input type="text" className="form-control" id="reservation-id" placeholder="Reservation ID" value={reservation.id} onChange={e => update(e, "id")}/>
                            </div>
                            <button type="button" className={`btn w-100 ${reservation.id == "" || enabled ? 'disabled btn-secondary' : 'btn-primary'}`} onClick={() => setEnabled(true)}><i className="bi bi-search me-2"/>Search</button>
                        </form>
                    </div>
                </div>
                {showResult && <Loader loading={loading} error={error} isEmpty={isDataEmpty()}>
                    <div>
                        <table className="table table-hover caption-top border">
                            <caption>Reservation information</caption>
                            <thead className="table-light">
                                <tr>
                                    <th><i className="bi bi-check2-square me-2"/></th>
                                    {
                                        getFieldNames(record).map((fieldName) => {
                                            return <th scope="col" key={fieldName}>{fieldName}</th>
                                        })
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                    <tr>
                                        <td><i className="bi bi-check-circle"/></td>
                                        { Object.values(record).map((value, index) => {
                                            return (index == 0)
                                                ? <th scope="row" key={index}>{value}</th>
                                                : <td key={index}>{displayValue(value)}</td>
                                        })}
                                    </tr>
                            </tbody>
                        </table>
                    </div>
                </Loader>}
            </div>
        </>
    );
}