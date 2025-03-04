import React, { Component } from 'react';
import Input, { CheckBox } from '../../common/input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonGroup, Button, ButtonToolbar } from 'react-bootstrap'
import processing from '../../images/processing.gif';
import { SlidingSwitch, ThinSwitch } from '../../common/slidingswitch';

import '../../css/usergroup.css';

class UserGroupForm extends Component {
    state = {
        error: '',
        bottomTBVisible: "hidden",
        topTBVisible: "",
        flags: {
            isAdd: false,
            isEdit: false
        },
        
        Privileges: {
            Superuser: false,
            Dashboard: false,
            Masters: false,
            MastHDD: false,
            MastInvD: false,
            MastUAdmin: false,
            MastSProf: false,
            Assets: false,
            AssetsClients: false,
            AssetsContracts: false,
            Financials: false,
            FinClientSOA: false,
            Maintenance: false,
            MaintenanceJP: false,
            MaintenanceJC: false,
            CustCare: false,
            CustCareTkt: false,
            Reports: false
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
        const { userGroup } = this.props;

        console.log("Form: ", userGroup);
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
                    name='Name'
                    label='Group Name'
                    type='text'
                    value={this.props.userGroup.Name}
                    onChange={(event) => this.props.handlers.handleInputChange(event.currentTarget.value, "Name")}
                    flgDisabled={(this.state.flags.isAdd || this.state.flags.isEdit) ? "" : "disabled"}
                    error={this.state.error}
                />

                <SlidingSwitch 
                    name='Superuser'
                    label='Superuser'
                    value={this.props.userGroup.Privileges.Superuser}
                    setState={this.props.handlers.handleOnChange}
                    flgDisabled={(this.state.flags.isAdd || this.state.flags.isEdit) ? "" : "disabled"}
                    error={this.state.error}
                />
                
                <SlidingSwitch 
                    name='Dashboard'
                    label='Dashboard'
                    value={this.props.userGroup.Privileges.Dashboard}
                    setState={this.props.handlers.handleOnChange}
                    flgDisabled={(this.state.flags.isAdd || this.state.flags.isEdit) ? "" : "disabled"}
                    error={this.state.error}
                />

                <SlidingSwitch 
                    name='Masters'
                    label='Masters'
                    value={this.props.userGroup.Privileges.Masters}
                    setState={this.props.handlers.handleOnChange}
                    flgDisabled={(this.state.flags.isAdd || this.state.flags.isEdit) ? "" : "disabled"}
                    error={this.state.error}
                />

                <ThinSwitch 
                    name='MastHDD'
                    label='Customer Care Master'
                    value={this.props.userGroup.Privileges.MastHDD}
                    setState={this.props.handlers.handleOnChange}
                    flgDisabled={(this.state.flags.isAdd || this.state.flags.isEdit) ? "" : "disabled"}
                    error={this.state.error}
                />
                
                <ThinSwitch 
                    name='MastInvD'
                    label='Inventory Master'
                    value={this.props.userGroup.Privileges.MastInvD}
                    setState={this.props.handlers.handleOnChange}
                    flgDisabled={(this.state.flags.isAdd || this.state.flags.isEdit) ? "" : "disabled"}
                    error={this.state.error}
                />

                <ThinSwitch 
                    name='MastUAdmin'
                    label='Users Administration'
                    value={this.props.userGroup.Privileges.MastUAdmin}
                    setState={this.props.handlers.handleOnChange}
                    flgDisabled={(this.state.flags.isAdd || this.state.flags.isEdit) ? "" : "disabled"}
                    error={this.state.error}
                />

                <ThinSwitch 
                    name='MastSProf'
                    label='Services Definitions'
                    value={this.props.userGroup.Privileges.MastSProf}
                    setState={this.props.handlers.handleOnChange}
                    flgDisabled={(this.state.flags.isAdd || this.state.flags.isEdit) ? "" : "disabled"}
                    error={this.state.error}
                />

                <SlidingSwitch 
                    name='Assets'
                    label='Assets'
                    value={this.props.userGroup.Privileges.Assets}
                    setState={this.props.handlers.handleOnChange}
                    flgDisabled={(this.state.flags.isAdd || this.state.flags.isEdit) ? "" : "disabled"}
                    error={this.state.error}
                />
                
                <ThinSwitch 
                    name='AssetsClients'
                    label='Clients & Assets'
                    value={this.props.userGroup.Privileges.AssetsClients}
                    setState={this.props.handlers.handleOnChange}
                    flgDisabled={(this.state.flags.isAdd || this.state.flags.isEdit) ? "" : "disabled"}
                    error={this.state.error}
                />
                
                <ThinSwitch 
                    name='AssetsContracts'
                    label='Contract Definition'
                    value={this.props.userGroup.Privileges.AssetsContracts}
                    setState={this.props.handlers.handleOnChange}
                    flgDisabled={(this.state.flags.isAdd || this.state.flags.isEdit) ? "" : "disabled"}
                    error={this.state.error}
                />

                <SlidingSwitch 
                    name='Financials'
                    label='Financials'
                    value={this.props.userGroup.Privileges.Financials}
                    setState={this.props.handlers.handleOnChange}
                    flgDisabled={(this.state.flags.isAdd || this.state.flags.isEdit) ? "" : "disabled"}
                    error={this.state.error}
                />
                
                <ThinSwitch 
                    name='FinClientSOA'
                    label='Clients SOA'
                    value={this.props.userGroup.Privileges.FinClientSOA}
                    setState={this.props.handlers.handleOnChange}
                    flgDisabled={(this.state.flags.isAdd || this.state.flags.isEdit) ? "" : "disabled"}
                    error={this.state.error}
                />

                <SlidingSwitch 
                    name='Maintenance'
                    label='Maintenance'
                    value={this.props.userGroup.Privileges.Maintenance}
                    setState={this.props.handlers.handleOnChange}
                    flgDisabled={(this.state.flags.isAdd || this.state.flags.isEdit) ? "" : "disabled"}
                    error={this.state.error}
                />
                
                <ThinSwitch 
                    name='MaintenanceJC'
                    label='Job Cards'
                    value={this.props.userGroup.Privileges.MaintenanceJC}
                    setState={this.props.handlers.handleOnChange}
                    flgDisabled={(this.state.flags.isAdd || this.state.flags.isEdit) ? "" : "disabled"}
                    error={this.state.error}
                />
                
                <ThinSwitch 
                    name='MaintenanceJP'
                    label='Job Planner'
                    value={this.props.userGroup.Privileges.MaintenanceJP}
                    setState={this.props.handlers.handleOnChange}
                    flgDisabled={(this.state.flags.isAdd || this.state.flags.isEdit) ? "" : "disabled"}
                    error={this.state.error}
                />

                <SlidingSwitch 
                    name='CustCare'
                    label='Customer Care'
                    value={this.props.userGroup.Privileges.CustCare}
                    setState={this.props.handlers.handleOnChange}
                    flgDisabled={(this.state.flags.isAdd || this.state.flags.isEdit) ? "" : "disabled"}
                    error={this.state.error}
                />
                
                <ThinSwitch 
                    name='CustCareTkt'
                    label='Tickets'
                    value={this.props.userGroup.Privileges.CustCareTkt}
                    setState={this.props.handlers.handleOnChange}
                    flgDisabled={(this.state.flags.isAdd || this.state.flags.isEdit) ? "" : "disabled"}
                    error={this.state.error}
                />
                
                <SlidingSwitch 
                    name='Reports'
                    label='Reports'
                    value={this.props.userGroup.Privileges.Reports}
                    setState={this.props.handlers.handleOnChange}
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

export default UserGroupForm;