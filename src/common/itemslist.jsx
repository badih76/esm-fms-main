import React, { Component } from 'react';
import processing from '../images/processing.gif';

class ItemsList extends Component {
    getClassName = (selected, mtype, name, mt) => {
        
        if(mtype)
        {
            if(selected)
            {
                if(selected === name)
                {
                    return "btn btn-danger btn-sm";
                } 
                else 
                {
                    if(mt === "Water")
                    {
                        return "btn btn-primary btn-sm";
                    } 
                    else return "btn btn-warning btn-sm";
                }
            }
            else
            {
                if(mt === "Water")
                {
                    return "btn btn-primary btn-sm";
                } 
                else return "btn btn-warning btn-sm";
            }
        }
        else
        {
            if(selected)
            {
                if(selected === name) 
                { 
                    return "btn btn-primary btn-sm";
                }
                else return "btn btn-success btn-sm";
            }
            else
            {
                return "btn btn-success btn-sm"
            }
        }
    }

    render() {
        const { data, name, label, onClick, showProcess, showList, selected, mtype } = this.props;
        let tbody;
        if(!data) 
        {
            tbody = ``;
        }
        else
        {
            tbody = (
                data.map(c => { 
                    return (
                    <tr key={c[name]}>
                        <td>
                            <button 
                                className={this.getClassName(selected, mtype, c[name], (mtype ? c.Type : null))}
                                key={c[name]} 
                                style={{width: "100%"}}
                                onClick={() => onClick(c[name])}>
                                {c[label]}
                            </button>
                        </td>
                    </tr>
                )})
            );
        }

        return (
            <React.Fragment>
                <img src={processing} 
                        width="60vw" 
                        alt="processing" 
                        className={showProcess ? "" : "hidden"} 
                        style={{marginTop: "5vh"}} />
                <table width="100%" className={showList ? "" : "hidden"} >
                    <tbody>
                        {tbody}        
                    </tbody>
                </table>
            </React.Fragment>
                        
        );
    }

};

export default ItemsList;