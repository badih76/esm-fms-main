import React, { Component } from 'react';
import Input, { TextArea, DropDownList } from '../../../common/input';
import ItemsList from '../../../common/itemslist';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import processing from '../../../images/processing.gif';
import ServiceChargeRow from './servicechargerow';
import { ToastContainer, toast } from 'react-toastify';

import { getClientsNames, 
         getProjectsOfClient,
         getContractsForProject, getContractSOA,
         addSOATransaction, updateSOATransaction } from '../../../appcode/fincsoa';
import { TitlePageHeader } from '../../titleheader/titleheader';
import ToolsBar from '../../../common/toolsbar';
import _ from 'lodash';

class SOAForm extends Component {

    state = {
        dateSorted: false,
        transNumSorted: true,
        uprofile: {},
        transClasses: [
            {
                Name: 'Open Balance' 
            },
            {
                Name: 'Periodic Contract Fees' 
            },
            {
                Name: 'Incident Maintainence Charges'
            }
        ],
        transTypes: [
            {
                Name: 'Credit' 
            },
            {
                Name: 'Debit' 
            }
        ],
        clientsList: [],
        projectsList: [],
        contractsList: [],
        transData: {
            transDate: '',
            transClass: 'Open Balance',
            transDesc: '',
            transType: 'Credit',
            transAmount: 0
        },
        showProcess: true,
        error: '',
        selectedClient: '',
        selectedProject: '',
        selectedContract: '',
        flags: {
            isAdd: false,
            isEdit: false
        },
        soaTransactions: [],
        selectedTransIndex: -1,

        buttonsOptions: {
            addButton: {
                showAdd: true,
                onAdd: () => this.handleAdd()
            },
            editButton: {
                showEdit: false,
                onEdit: () => this.handleEdit()
            },
            saveButton: {
                showSave: false,
                onSave: () => this.handleOnSubmit()
            },
            cancelButton: {
                showCancel: false,
                onCancel: () => this.handleCancel()
            },
            searchButton: {
                showSearch: false,
                onSearch: null
            }
        }
    }

    handleAdd = () => {
        if(this.state.selectedClient === '' 
        || this.state.selectedProject === ''
        || this.state.selectedContract === '')
        {
            toast.warn('You must select the Client, Project, and Contract before your Add or Edit...',
                {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });
            return;
        }

        let transData= {
            transDate: '',
            transClass: 'Open Balance',
            transDesc: '',
            transType: 'Credit',
            transAmount: 0
        }

        let flags = {...this.state.flags};
        flags.isAdd = true;
        flags.isEdit = false;

        let buttonsOptions = {...this.state.buttonsOptions};
        buttonsOptions.addButton.showAdd = false;
        buttonsOptions.editButton.showEdit = false;
        buttonsOptions.saveButton.showSave = true;
        buttonsOptions.cancelButton.showCancel = true;

        this.setState({ transData, flags, buttonsOptions });
    }

    handleEdit = () => {
        let flags = {...this.state.flags};
        flags.isAdd = false;
        flags.isEdit = true;

        let buttonsOptions = {...this.state.buttonsOptions};
        buttonsOptions.addButton.showAdd = false;
        buttonsOptions.editButton.showEdit = false;
        buttonsOptions.saveButton.showSave = true;
        buttonsOptions.cancelButton.showCancel = true;

        this.setState({ flags, buttonsOptions });
    }

    handleCancel = () => {
        let flags = {...this.state.flags};

        if(flags.isAdd)
        {
            let transData= {
                transDate: '',
                transClass: 'Open Balance',
                transDesc: '',
                transType: 'Credit',
                transAmount: 0
            }
    
            let flags = {...this.state.flags};
            flags.isAdd = false;
            flags.isEdit = false;
    
            let buttonsOptions = {...this.state.buttonsOptions};
            buttonsOptions.addButton.showAdd = true;
            buttonsOptions.editButton.showEdit = false;
            buttonsOptions.saveButton.showSave = false;
            buttonsOptions.cancelButton.showCancel = false;
    
            this.setState({ transData, flags, buttonsOptions });
        }
        else {                      // isEdit = true 
            let transData = {...this.state.soaTransactions[this.state.selectedTransIndex]};

            let flags = {...this.state.flags};
            flags.isAdd = false;
            flags.isEdit = false;
    
            let buttonsOptions = {...this.state.buttonsOptions};
            buttonsOptions.addButton.showAdd = true;
            buttonsOptions.editButton.showEdit = true;
            buttonsOptions.saveButton.showSave = false;
            buttonsOptions.cancelButton.showCancel = false;
    
            this.setState({ transData, flags, buttonsOptions });
        }
    }

