import React, { Component } from 'react';
import Input, { DropDownList } from '../../common/input';

class ServiceRow extends Component {
    state={
        servicesList: []
    }

    constructor() 
    {
        super();
        
    }

    render() {
        const { service, id, onChange, servList, flags } = this.props;

        return (
            <React.Fragment>
                <div className='row'>
                    <div className='col-md-2'>
                        <select className="form-control" 
                            disabled={!flags.isEdit && !flags.isAdd}
                            onChange={(e) => {
                                onChange("serviceName", e.currentTarget.value, id); }} >
                            <option value=''></option>
                            {servList.map(s => {
                                return (
                                    <option key={id+s} value={s} 
                                        selected={(s === service.serviceName) ? "selected" : ""}>
                                        {s}
                                    </option>);
                            })}
                        </select>
                    </div>
                    <div className='col-md-1'>
                        <input type='checkbox' 
                            className="form-control"
                            value={service.subcontracted}
                            defaultChecked={service.subcontracted} 
                            disabled={!flags.isEdit && !flags.isAdd}
                            onChange={(e) => {
                                onChange("subcontracted", e.currentTarget.checked, id); }} 
                        />
                    </div>
                    <div className='col-md-2'>
                        <input type="number" style={{width: "100%", textAlign: 'right'}} 
                            className="form-control"
                            value={service.subcontValue}
                            disabled={!flags.isEdit && !flags.isAdd}
                            onChange={(e) => {
                                onChange("subcontValue", e.currentTarget.value, id); }} />
                    </div>
                    <div className='col-md-1'>
                        <select style={{width: "100%"}} className="form-control"
                            disabled={!flags.isEdit && !flags.isAdd}
                            onChange={(e) => {
                                onChange("manfeestype", e.currentTarget.value, id); }}>
                            <option value=""></option>
                            <option selected={(service.manfeestype === '%') ? "selected" : ""}>%</option>
                            <option selected={(service.manfeestype === 'Value') ? "selected" : ""}>Value</option>
                        </select>
                    </div>
                    <div className='col-md-2'>
                        <input type="number" style={{width: "100%", textAlign: 'right'}}
                            className="form-control"
                            value={service.manfeesvalue}
                            disabled={!flags.isEdit && !flags.isAdd}
                            onChange={(e) => {
                                onChange("manfeesvalue", e.currentTarget.value, id); }} 
                        />
                    </div>
                    <div className='col-md-2'>
                        <input type="number" style={{width: "100%", textAlign: 'center'}}
                            className="form-control"
                            value={service.manPower}
                            disabled={!flags.isEdit && !flags.isAdd}
                            onChange={(e) => {
                                onChange("manPower", e.currentTarget.value, id); }}
                        />
                    </div>
                    <div className='col-md-2'>
                        <input type="number" style={{width: "100%", textAlign: 'right'}}
                            className="form-control"
                            value={service.quotedValue}
                            disabled={!flags.isEdit && !flags.isAdd}
                            onChange={(e) => {
                                onChange("quotedValue", e.currentTarget.value, id); }} 
                        />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default ServiceRow;

const currencyStyle = {
    textAlign: "right"
}