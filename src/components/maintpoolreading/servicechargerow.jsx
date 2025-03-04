import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const transDescStyle = {
    textAlign: "center"
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
    const { reading, transClick, id } = props;
    
    console.log('Reading: ', reading);
    return ( 
        <tr>
            <td style={transDateStyle}>{new Date(reading.transDate).toLocaleDateString()}</td>
            <td style={transDateStyle}>{reading.transTime ? reading.transTime : ""}</td>
            <td style={transDescStyle}>{reading.pHReading}</td>
            <td style={transDescStyle}>{reading.clReading}</td>
            <td style={transDescStyle}>{reading.tempReading}</td>
            <td >
                <button onClick={() => transClick(id)}><FontAwesomeIcon icon="edit"></FontAwesomeIcon></button>
            </td>
        </tr>
        
    );
    
};

export default ServiceChargeRow;