import React, { Component } from 'react';
import Input from '../../../common/input';

class JobCardsByDateForm extends Component {
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
                <Input name="ddlFrom" 
                    label="From" 
                    type='date'
                    value={this.state.params.ddlMonth}
                    onChange={this.handleOnChange} />
                <Input name="ddlTo"
                    type='date' 
                    label="To" 
                    value={this.state.params.ddlYear}
                    onChange={this.handleOnChange} />
                <button type="submit" className="btn btn-primary">Submit</button>
                
            </form>
       );
    }
}

export default JobCardsByDateForm;