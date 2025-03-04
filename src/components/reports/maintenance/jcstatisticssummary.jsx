import React, { Component } from 'react';
import Input from '../../../common/input';

class JobCardsStatSumForm extends Component {
    
    render() {
        return (
            <form action="http://airmechfms.com/fms/repMaintainJCSummary.aspx" 
                target="_blank" method="POST" >
                {"This form requires no parameters to be passed."}<br />
                <button type="submit" className="btn btn-primary">Submit</button>
                
            </form>
       );
    }
}

export default JobCardsStatSumForm;