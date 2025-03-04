import React, { Component } from 'react';
import Input from '../../common/input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonGroup, Button, ButtonToolbar } from 'react-bootstrap'
import processing from '../../images/processing.gif';

class ClientForm extends Component {
    state = {
        error: '',
        bottomTBVisible: "hidden",
        topTBVisible: "",
        flags: {
            isAdd: false,
            isEdit: false
        }

    }

    render() {
        const { client } = this.props;

        return (
            <React.Fragment>
                <div className={this.props.showFormProcess}>
                    <img src={processing} 
                        width="60vw" 
                        alt="processing"  
                        style={{marginTop: "5vh"}} />
                </div>
                
                <Input 
                    name='txtCltName'
                    label='Client Name'
                    type='text'
                    value={client.clName}
                    flgDisabled={(this.state.flags.isAdd || this.state.flags.isEdit) ? "" : "disabled"}
                    error={this.state.error}
                />
                <Input 
                    name='txtCltEmail'
                    label='Client Email'
                    type='text'
                    value={client.clEmail}
                    flgDisabled={(this.state.flags.isAdd || this.state.flags.isEdit) ? "" : "disabled"}
                    error={this.state.error}
                />
                <Input 
                    name='txtCPName'
                    label='Contact Person'
                    type='text'
                    value={client.clContactName}
                    flgDisabled={(this.state.flags.isAdd || this.state.flags.isEdit) ? "" : "disabled"}
                    error={this.state.error}
                />
                <Input 
                    name='txtCPNumber'
                    label='Contact Number(s)'
                    type='text'
                    value={client.clContactNumber}
                    flgDisabled={(this.state.flags.isAdd || this.state.flags.isEdit) ? "" : "disabled"}
                    error={this.state.error}
                />
                <Input 
                    name='txtAddress'
                    label='Address'
                    type='text'
                    value={client.clAddress}
                    flgDisabled={(this.state.flags.isAdd || this.state.flags.isEdit) ? "" : "disabled"}
                    error={this.state.error}
                />
                
                <div className={this.state.bottomTBVisible}>
                    <ButtonToolbar>
                        <ButtonGroup justified>
                            <ButtonGroup>
                                <Button bsStyle="success" onClick={this.handleOnSave}>
                                    <FontAwesomeIcon icon='save' />
                                </Button>
                            </ButtonGroup>
                            <ButtonGroup>
                                <Button bsStyle="danger" onClick={this.handleOnCancel}>
                                    <FontAwesomeIcon icon='ban' />
                                </Button>
                            </ButtonGroup>
                        </ButtonGroup>
                    </ButtonToolbar>
                </div>
            </React.Fragment>

        );
    }
}

export default ClientForm;