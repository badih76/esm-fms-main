import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const transDescStyle = {
    textAlign: "left"
};

const transDateStyle = {
    textAlign: "left"
};

const currColStyle = {
    textAlign: "right"
};

function formatCurrency(n) {
    return (n).toLocaleString(undefined, {minimumFractionDigits: 3});
};


const ServiceChargeRow = (props) => {
    const { id, transDate, transDesc, transAmountDr, transAmountCr, transClick, transId } = props;
    
    return ( 
        <tr>
            <td >{transId}</td>
            <td style={transDateStyle}>{new Date(transDate).toLocaleDateString()}</td>
            <td style={transDescStyle}>{transDesc}</td>
            <td style={currColStyle}>{formatCurrency(transAmountDr)}</td>
            <td style={currColStyle}>{formatCurrency(transAmountCr)}</td>
            <td >
                <button onClick={() => transClick(id)}><FontAwesomeIcon icon="edit"></FontAwesomeIcon></button>
            </td>
        </tr>
        
    );
    
};

export default ServiceChargeRow;