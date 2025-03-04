import React, { Component } from 'react';
import Input, { TextArea } from '../../common/input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonGroup, Button, ButtonToolbar } from 'react-bootstrap';
import processing from '../../images/processing.gif';
import ContMeterReadings from './contractmeterreading';
import PopupWindow from '../../common/popupwindow';
import Chart from "react-google-charts";

class ReadingsForm extends Component {
    state = {
        error: '',
        bottomTBVisible: "hidden",
        topTBVisible: "",
        flags: {
            isAdd: false,
            isEdit: false
        }
    }

    

    getMeterReading = (prj, ctr, mnum) => {

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
        const { meterReading } = this.props;

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
                    name='dtReadingDate'
                    label='Reading Date'
                    type='date'
                    value={meterReading.readingDate}
                    onChange={this.props.handlers.handleReadingDateChange}
                    flgDisabled={(this.state.flags.isAdd || this.state.flags.isEdit) ? "" : "disabled"}
                    error={this.state.error}
                />
                <Input 
                    name='txtReadingValue'
                    label='Reading Value'
                    type='text'
                    value={meterReading.readingValue}
                    onChange={this.props.handlers.handleReadingValueChange}
                    flgDisabled={(this.state.flags.isAdd || this.state.flags.isEdit) ? "" : "disabled"}
                    error={this.state.error}
                />

                <Input 
                    name='txtConsumption'
                    label='Consumption'
                    type='number'
                    value={meterReading.consumption}
                    flgDisabled="disabled"
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

export default ReadingsForm;