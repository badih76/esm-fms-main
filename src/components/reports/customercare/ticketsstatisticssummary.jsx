import React, { Component } from 'react';
import Input from '../../../common/input';

class TicketsStatSumForm extends Component {
    
    render() {
        return (
            <form action="http://airmechfms.com/fms/repCustCareTicketsSummary.aspx" 
                target="_blank" method="POST" >
                {"This form requires no parameters to be passed."}<br />
                <button type="submit" className="btn btn-primary">Submit</button>
                
            </form>
       );
    }
}

export default TicketsStatSumForm;