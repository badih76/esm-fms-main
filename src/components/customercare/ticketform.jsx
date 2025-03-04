import React, { Component, useState, useEffect } from 'react';
import Input, { DropDownList, TextArea, TextAreaEnh } from '../../common/input';
import { getJobCardListOfProject, getJobCardDoc } from '../../appcode/mainjobcards';

class TicketForm extends Component {
    state = {
        status: [
            {Name: "Open"},
            {Name: "In Progress"},
            {Name: "Closed"}
        ]

    }


    render() {
        const {  AttendedBy, ClientName, ClosedBy, 
                ClosingDT, ComplCat, ContractName, 
                Details, Duration, FileAttach, OpeningDT, 
                ProjectName, ReportedBy, ReportedOn, Subject, 
                TicketStatus, tsOpeningDT, TicketNum 
            } = this.props.ticket;

        const { clientsList, projectsList, 
                contractsList, compleCatList, 
                flags, openedBy } = this.props;

      return (
        <React.Fragment>
            <div className="row">
                <div className="col-md-12" style={{padding: "0"}}>
                    <div className="col-md-4">
                        <Input name="TicketNumber" 
                            label="Ticket Number" 
                            value={TicketNum}
                            flgDisabled={true}
                        />
                    </div>
                    <div className="col-md-4">
                        <Input name="OpeningDT" 
                            label="Opening Date" 
                            value={OpeningDT}
                            flgDisabled={true}
                        />
                    </div>
                    <div className="col-md-4">
                        <DropDownList name="TicketStatus" 
                            label="Ticket Status" 
                            values={this.state.status}
                            defValue={TicketStatus}
                            flgDisabled={!flags.isAdd && !flags.isEdit}
                        />
                    </div>
                </div>
                <div className="col-md-12">
                    <DropDownList name="ClientName"
                        label="Client Name"
                        flgDisabled={false}
                        values={clientsList}
                        onChange={this.props.onClientChange}
                        defValue={ClientName}
                        // flgDisabled={!flags.isAdd && !flags.isEdit}
                    />
                </div>
                <div className="col-md-12">
                    <DropDownList name="ProjectName"
                        label="Project Name"
                        flgDisabled={false}
                        values={projectsList}
                        onChange={this.props.onProjectChange}
                        defValue={ProjectName}
                        // flgDisabled={!flags.isAdd && !flags.isEdit}
                    />
                </div>
                <div className="col-md-12">
                    <DropDownList name="ContractName"
                        label="Contract Name"
                        flgDisabled={false}
                        values={contractsList}
                        onChange={this.props.onChange}
                        defValue={ContractName}
                        // flgDisabled={!flags.isAdd && !flags.isEdit}
                    />
                </div>
                <div className="col-md-12">
                    <DropDownList 
                        name="ComplCat"
                        label="Subject Category"
                        flgDisabled={false}
                        defValue={ComplCat}
                        values={compleCatList}
                        onChange={this.props.onChange}
                        // flgDisabled={!flags.isAdd && !flags.isEdit}
                    />
                </div>
                <div className="col-md-12">
                    <Input name="Subject" label="Subject"
                        value={Subject} 
                        onChange={this.props.onChange}
                        flgDisabled={!flags.isAdd && !flags.isEdit} />
                </div>
                <div className="col-md-12">
                    <TextArea name="Details" label="Details" rows="5"
                        value={Details} 
                        onChange={this.props.onChange}
                        flgDisabled={!flags.isAdd && !flags.isEdit} />
                </div>
                <div className="col-md-12">
                    <Input name="userName" label="Opened By" rows="5"
                        value={openedBy} 
                        flgDisabled={true} />
                </div>
            </div>
        </React.Fragment>
      );
   }
}

