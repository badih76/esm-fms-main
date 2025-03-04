import React, { Component } from 'react';
import Input, { DropDownList } from '../../common/input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonGroup, Button, ButtonToolbar } from 'react-bootstrap'
import processing from '../../images/processing.gif';
import { SlidingSwitch, ThinSwitch } from '../../common/slidingswitch';

import '../../css/usergroup.css';

class ClientUserForm extends Component {
    state = {
        error: null,
        bottomTBVisible: "hidden",
        topTBVisible: "",
        flags: {
            isAdd: false,
            isEdit: false
        },
        confPassWord: '',
        confPwError: null,

        clients: [],
        projects: [],
        contracts: []
    }

    handlePasswordConfirm = (event) => {
        let confPassWord = event.currentTarget.value;
        this.setState({ confPassWord });

        if(confPassWord !== this.props.user.password)
        {
            let confPwError = "Password and Confirmed Password do not match!";
            this.setState({ confPwError });
        }
        else 
        {
            let confPwError = null;
            this.setState({ confPwError });
        }
    }

    handleOnAdd = () => {
        this.props.handlers.handleOnAdd();
        
        // hide the top Add and Cance buttons 
        // and show the bottom Save and Cancel buttons
        this.setState({ bottomTBVisible: "", topTBVisible: "hidden" });

        // Set the isAdd flag to true to enable the fields...
        let flags = {...this.state.flags};
        flags.isAdd = true;
        flags.isEdit = false;
        this.setState({ flags });

    }

    handleOnEdit = () => {
        // hide the top Add and Cance buttons 
        // and show the bottom Save and Cancel buttons
        this.setState({ bottomTBVisible: "", topTBVisible: "hidden" });

        // Set the isAdd flag to true to enable the fields...
        let flags = {...this.state.flags};
        flags.isAdd = false;
        flags.isEdit = true;
        this.setState({ flags });

    }

    handleOnSave = () => {
        let flags = {...this.state.flags};

        let result = this.props.handlers.handleOnSave(flags);
        console.log(result);

        // hide the top Add and Cance buttons 
        // and show the bottom Save and Cancel buttons
        this.setState({ bottomTBVisible: "hidden", topTBVisible: "" });

        // Set the all flags to false to disable the fields...
        flags.isAdd = false;
        flags.isEdit = false;
        this.setState({ flags });

    }

    handleOnCancel = () => {
        this.props.handlers.handleOnCancel();
        
        // hide the top Add and Cance buttons 
        // and show the bottom Save and Cancel buttons
        this.setState({ bottomTBVisible: "hidden", topTBVisible: "" });

        // Set the all flags to false to disable the fields...
        let flags = {...this.state.flags};
        flags.isAdd = false;
        flags.isEdit = false;
        this.setState({ flags });
        
    }

    render() {
        const { user } = this.props;

        console.log("Form: ", user);
        return (
            <React.Fragment>
                <div className={this.state.topTBVisible}>
                    <ButtonToolbar>
                        <ButtonGroup justified>
                            <ButtonGroup>
                                <Button bsStyle="primary" onClick={this.handleOnAdd}>
                                    <FontAwesomeIcon icon='plus' />
                                </Button>
                            </ButtonGroup>
                            <ButtonGroup>
                                <Button bsStyle="primary" onClick={this.handleOnEdit}>
                                    <FontAwesomeIcon icon='edit' />
                                </Button>
                            </ButtonGroup>
                        </ButtonGroup>
                    </ButtonToolbar>
                </div>
                <div className={this.props.showFormProcess}>
                    <img src={processing} 
                        width="60vw" 
                        alt="processing"  
                        style={{marginTop: "5vh"}} />
                </div>
                
                <Input 
                    name='userEmail'
                    label='User Email'
                    type='text'
                    value={user.userEmail}
                    onChange={(event) => this.props.handlers.handleChange(event.currentTarget.value, "userEmail")}
                    flgDisabled={(this.state.flags.isAdd || this.state.flags.isEdit) ? "" : "disabled"}
                    error={this.state.error}
                />

                <Input 
                    name='passWord'
                    label='Password'
                    type='text'
                    value={user.passWord}
                    onChange={(event) => this.props.handlers.handleChange(event.currentTarget.value, "passWord")}
                    flgDisabled={(this.state.flags.isAdd || this.state.flags.isEdit) ? "" : "disabled"}
                    error={this.state.error}
                />

                <DropDownList
                    name='clientName'
                    label='Client Name'
                    values={this.props.clients}
                    onChange={(event) => this.props.handlers.handleClientChange(event.currentTarget.value, "clientName")}
                    flgDisabled={(this.state.flags.isAdd || this.state.flags.isEdit) ? "" : ""}
                    defValue={this.props.user.clientName}
                    error={this.state.error}
                />

                <DropDownList
                    name='projectName'
                    label='Project Name'
                    values={this.props.projects}
                    onChange={(event) => this.props.handlers.handleProjectChange(event.currentTarget.value, "projectName")}
                    flgDisabled={(this.state.flags.isAdd || this.state.flags.isEdit) ? "" : ""}
                    defValue={this.props.user.projectName}
                    error={this.state.error}
                />

                <DropDownList
                    name='contractName'
                    label='Contract Name'
                    values={this.props.contracts}
                    onChange={(event) => this.props.handlers.handleContractChange(event.currentTarget.value, "contractName")}
                    flgDisabled={(this.state.flags.isAdd || this.state.flags.isEdit) ? "" : ""}
                    defValue={this.props.user.contractName}
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

export default ClientUserForm;