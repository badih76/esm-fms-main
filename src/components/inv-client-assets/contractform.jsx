import React, { Component } from 'react';
import Input from '../../common/input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonGroup, Button, ButtonToolbar } from 'react-bootstrap'
import processing from '../../images/processing.gif';

class ContractForm extends Component {
    state = {
        error: ''
    }

    render() {
        const { contract } = this.props;
    
        return (
            <React.Fragment>
                <div className={this.props.showFormProcess}>
                    <img src={processing} 
                        width="60vw" 
                        alt="processing"  
                        style={{marginTop: "5vh"}} />
                </div>
                
                <Input 
                    name='txtContName'
                    label='Contract Name'
                    type='text'
                    value={contract.contName}
                    flgDisabled="disabled"
                    error={this.state.error}
                />
                <Input 
                    name='txtContCode'
                    label='Contract Code'
                    type='text'
                    value={contract.contCode}
                    flgDisabled="disabled"
                    error={this.state.error}
                />
                <Input 
                    name='txtContDesc'
                    label='Description'
                    type='text'
                    value={contract.Description}
                    flgDisabled="disabled"
                    error={this.state.error}
                />
                <Input 
                    name='txtContEmail'
                    label='Contact Email'
                    type='text'
                    value={contract.contactEmails}
                    flgDisabled="disabled"
                    error={this.state.error}
                />
                <Input 
                    name='txtContPerson'
                    label='Contact Person'
                    type='text'
                    value={contract.contactPerson}
                    flgDisabled="disabled"
                    error={this.state.error}
                />
                <Input 
                    name='txtEffectiveDate'
                    label='Effective Date'
                    type='text'
                    value={contract.effectDate}
                    flgDisabled="disabled"
                    error={this.state.error}
                />
                <Input 
                    name='txtExpiryDate'
                    label='Expiry Date'
                    type='text'
                    value={contract.expiryDate}
                    flgDisabled="disabled"
                    error={this.state.error}
                />
                
            </React.Fragment>

        );
    }
}

export default ContractForm;