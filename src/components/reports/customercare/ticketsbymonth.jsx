import React, { Component } from 'react';
import Input from '../../../common/input';

class TicketsByMonthForm extends Component {
    state = {
        params: {
            ddlMonth: new Date().getMonth() + 1,
            ddlYear: new Date().getFullYear()
        }
    }

    handleOnChange = (event) => {
        const { name, value } = event.currentTarget;
        let params = {...this.state.params};

        params[name] = value;
        this.setState({ params });
    } 

    render() {
        return (
            <form action="http://airmechfms.com/fms/repCustCareTicketsMonthly.aspx" 
                target="_blank" method="POST" >
                <Input name="ddlMonth" 
                    label="Month" 
                    type='number'
                    value={this.state.params.ddlMonth}
                    onChange={this.handleOnChange} />
                <Input name="ddlYear"
                    type='number' 
                    label="Year" 
                    value={this.state.params.ddlYear}
                    onChange={this.handleOnChange} />
                <button type="submit" className="btn btn-primary">Submit</button>
                
            </form>
       );
    }
}

export default TicketsByMonthForm;