    handleTransDescOnChange = (event) => {
        let transData = {...this.state.transData};
        transData.transDesc = event.currentTarget.value;
        
        this.setState({ transData });
    }

    handleClientsOnChange = (event) => {
        this.setState({ showProcess: true });
        let selectedClient = event.currentTarget.value;

        getProjectsOfClient(event.currentTarget.value)
            .then(result => {
                let projectsList = [];

                result.Result.map( c => { 
                    let project = {Name: c.name };
                    projectsList.push(project) });
                
                this.setState({ projectsList, selectedClient });
                this.setState({ showProcess: false });
            })
            .catch(error => {
                console.log(error);
            });
    }

    handleProjectsOnChange = (event) => {
        this.setState({ showProcess: true });
        let selectedProject = event.currentTarget.value;

        getContractsForProject(event.currentTarget.value)
            .then(result => {
                let contractsList = [];

                result.Result.map( c => { 
                    let contract = { Name: c.name };
                    contractsList.push(contract) });
                
                this.setState({ contractsList, selectedProject });
                this.setState({ showProcess: false });
            })
            .catch(error => {
                console.log(error);
            });
    }

    handleContractsOnChange = (event) => {
        const { selectedClient, selectedProject } = this.state;

        let selectedContract = event.currentTarget.value; 
        this.setState({ selectedContract });

        getContractSOA(selectedClient, selectedProject, selectedContract)
            .then(result => {
                // console.log('SOA: ', result);        
                let soaTransactions = result.Result;
                console.log(soaTransactions);
                this.setState({ soaTransactions });
            })
            .catch(error => {
                console.log(error);
            });
        
    }

    handleTransDateOnChange = (event) => {
        let transData = {...this.state.transData};

        transData.transDate = event.currentTarget.value;
        this.setState({ transData });
    }

    handleTransClassOnChange = (event) => {
        let transData = {...this.state.transData};

        transData.transClass = event.currentTarget.value;
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

        const { flags, selectedClient, selectedContract, selectedProject, transData } =this.state;

        if(flags.isAdd)
        {
            let transaction = {
                clientName: selectedClient,
                projectName: selectedProject,
                contractName: selectedContract,
                transDate: transData.transDate,
                transClass: transData.transClass,
                transType: transData.transType,
                transDesc: transData.transDesc,
                transAmount: transData.transAmount
            }

            let returnedResult = addSOATransaction(transaction)
            .then(result => {
                getContractSOA(selectedClient, selectedProject, selectedContract)
                    .then(result => {
                        console.log(result.Result);
                    })
                    .catch(error => {
                        console.log(error);
                    });
                    
                let soaTransactions = [...this.state.soaTransactions];
                transaction.transId = result.Result;
                console.log(result);
                soaTransactions.push(transaction);

                let flags = {...this.state.flags};
                flags.isAdd = false;
                flags.isEdit = false;
        
                let buttonsOptions = {...this.state.buttonsOptions};
                buttonsOptions.addButton.showAdd = true;
                buttonsOptions.editButton.showEdit = false;
                buttonsOptions.saveButton.showSave = false;
                buttonsOptions.cancelButton.showCancel = false;
        
                this.setState({ soaTransactions, flags, buttonsOptions });

                this.setState({ showProcess: false });
            })
            .catch(error => {
                console.log(error);
                toast.error(error.message,
                    {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true
                    });

                let flags = {...this.state.flags};
                flags.isAdd = false;
                flags.isEdit = false;
        
                let buttonsOptions = {...this.state.buttonsOptions};
                buttonsOptions.addButton.showAdd = true;
                buttonsOptions.editButton.showEdit = false;
                buttonsOptions.saveButton.showSave = false;
                buttonsOptions.cancelButton.showCancel = false;
        
                this.setState({ flags, buttonsOptions });

                this.setState({ showProcess: false });
            });

            
        }
        else            // isEdit = true
        {
            this.setState({ showProcess: true });
            
            // update the transaction in the soaTransactions list based on selected index...
            let soaTransactions = [...this.state.soaTransactions];
            soaTransactions[this.state.selectedTransIndex] = {...this.state.transData};

            console.log(this.state.selectedTransIndex, soaTransactions);
            this.setState({ soaTransactions });

            // update the transaction in database based on transaction id in transaction object... 
            updateSOATransaction(selectedClient, selectedProject, selectedContract, transData)
                .then(result => {
                    let flags = {...this.state.flags};
                    flags.isAdd = false;
                    flags.isEdit = false;
            
                    let buttonsOptions = {...this.state.buttonsOptions};
                    buttonsOptions.addButton.showAdd = true;
                    buttonsOptions.editButton.showEdit = true;
                    buttonsOptions.saveButton.showSave = false;
                    buttonsOptions.cancelButton.showCancel = false;
            
                    this.setState({ flags, buttonsOptions });

                    this.setState({ showProcess: false });
                })
                .catch(error => {
                    console.log(error);

                    let flags = {...this.state.flags};
                    flags.isAdd = false;
                    flags.isEdit = false;
            
                    let buttonsOptions = {...this.state.buttonsOptions};
                    buttonsOptions.addButton.showAdd = true;
                    buttonsOptions.editButton.showEdit = true;
                    buttonsOptions.saveButton.showSave = false;
                    buttonsOptions.cancelButton.showCancel = false;
            
                    this.setState({ flags, buttonsOptions });

                    this.setState({ showProcess: false });

                })
        }
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

        getClientsNames()
            .then(result => {
                let clientsList = [];
                
                result.Result.map( c => { 
                    let client = {Name: c };
                    clientsList.push(client) });
                
                this.setState({ clientsList });
                this.setState({ showProcess: false });
            })
            .catch(error => {
                console.log(error);
            });
        
    }