export const ReplyForm = (props) => {
    const { Details, FileAttachement, RepliedBy, tsReplyDT } = props.reply;
    const { ProjectName } = props.ticket;
    const { onChange, onFileSelect } = props;
    const [ jcListVisible, setjcListVisible ] = useState(false);
    const [ jcList, setjcList ] = useState([]);

    useEffect(() => {
        getJobCardListOfProject(ProjectName)
        .then(returnedResult => {
            setjcList([...returnedResult.Result]);
        });
    }, []);

    const handleOnClick = (jcNum) => {
        getJobCardDoc(jcNum)
            .then(returnedResult => {
                const { jcDate, jcTime, jcDetails, jcStatus,  } = returnedResult.Result;
                let newText = `<b>Job Card Details:</b><br /><b>JC Number:</b> ${jcNum}<br /><b>JC Date/Time:</b> ${jcDate} ${jcTime}<br /><b>Details:</b><br />${jcDetails}<br /><b>JC Status:</b> ${jcStatus}`;

                onChange("Details", newText);
                setjcListVisible(false);

            })
    }

    const handleCloseList = () => {
        setjcListVisible(false);
    }

    const onReplyChange = (event) => {
        const { name, value } = event.currentTarget;

        let words = value.split(' ');
        let lastWord = words[words.length - 1];
        let newText = value;

        if(lastWord == '#')
        {
            newText = value; //String.fromCodePoint(Ux1F501);
            setjcListVisible(true);
        }

        onChange(name, newText);
    }

    const onReplyChangeCED = (name, value) => {
        // const { name, value } = event.currentTarget;

        // let words = value.split(' ');
        // let lastWord = words[words.length - 1];
        let newText = value;

        // if(lastWord == '#')
        // {
        //     newText = value; //String.fromCodePoint(Ux1F501);
        //     setjcListVisible(true);
        // }

        onChange("Details", newText);
    }

    const onInputCED = (value) => {
        // const { name, value } = event.currentTarget;

        let words = value.split(' ');
        let lastWord = words[words.length - 1];
        let newText = value;

        if(lastWord == '#')
        {
            newText = value; //String.fromCodePoint(Ux1F501);
            setjcListVisible(true);
        }

        // onChange("Details", newText);
    }

    return (
        <React.Fragment>
            <div className="row" style={{paddingLeft: "0.75vw", paddingRight: "0.75vw"}}>
                <div className="col-md-12">
                    <Input name="tsReplyDT" 
                        label="Reply Timestamp"
                        value={tsReplyDT}
                        flgDisabled={true}
                    />
                    <Input name="RepliedBy" 
                        label="Replied By"
                        value={RepliedBy}
                        flgDisabled={true}
                    />
                    {
                        jcListVisible ? <JCList jcList={jcList} onClick={handleOnClick} onClose={handleCloseList} /> : null
                    }
                    {/* <TextArea name="Details" 
                        label="Reply Details"
                        value={Details}
                        flgDisabled={false}
                        onChange={onReplyChange}
                        rows="5"
                    /> */}
                    <TextAreaEnh name="Details"
                        label="Reply Details"
                        value={Details}
                        flgDisabled={true}
                        onChange={onReplyChangeCED}
                        onInput={onInputCED}
                    />
                    <Input name="FileSelect" 
                        type="file"
                        label="Select File" 
                        onChange={onFileSelect}
                        flgDisabled={false}
                    />
                </div>
            </div>
        </React.Fragment>
    );
}

const JCList = (props) => {
    return (
        <div style={{position: "absolute", 
                    width: "150px", height: "125px", 
                    // marginLeft: "2px", marginRight: "2px",
                    border: "solid 1px black", 
                    backgroundColor: "white",
                    display: 'flex',
                    flexDirection: 'column',
                    overflowY: "scroll"}}>
            <div style={{width: "100%", backgroundColor: "lightgray", display: "flex", flexDirection: "row"}}>
                <div style={{width: "85%"}}><strong>Job Cards</strong></div>
                <div style={{cursor: "pointer"}} onClick={props.onClose}><strong>X</strong></div>
            </div>
            {props.jcList.map(jc => {
                return (
                    <div style={{width: "100%"}} 
                        onClick={() => props.onClick(jc.jcNumber)}>
                        {jc.jcNumber + " " + jc.jcDate}</div>
                )
            })}
        </div>
    )
}

export default TicketForm;