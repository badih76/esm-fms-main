import React, { Component } from 'react';
import TicketsByMonthForm from './customercare/ticketsbymonth';
import TicketsByContractForm from './customercare/ticketscontractwise';
import TicketsStatSumForm from './customercare/ticketsstatisticssummary';
import JobCardsByDateForm from './maintenance/jobcardsdatewise';
import JobCardsStatSumForm from './maintenance/jcstatisticssummary';

class ReturnForm extends Component {
    state = {
        forms: {
            tbmForm: () => {
                return ( <TicketsByMonthForm />)
            }
        }
    }
   render() {
       if(this.props.reqForm === 'tbmForm')
       {
            return <TicketsByMonthForm />;
       }
       else if(this.props.reqForm === 'tcontForm')
       {
           return <TicketsByContractForm />
       }
       else if(this.props.reqForm === 'tssForm')
       {
           return <TicketsStatSumForm />
       }
       else if(this.props.reqForm === 'jclForm')
       {
           return <JobCardsByDateForm />
       }
       else if(this.props.reqForm === 'jcssForm')
       {
           return <JobCardsStatSumForm />
       }
       
      
   }
}

export default ReturnForm;