import React from 'react';
import '../css/mastinv-invcat.css';

const InfoMessageDiv = (props) => {
    return (
        <div className="row">
            <div className="col-12 msgDiv" >
                <i>{props.message}</i>
            </div>
        </div>
    );
};

export default InfoMessageDiv;