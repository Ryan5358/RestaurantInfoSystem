import React from "react";

export default function Loader({ loading, error, trigger, justify, align, colorClass, size, text, children }) {
    const defaultSize = "2rem"

    return (
        <>
            { loading 
                ? <>
                    <div className={`d-flex justify-content-${justify || 'center'} align-items-${align || 'center'} h-100 w-100'`}>
                        <div className={`spinner-border ${colorClass}`} role="status" style={{ width: size || defaultSize, height: size || defaultSize }}>
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <span className="ms-3">{ text || "Loading" }...</span>
                    </div>
                </>
                :  error
                    ? <>
                        <div>
                            <div className="position-relative alert alert-danger" role="alert">
                                {!!trigger && <button type="button" className="btn btn-outline-dark position-absolute end-0 me-3" onClick={trigger}><i className="bi bi-arrow-clockwise"/></button>}
                                <h4 className="alert-heading mb-3"><i className="bi bi-x-circle-fill me-2 fs-5"/>Failed: {error.name}</h4>
                                <div>{error.message}</div>
                            </div>
                        </div>
                    </>
                    : <>{children}</>
            }
        </>
    );
}