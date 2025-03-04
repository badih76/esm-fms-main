import React, { Component } from 'react';
import Input, { DropDownList } from '../../common/input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonGroup, Button, ButtonToolbar } from 'react-bootstrap'
import processing from '../../images/processing.gif';
import { SlidingSwitch, ThinSwitch } from '../../common/slidingswitch';

import '../../css/usergroup.css';

class UserForm extends Component {
    state = {
        error: null,
        bottomTBVisible: "hidden",
        topTBVisible: "",
        flags: {
            isAdd: false,
            isEdit: false
        },
        confPassWord: '',
        confPwError: null
        
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
                    name='displayName'
                    label='User Name'
                    type='text'
                    value={user.displayName}
                    onChange={(event) => this.props.handlers.handleChange(event.currentTarget.value, "displayName")}
                    flgDisabled={(this.state.flags.isAdd || this.state.flags.isEdit) ? "" : "disabled"}
                    error={this.state.error}
                />

                <SlidingSwitch 
                    name='disabled'
                    label='Disabled'
                    value={user.disabled}
                    setState={this.props.handlers.handleDisable}
                    flgDisabled={(this.state.flags.isAdd || this.state.flags.isEdit) ? "" : "disabled"}
                    error={this.state.error}
                />

                <Input 
                    name='email'
                    label='User Email'
                    type='text'
                    value={user.email}
                    onChange={(event) => this.props.handlers.handleChange(event.currentTarget.value, "email")}
                    flgDisabled={(this.state.flags.isAdd || this.state.flags.isEdit) ? "" : "disabled"}
                    error={this.state.error}
                />

                <Input 
                    name='phoneNumber'
                    label='Phone Number'
                    type='text'
                    value={user.phoneNumber}
                    onChange={(event) => this.props.handlers.handleChange(event.currentTarget.value, "phoneNumber")}
                    flgDisabled={(this.state.flags.isAdd || this.state.flags.isEdit) ? "" : "disabled"}
                    error={this.state.error}
                />
                
                {/* name, label, values, onChange, flgDisabled, error, defValue */}
                <DropDownList
                    name='UserGroup'
                    label='User Group'
                    values={this.props.userGroups}
                    onChange={(event) => this.props.handlers.handleUGChange(event.currentTarget.value, "UserGroup")}
                    flgDisabled={(this.state.flags.isAdd || this.state.flags.isEdit) ? "" : "disabled"}
                    defValue={this.props.user.UserGroup}
                    error={this.state.error}
                />

                <Input 
                    name='password'
                    label='Password'
                    type='password'
                    value={user.password}
                    onChange={(event) => this.props.handlers.handleChange(event.currentTarget.value, "password")}
                    flgDisabled={(this.state.flags.isAdd || this.state.flags.isEdit) ? "" : "disabled"}
                    error={this.state.error}
                />

                <Input 
                    name='confPassWord'
                    label='Confirm Password'
                    type='password'
                    value={this.state.confPassWord}
                    onChange={this.handlePasswordConfirm}
                    flgDisabled={(this.state.flags.isAdd || this.state.flags.isEdit) ? "" : "disabled"}
                    error={this.state.confPwError}
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

export default UserForm;