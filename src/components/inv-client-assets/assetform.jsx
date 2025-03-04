import React, { Component } from 'react';
import Input from '../../common/input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonGroup, Button, ButtonToolbar } from 'react-bootstrap'
import processing from '../../images/processing.gif';
import PopupList from '../../common/popuplist';

class AssetForm extends Component {
    state = {
        error: '',
        bottomTBVisible: "hidden",
        topTBVisible: "",
        flags: {
            isAdd: false,
            isEdit: false
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

    handleOnSave = async () => {
        let flags = {...this.state.flags};

        let result = await this.props.handlers.handleOnSave(flags);
        console.log("Saving Asset", result);

        if(result.Success === 'Ok')
        {
            // hide the top Add and Cance buttons 
            // and show the bottom Save and Cancel buttons
            this.setState({ bottomTBVisible: "hidden", topTBVisible: "" });
    
            // Set the all flags to false to disable the fields...
            flags.isAdd = false;
            flags.isEdit = false;
            this.setState({ flags });
        }

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
        const { asset } = this.props;

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
                    name='txtAsstTitle'
                    label='Asset Title'
                    type='text'
                    value={asset.Title}
                    onChange={this.props.handlers.handleAssetTitleChange}
                    flgDisabled={(this.state.flags.isAdd || this.state.flags.isEdit) ? "" : "disabled"}
                    error={this.state.error}
                />
                <Input 
                    name='chkPool'
                    label='Is a Pool?'
                    type='checkbox'
                    value={asset.pool}
                    onChange={this.props.handlers.handleAssetPoolChange}
                    flgDisabled={(this.state.flags.isAdd || this.state.flags.isEdit) ? "" : "disabled"}
                    error={this.state.error}
                />
                <Input 
                    name='chkAssetEquip'
                    label='Is an Asset Equipment?'
                    type='checkbox'
                    value={asset.assetEquip}
                    onChange={this.props.handlers.handleAssetAssetEquipChange}
                    flgDisabled={(this.state.flags.isAdd || this.state.flags.isEdit) ? "" : "disabled"}
                    error={this.state.error}
                />
                <Input 
                    name='txtAsstLocation'
                    label='Location'
                    type='text'
                    value={asset.Location}
                    onChange={this.props.handlers.handleAssetLocationChange}
                    flgDisabled={(this.state.flags.isAdd || this.state.flags.isEdit) ? "" : "disabled"}
                    error={this.state.error}
                />
                <PopupList name="Locations" 
                    data={this.props.locations} 
                    handleSelection={this.props.handlers.handleAssetLocationSelect}
                    flgDisabled={(this.state.flags.isAdd || this.state.flags.isEdit) ? "" : "disabled"} />
                <Input 
                    name='txtAsstDetails'
                    label='Details'
                    type='text'
                    value={asset.Description}
                    onChange={this.props.handlers.handleAssetDescriptionChange}
                    flgDisabled={(this.state.flags.isAdd || this.state.flags.isEdit) ? "" : "disabled"}
                    error={this.state.error}
                />
                <Input 
                    name='txtAsstCount'
                    label='Count'
                    type='number'
                    value={asset.Count}
                    onChange={this.props.handlers.handleAssetCountChange}
                    flgDisabled={(this.state.flags.isAdd || this.state.flags.isEdit) ? "" : "disabled"}
                    error={this.state.error}
                />
                <Input 
                    name='txtAsstSerialNo'
                    label='Serial Number'
                    type='text'
                    value={asset.serialNo ? asset.serialNo : ''}
                    onChange={this.props.handlers.handleAssetSNoChange}
                    flgDisabled={(this.state.flags.isAdd || this.state.flags.isEdit) ? "" : "disabled"}
                    error={this.state.error}
                />
                <Input 
                    name='txtAsstRemarks'
                    label='Remarks'
                    type='text'
                    value={asset.Remarks}
                    onChange={this.props.handlers.handleAssetRemarksChange}
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

export default AssetForm;