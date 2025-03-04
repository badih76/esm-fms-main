import React, { Component, useState } from 'react';
import '../css/inputcomponents.css';


const PopupList = (props) => {
    const { name, data, flgDisabled, handleSelection } = props;
    const [visible, setVisible] = useState(false);

    // : &#9650; and : &#9660;
    return (
        <div className="form-group row fieldContainer" 
            style={{marginTop: '0'}}>
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                {flgDisabled != 'disabled' ? 
                    (
                        <button className="form-control" 
                            style={{height: '25px', lineHeight: '10px', fontSize: '10px', fontWeight: 'bolder', border: 'solid 1px black'}}
                            onClick={() => setVisible(!visible)}>
                            {'Locations List ' + (visible ? '▲' : '▼')}
                        </button>
                    ) : ''}
                
            </div>
            {visible ? 
                (
                    <select id={"sel"+name} size={5} className="form-control"
                        onChange={handleSelection}
                        style={{fontSize: '10px'}} >
                        {data.map((item) => <option value={item}>{item}</option>)}
                    </select>
                ) : ''}
        </div>) 
}

export default PopupList;