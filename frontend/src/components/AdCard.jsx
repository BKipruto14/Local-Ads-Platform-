import React from "react"

const AdCard = ({ ad, onEdit, onDelete,showActions }) => {
    return (
        <div className="border p-3 rounded shadow-sm mb-3">
            <h5>{ad.title}</h5>\
            <p>{ad.description}</p>
            <p><strong>Price:</strong>${ad.price}</p>
            <p><strong>Status:</strong>{ad.status}</p>
            {onEdit && (
                <button className="btn btn-sm btn-warning me-2" 
                onClick={() => onEdit(ad)}>Edit</button>
            )}
            {onDelete && (
                <button className="btn btn-sm btn-danger" 
                onClick={() => onDelete(ad.id)}>Delete</button>
            )}
            {showActions &&
            <div className="d-Flex justify-content-between mt-2">
              <button className ="btn btn-sm btn-warning">Edit</button>
              <button className ="btn btn-sm btn-danger" onClick={onDelete}>Delete</button>
            </div>
            }
        </div>
    );
};
export default AdCard;