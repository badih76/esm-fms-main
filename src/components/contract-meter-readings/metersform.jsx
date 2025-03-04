import React, { Component } from 'react';
import Input, { DropDownList } from '../../common/input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonGroup, Button, ButtonToolbar } from 'react-bootstrap'
import PopupWindow from '../../common/popupwindow';
import Chart from "react-google-charts";
import processing from '../../images/processing.gif';

import { getMeterReadingList } from '../../appcode/invclientassets';


class MetersForm extends Component {
    state = {
        error: '',
        bottomTBVisible: "hidden",
        topTBVisible: "",
        flags: {
            isAdd: false,
            isEdit: false
        },
        columns: [
            { type: "date", id: "readingDate" },
            { type: "number", id: "readingValue"}
        ],
        
        rows: [],
        meterReadings: []
    }

    handleOnPopup = () => {

        return new Promise((resolve, reject) => {
            const { projectName, contractName, meterNumber } = this.props;
    
            let meterReadings = [];
            let rows = [["Date", "Value"]];

            getMeterReadingList('', projectName, contractName, meterNumber)
                .then(result => {
                    meterReadings = result.Result;            
                    // let columns = [];
                    
                    if(meterReadings.length !== 0)
                    {
                        meterReadings.map(r => {
                            rows.push([r.readingDate, r.readingValue]);
                        });
                    }
                    else
                    {
                        rows.push([new Date(), 0]);
                    }

                    this.setState({ rows, meterReadings });
                    resolve(rows);
    
                })
                .catch(error => {
                    console.log(error);
                    reject(error);
                });
        
        });

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

    componentDidMount = () => {
        // console.log('componentDidMount Start');
        // this.handleOnPopup();
        // console.log('componentDidMount End');
    }

    render() {
        const { meter } = this.props;

        return (
            <React.Fragment>
                <div className="col-md-10">
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
                </div>
                <div className="col-md-2">
                <PopupWindow showbutton={<FontAwesomeIcon icon='chart-line' />} 
                        onClickPopup={this.handleOnPopup}>
                        <p className='h4' style={{color: "blue", fontWeight: 'bold'}}>Meter Readings for {this.props.meterNumber}</p>
                        {/* <DataChart passedData={this.state.rows} key={this.state.rows}/> */}
                        <Chart
                            chartType="LineChart"
                            data={this.state.rows}
                            width="100%"
                            height="90%"
                            loader={<div>Loading Chart</div>}
                            options={{
                                title: '',
                                vAxis: {
                                    title: 'Meter Reating',
                                },
                                hAxis: {
                                    title: 'Reading Date',
                                },    
                                is3D: true,
                                legend: 'none',
                                }} 
                            />
                    </PopupWindow>
                </div>
                <div className={this.props.showFormProcess}>
                    <img src={processing} 
                        width="60vw" 
                        alt="processing"  
                        style={{marginTop: "5vh"}} />
                </div>
                
                <Input 
                    name='txtMeterNumber'
                    label='Meter Number'
                    type='text'
                    value={meter.Number}
                    onChange={this.props.handlers.handleMeterNumberChange}
                    flgDisabled={(this.state.flags.isAdd || this.state.flags.isEdit) ? "" : "disabled"}
                    error={this.state.error}
                />
                <DropDownList 
                    name="ddlMeterTypes"
                    label="Meter Type"
                    values={[{Name: ""}, {Name: "Water"}, {Name: "Electricity"}]}
                    onChange={this.props.handlers.handleMeterTypeChange}
                    flgDisabled={(this.state.flags.isAdd || this.state.flags.isEdit) ? "" : "disabled"}
                    error={this.state.error}
                    defValue={meter.Type}
                />
                <Input 
                    name='txtMeterLocation'
                    label='Location'
                    type='text'
                    value={meter.Location}
                    onChange={this.props.handlers.handleMeterLocationChange}
                    flgDisabled={(this.state.flags.isAdd || this.state.flags.isEdit) ? "" : "disabled"}
                    error={this.state.error}
                />
                <Input 
                    name='txtMeterRemarks'
                    label='Remarks'
                    type='text'
                    value={meter.Remarks}
                    onChange={this.props.handlers.handleMeterRemarksChange}
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
};

class DataChart extends Component {
    render () {
        const { passedData } = this.props;

        return (
            <Chart
                chartType="LineChart"
                data={passedData}
                width="100%"
                height="100%"
                loader={<div>Loading Chart</div>}
                options={{
                    title: '',
                    vAxis: {
                        title: 'Value',
                    },
                    hAxis: {
                        title: 'Date',
                    },    
                    is3D: true,
                    legend: 'none',
                    }} 
                />
        );
    }
}

export default MetersForm;