    handleSOATransClick = (index) => {
        let transData = {...this.state.soaTransactions[index]};
        let buttonsOptions = {...this.state.buttonsOptions};
        buttonsOptions.editButton.showEdit = true;

        this.setState({ transData, buttonsOptions, selectedTransIndex: index });
    }

    render() {

        return (
            <React.Fragment>
                <TitlePageHeader title="Client's Contract Statement of Account" bgColor="white" color="gray" />
                <form style={{marginTop: "10px", paddingLeft: "25px", paddingRight: "25px"}} >
                    <ToolsBar buttonsOptions={this.state.buttonsOptions} />
                    <div style={{width: "100%", margin: "10px"}}></div>
                    <DropDownList name='ddlClients' 
                        label='Clients'  
                        values={this.state.clientsList} 
                        onChange={this.handleClientsOnChange} 
                        flgDisabled={this.state.flags.isAdd || this.state.flags.isEdit} 
                        error={this.state.error} 
                    />

                    <DropDownList name='ddlProjects' 
                        label='Projects'  
                        values={this.state.projectsList} 
                        onChange={this.handleProjectsOnChange} 
                        flgDisabled={this.state.flags.isAdd || this.state.flags.isEdit} 
                        error={this.state.error} 
                    />

                    <DropDownList name='ddlContracts' 
                        label='Contracts'  
                        values={this.state.contractsList} 
                        onChange={this.handleContractsOnChange}
                        flgDisabled={this.state.flags.isAdd || this.state.flags.isEdit} 
                        error={this.state.error} 
                    />

                    <Input 
                        type='text'
                        name='txtTransDesc'
                        label='Transaction Description'
                        value={this.state.transData.transDesc}
                        onChange={this.handleTransDescOnChange}
                        flgDisabled={!this.state.flags.isAdd && !this.state.flags.isEdit}
                        error={this.state.error}
                    />

                    <div className='col-md-12'>
                        <div className='col-md-6'>
                            <Input 
                                type='date'
                                name='txtTransDate'
                                label='Transaction Date'
                                value={this.state.transData.transDate}
                                onChange={this.handleTransDateOnChange}
                                flgDisabled={!this.state.flags.isAdd && !this.state.flags.isEdit}
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
                                flgDisabled={!this.state.flags.isAdd && !this.state.flags.isEdit}
                                error={this.state.error}
                            />
                        </div>
                    </div>
                    
                    <div className='col-md-12'>
                        <div className='col-md-6'>
                            <DropDownList 
                                name='ddlTransClass'
                                label='Transaction Class'
                                values={this.state.transClasses}
                                onChange={this.handleTransClassOnChange}
                                flgDisabled={!this.state.flags.isAdd && !this.state.flags.isEdit}
                                error={this.state.error}
                                defValue='Open Balance'
                            />        
                        </div>
                        <div className='col-md-6'>
                            <DropDownList 
                                name='ddlTransType'
                                label='Transaction Type'
                                values={this.state.transTypes}
                                onChange={this.handleTransTypeOnChange}
                                flgDisabled={!this.state.flags.isAdd && !this.state.flags.isEdit}
                                error={this.state.error}
                                defValue={this.state.transData.transType}
                            />
                        </div>
                    </div>
            
                    
                    <img src={processing} 
                        width="60vw" 
                        alt="processing" 
                        className={this.state.showProcess ? "" : "hidden"} 
                        style={{marginTop: "2vh"}} />

                    <div className={"btn-toolbar btnToobar" + ((this.state.flags.isAdd || this.state.flags.isEdit) ? "" : " hidden")} >
                        <div className="btn-group btn-group-justified">
                            {/* <button type="button" 
                                className="btn btn-danger" 
                                style={{width: "50%"}}
                                onClick={this.handleOnCancel}>
                                <FontAwesomeIcon icon="ban" />
                            </button> */}
                            
                        </div>
                    </div>
                </form>
                <table className="table table-striped table-hover" 
                    >
                    <thead>
                        <tr className="bg-info">
                            <th style={{width: "10%", textAlign: 'center'}}>
                                <div onClick={this.sortByTransNum} 
                                    style={this.state.transNumSorted ? {color: 'blue'} : {color: 'black'}}>
                                    Tr ID
                                </div>
                            </th>
                            <th style={{width: "10%"}}>
                                <div onClick={this.sortByDate}
                                    style={this.state.dateSorted ? {color: 'blue'} : {color: 'black'}}>
                                    Date
                                </div>
                            </th>
                            <th style={{width: "40%"}}>Description</th>
                            <th style={currColStyle}>Debit (OMR)</th>
                            <th style={currColStyle}>Credit (OMR)</th>
                            <th>Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.soaTransactions ? 
                            this.state.soaTransactions.map((soa, index) => {
                            return <ServiceChargeRow key={index} id={index}
                                transId={soa.transId}
                                transDate={soa.transDate}   
                                transDesc={soa.transDesc}
                                transAmountDr={soa.transType === "Debit" ? parseFloat(soa.transAmount).toFixed(3) : 0}
                                transAmountCr={soa.transType === "Credit" ? parseFloat(soa.transAmount).toFixed(3) : 0}
                                transClick={this.handleSOATransClick} />
                            }) : null
                        }
                    </tbody>
                    <tfoot>
                        <tr className="bg-success">
                            <td></td>
                            <td></td>
                            <td style={{fontWeight: 'bold', textAlign: 'right'}}>{'Total'}</td>
                            <td style={{textAlign: 'right', fontWeight: 'bold'}}>{this.sumDr()}</td>
                            <td style={{textAlign: 'right', fontWeight: 'bold'}}>{this.sumCr()}</td>
                            <td></td>
                        </tr>
                        <tr className="bg-success">
                            <td></td>
                            <td></td>
                            <td style={{fontWeight: 'bold', textAlign: 'right'}}>{'Balance'}</td>
                            <td style={{textAlign: 'right', fontWeight: 'bold'}}></td>
                            <td style={{textAlign: 'right', fontWeight: 'bold'}}>{this.calcBalance()}</td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
                <hr  />
                <ToastContainer />
            </React.Fragment>
        );
    }

    sumCr = () => {
        let sumcr = 0;
        let soaTrans = this.state.soaTransactions;
        soaTrans.map(s => {
            if(s.transType === 'Credit') sumcr += parseFloat(s.transAmount);
        });

        return sumcr.toFixed(3);
    }

    sumDr = () => {
        let sumdr = 0;
        let soaTrans = this.state.soaTransactions;
        soaTrans.map(s => {
            if(s.transType === 'Debit') sumdr += parseFloat(s.transAmount);
        });

        return sumdr.toFixed(3);
    }

    calcBalance = () => {
        let sumcr = 0;
        let soaTrans = this.state.soaTransactions;
        soaTrans.map(s => {
            if(s.transType === 'Credit') sumcr += parseFloat(s.transAmount);
        });

        let sumdr = 0;
        soaTrans.map(s => {
            if(s.transType === 'Debit') sumdr += parseFloat(s.transAmount);
        });

        return (sumcr - sumdr).toFixed(3);
    }

    sortByDate = () => {
        let soaTransactions = [...this.state.soaTransactions];

        soaTransactions = _.orderBy(soaTransactions, 'transDate');
        let dateSorted = true;
        let transNumSorted = false;

        this.setState({ soaTransactions, dateSorted, transNumSorted });
    } 

    sortByTransNum = () => {
        let soaTransactions = [...this.state.soaTransactions];

        soaTransactions = _.orderBy(soaTransactions, 'transId');

        let dateSorted = false;
        let transNumSorted = true;

        this.setState({ soaTransactions, dateSorted, transNumSorted });
    } 

}

export default SOAForm;

const currColStyle = {
    textAlign: "right",
    width: "20%"
};
