import React, {Component} from 'react';
import Input, { DropDownList, TextArea } from '../../common/input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// import '../../css/mastcc-inqcat.css';
import processing from '../../images/processing.gif';
import { getContractsForProject } from '../../appcode/mainjobcards';



class MainJCForm extends Component {
    state = {
        fields: {
            jcNumber: '',
            jcDate: '',
            jcDetails: '',
            jcMonth: 0,
            jcYear: 0,
            jcTime: '',
            jcTicketNum: '',
            jcStatus: 'Pending',
            jcPrjName: '',
            jcContName: ''
        },
        timeValues: [
            "00:00",
            "00:30",
            "01:00",
            "01:30",
            "02:00",
            "02:30",
            "03:00",
            "03:30",
            "04:00",
            "04:30",
            "05:00",
            "05:30",
            "06:00",
            "06:30",
            "07:00",
            "07:30",
            "08:00",
            "08:30",
            "09:00",
            "09:30",
            "10:00",
            "10:30",
            "11:00",
            "11:30",
            "12:00",
            "12:30",
            "13:00",
            "13:30",
            "14:00",
            "14:30",
            "15:00",
            "15:30",
            "16:00",
            "16:30",
            "17:00",
            "17:30",
            "18:00",
            "18:30",
            "19:00",
            "19:30",
            "20:00",
            "20:30",
            "21:00",
            "21:30",
            "22:00",
            "22:30",
            "23:00",
            "23:30"
        ],
        time: [],
        contracts: [],
        status: [{ Name: 'Pending' }, 
            { Name: 'Completed' }]
        
    };

    componentDidMount() {
        let time = [...this.state.time];
        this.state.timeValues.map(t => {
            time.push({Name: t});
        });
        this.setState({ time });

    }

    handleOnProjectChange = (e) => {
        const { value } = e.currentTarget;
        if(value === '') 
        {
            this.setState({ contracts: [] });
            return;
        }

        getContractsForProject(e.currentTarget.value)
            .then(result => {
                let contracts = [];
                result.Result.map(r => {
                    contracts.push({Name: r.name});
                });
                console.log(contracts);
                this.setState({ contracts });
            })
        this.props.onChange(e);
    }

    render() {
        const { onChange, onSubmit, onCancel, data, flags, errors, showProcess, showButtons } = this.props;

        return (
            <React.Fragment>
                <form style={{marginTop: "10px"}} >
                    <div className="row">
                        <div className="col-md-6">
                            <Input 
                                name="jcNumber" 
                                label="JC Number:" 
                                type="text" 
                                onChange={onChange} 
                                value={data.jcNumber}
                                flgDisabled={true}
                                error={errors.jcNumber ? errors.jcNumber : ""} 
                                />
                        </div>
                        <div className="col-md-6">
                            <DropDownList
                                name="jcStatus" 
                                label="JC Status:" 
                                type="text" 
                                onChange={onChange} 
                                values={this.state.status}
                                flgDisabled={flags.isAdd || flags.isEdit ? "" : "disabled"}
                                error={errors.jcStatus ? errors.jcStatus : ""} 
                                defValue={data.jcStatus}
                                />
                        </div>
                    </div>
                    
                    <div className="row">
                        <div className="col-md-6">
                            <Input 
                                name="jcDate" 
                                label="JC Date:" 
                                type="date" 
                                onChange={onChange} 
                                value={data.jcDate}
                                flgDisabled={flags.isAdd || flags.isEdit ? "" : "disabled"}
                                error={errors.jcDate ? errors.jcDate : ""} 
                                />
                        </div>
                        <div className="col-md-6">
                            <DropDownList 
                                name="jcTime" 
                                label="JC Time:"  
                                onChange={onChange} 
                                values={this.state.time}
                                flgDisabled={flags.isAdd || flags.isEdit ? "" : "disabled"}
                                error={errors.jcTime ? errors.jcTime : ""} 
                                defValue={data.jcTime}
                                />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <DropDownList 
                                name="jcPrjName"
                                label="Project Name"
                                values={this.props.projects}
                                defValue={data.jcPrjName}
                                onChange={this.handleOnProjectChange}
                                flgDisabled={flags.isAdd || flags.isEdit ? "" : "disabled"}
                                error={errors.jcPrjName ? errors.jcPrjName : ""} 
                            />
                        </div>
                        <div className="col-md-6">
                            <DropDownList 
                                name="jcContName"
                                label="Contract Name"
                                values={this.state.contracts}
                                defValue={data.jcContName}
                                onChange={onChange}
                                flgDisabled={flags.isAdd || flags.isEdit ? "" : "disabled"}
                                error={errors.jcContName ? errors.jcContName : ""} 
                            />
                        </div>
                    </div>

                    <DropDownList 
                        name="jcTicketNum"
                        label="Related Ticket #:"
                        values={this.props.tickets}
                        defValue={data.jcTicketNum}
                        onChange={onChange}
                        flgDisabled={flags.isAdd || flags.isEdit ? "" : "disabled"}
                        error={errors.jcTicketNum ? errors.jcTicketNum : ""} 
                    />

                    {/* <Input 
                        name="jcTicketNum" 
                        label="Related Ticket #:" 
                        type="text" 
                        onChange={onChange} 
                        value={data.jcTicketNum}
                        flgDisabled={flags.isAdd || flags.isEdit ? "" : "disabled"}
                        error={errors.jcTicketNum ? errors.jcTicketNum : ""} 
                        /> */}

                    <TextArea 
                        name="jcDetails" 
                        label="JC Details:" 
                        rows="10" 
                        onChange={onChange} 
                        value={data.jcDetails}
                        flgDisabled={flags.isAdd || flags.isEdit ? "" : "disabled"}
                        error={errors.jcDetails ? errors.jcDetails : ""} 
                        />


                    <img src={processing} 
                        width="60vw" 
                        alt="processing" 
                        className={showProcess ? "" : "hidden"} 
                        style={{marginTop: "2vh"}} />

                    <div className={"btn-toolbar btnToobar" + ((flags.isAdd || flags.isEdit) && showButtons ? "" : " hidden")} >
                        <div className="btn-group btn-group-justified">
                            <button type="button"
                                className="btn btn-primary" 
                                style={{width: "50%"}}
                                onClick={() => onSubmit()} >
                                <FontAwesomeIcon icon="save" />
                            </button>
                            <button type="button" 
                                className="btn btn-danger" 
                                style={{width: "50%"}}
                                onClick={() => onCancel()}>
                                <FontAwesomeIcon icon="ban" />
                            </button>
                            
                        </div>
                    </div>
                </form>
            </React.Fragment>
        )
    }
};

export default MainJCForm;