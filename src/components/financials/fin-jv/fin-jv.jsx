import React, { Component } from 'react';
import Input, { TextArea, DropDownList } from '../../../common/input';
import ItemsList from '../../../common/itemslist';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import processing from '../../../images/processing.gif';
import ServiceChargeRow from '../fin-soa/servicechargerow';


import { getProjects, 
         addJVTransaction, 
         getJVTransactions } from '../../../appcode/finjv';
import { TitlePageHeader } from '../../titleheader/titleheader';

class JVForm extends Component {

    state = {
        uprofile: {},
        projectsList: [],
        transData: {
            transDate: '',
            transAmount: 0,
            transDesc: '',
            targetProj: 'Self',
            transType: 'Credit'
        },
        showProcess: true,
        error: '',
        selectedClient: '',
        selectedProject: '',
        selectedContract: '',
        flags: {
            isAdd: true,
            isEdit: true
        },
        transTypes: [
            { Name: 'Credit'},
            { Name: 'Debit' }
        ],
        jvTransactions: [],
        targetProjects: [
            { Name: 'Self' },
            { Name: 'Petty Cash' }
        ]
    }

    handleTransDescOnChange = (event) => {
        let transData = {...this.state.transData};
        transData.transDesc = event.currentTarget.value;
        
        this.setState({ transData });
    }

    handleProjectsOnChange = (event) => {
        let transData = {...this.state.transData};
        transData.targetProj = event.currentTarget.value;

        this.setState({ transData });
    }

    handleTransDateOnChange = (event) => {
        let transData = {...this.state.transData};

        transData.transDate = event.currentTarget.value;
        this.setState({ transData });
    }

    handleTransTypeOnChange = (event) => {
        let transData = {...this.state.transData};

        transData.transType = event.currentTarget.value;
        this.setState({ transData });
    }

    handleTransAmountOnChange = (event) => {
        let transData = {...this.state.transData};

        transData.transAmount = event.currentTarget.value;
        this.setState({ transData });
    }

    handleOnSubmit = () => {
        this.setState({ showProcess: true });

        const { transData } =this.state;

        let transaction = {
            projectName: transData.targetProj,
            transDate: transData.transDate,
            transType: transData.transType,
            transDesc: transData.transDesc,
            transAmount: transData.transAmount
        }

        let returnedResult = addJVTransaction(transaction)
            .then(result => {
                console.log(result);

                getJVTransactions()
                    .then(result => {
                        let jvTransactions = [];

                        jvTransactions = result.Result;

                        console.log(jvTransactions);
                        this.setState({ jvTransactions });

                        this.setState({ showProcess: false });
                    })
                    .catch(error => {
                        console.log(error);
                    });
            })
            .catch(error => {
                console.log(error);
            });

            console.log(returnedResult);
    }

    handleOnCancel = () => {

    }

    constructor(props) {
        super(props);

        const token = sessionStorage['token'];
        const uprofile = JSON.parse(sessionStorage.getItem('uprofile'));
    
        if(!token || !this.props.menuVisible)
        {
            props.history.push('/');
            return ;
        }
        else
        {
            this.state.uprofile = uprofile;
        }
        
        getProjects()
            .then(result => {
                let projectsList = [...this.state.targetProjects];

                result.Result.map( c => { 
                    let project = {Name: c.name };
                    projectsList.push(project) });
                
                this.setState({ projectsList });
                this.setState({ showProcess: false });
            })
            .catch(error => {
                console.log("Error: ", error);
            });
        
        getJVTransactions()
            .then(result => {
                let jvTransactions = [];

                jvTransactions = result.Result;

                console.log(jvTransactions);
                this.setState({ jvTransactions });
            })
            .catch(error => {
                console.log(error);
            });
    }

    render() {

        return (
            <React.Fragment>
                <TitlePageHeader title="Journal Entries and Petty Cash" bgColor="white" color="gray" />
                <form style={{marginTop: "10px", paddingLeft: "25px", paddingRight: "25px"}} >
                    <div className='col-md-12'>
                        <div className='col-md-6'>
                            <Input 
                                type='date'
                                name='txtTransDate'
                                label='Transaction Date'
                                value={this.state.transData.transDate}
                                onChange={this.handleTransDateOnChange}
                                flgDisabled={false}
                                error={this.state.error}
                            />
                        </div>
                        <div className='col-md-6'>
                            <Input 
                                type='number'
                                name='txtTransValue'
                                label='Transaction Value'
                                value={this.state.transData.transAmount}
                                onChange={this.handleTransAmountOnChange}
                                flgDisabled={false}
                                error={this.state.error}
                            />
                        </div>
                    </div>
                    
                    <DropDownList name='ddlProjects' 
                        label='Projects'  
                        values={this.state.projectsList} 
                        onChange={this.handleProjectsOnChange} 
                        flgDisabled={false} 
                        error={this.state.error} 
                    />

                    <Input 
                        type='text'
                        name='txtTransDesc'
                        label='Transaction Description'
                        value={this.state.transData.transDesc}
                        onChange={this.handleTransDescOnChange}
                        flgDisabled={false}
                        error={this.state.error}
                    />

                    <DropDownList 
                        name='ddlTransType'
                        label='Transaction Type'
                        values={this.state.transTypes}
                        onChange={this.handleTransTypeOnChange}
                        flgDisabled={false}
                        error={this.state.error}
                        defValue='Credit'
                    />
                    
                    <img src={processing} 
                        width="60vw" 
                        alt="processing" 
                        className={this.state.showProcess ? "" : "hidden"} 
                        style={{marginTop: "2vh"}} />

                    <div className={"btn-toolbar" 
                            + ((this.state.flags.isAdd || this.state.flags.isEdit) ? "" : " hidden")}
                            style={btnToolbar} >
                        <div className="btn-group btn-group-justified">
                            <button type="button"
                                className="btn btn-primary" 
                                style={{width: "100%"}}
                                onClick={this.handleOnSubmit} >
                                <FontAwesomeIcon icon="save" />
                            </button>
                            {/* <button type="button" 
                                className="btn btn-danger" 
                                style={{width: "50%"}}
                                onClick={this.handleOnCancel}>
                                <FontAwesomeIcon icon="ban" />
                            </button> */}
                            
                        </div>
                    </div>
                </form>
                <table className="table table-striped table-hover">
                    <thead>
                        <tr className="bg-info">
                            <th style={{width: "20%"}}>Date</th>
                            <th style={{width: "50%"}}>Description</th>
                            <th style={currColStyle}>Debit (OMR)</th>
                            <th style={currColStyle}>Credit (OMR)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.jvTransactions.map(jv => {
                            return <ServiceChargeRow 
                                transDate={jv.jvDate}   
                                transDesc={jv.jvDesc}
                                transAmountDr={jv.jvTransType === "Debit" ? jv.jvAmount : 0}
                                transAmountCr={jv.jvTransType === "Credit" ? jv.jvAmount : 0} />
                        })}
                        
                    </tbody>
                </table>
                <hr  />
            </React.Fragment>
        );
    }
}

export default JVForm;

const currColStyle = {
    textAlign: "right",
    width: "15%"
};

const btnToolbar = {
    width: "100%", 
    paddingBottom: "25px", 
    marginBottom: "25px", 
    marginAbove: "25px", 
    borderBottom: "solid thin", 
    borderBottomColor: "gainsboro"
}