import React from 'react'

const FreeModal = ({ body, open=false, handleCancel, handleSubmit, submitText = "Submit", cancelText = "Cancel", noBtns = false, width = '45rem' }) => {
    return (
        <div className={`modal ${open ? "show-modal" : ""}`}>
            <div className="modal-container" style={{
                width: width
            }}>
                <div className="modal-body">
                    {body}
                    {!noBtns && <div className='modal-btns'>
                        <button className='btn-secondary' onClick={handleCancel}>{cancelText}</button>
                        {/* Put a loader here */}
                        {<button className='btn-primary' onClick={handleSubmit}>{submitText}</button>}
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default FreeModal