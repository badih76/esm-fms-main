import React, { Component } from 'react';
import Input, { TextArea, DropDownList } from '../../common/input';
import ItemsList from '../../common/itemslist';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import processing from '../../images/processing.gif';
import ServiceChargeRow from './servicechargerow';
import { ToastContainer, toast } from 'react-toastify';

import { getAssetsList } from '../../appcode/invclientassets';
import { addPoolReading, getReadingsList, updatePoolReading } from '../../appcode/mainpoolreadings';

import { getClientsNames, 
         getProjectsOfClient,
         getContractsForProject, getContractSOA,
         addSOATransaction, updateSOATransaction } from '../../appcode/fincsoa';
import { TitlePageHeader } from '../titleheader/titleheader';
import ToolsBar from '../../common/toolsbar';
import _ from 'lodash';

class MaintPoolReadingForm extends Component {

    state = {
        dateSorted: false,
        transNumSorted: true,
        uprofile: {},
        clientsList: [],
        projectsList: [],
        contractsList: [],
        poolsList: [],
        readingData: {
            transDate: '',
            transTime: '',
            clientName: '',
            projectName: '',
            contractName: '',
            poolName: '',
            pHReading: 0,
            clReading: 0,
            tempReading: 0
        },
        showProcess: true,
        error: '',
        selectedClient: '',
        selectedProject: '',
        selectedContract: '',
        selectedPool: '',
        flags: {
            isAdd: false,
            isEdit: false
        },
        poolReadings: [],
        selectedReadingIndex: -1,

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
        || this.state.selectedContract === ''
        || this.state.selectedPool === '')
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

        let readingData = {
            transDate: '',
            transTime: '',
            clientName: '',
            projectName: '',
            contractName: '',
            poolName: '',
            pHReading: 0,
            clReading: 0
        }

        let flags = {...this.state.flags};
        flags.isAdd = true;
        flags.isEdit = false;

        let buttonsOptions = {...this.state.buttonsOptions};
        buttonsOptions.addButton.showAdd = false;
        buttonsOptions.editButton.showEdit = false;
        buttonsOptions.saveButton.showSave = true;
        buttonsOptions.cancelButton.showCancel = true;

        this.setState({ readingData, flags, buttonsOptions });
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
            let readingData = {
                transDate: '',
                clientName: '',
                projectName: '',
                contractName: '',
                poolName: '',
                pHReading: 0,
                clReading: 0
            }
    
            let flags = {...this.state.flags};
            flags.isAdd = false;
            flags.isEdit = false;
    
            let buttonsOptions = {...this.state.buttonsOptions};
            buttonsOptions.addButton.showAdd = true;
            buttonsOptions.editButton.showEdit = false;
            buttonsOptions.saveButton.showSave = false;
            buttonsOptions.cancelButton.showCancel = false;
    
            this.setState({ readingData, flags, buttonsOptions });
        }
        else {                      // isEdit = true 
            let readingData = {...this.state.poolReadings[this.state.selectedReadingIndex]};

            let flags = {...this.state.flags};
            flags.isAdd = false;
            flags.isEdit = false;
    
            let buttonsOptions = {...this.state.buttonsOptions};
            buttonsOptions.addButton.showAdd = true;
            buttonsOptions.editButton.showEdit = true;
            buttonsOptions.saveButton.showSave = false;
            buttonsOptions.cancelButton.showCancel = false;
    
            this.setState({ readingData, flags, buttonsOptions });
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

        getAssetsList(selectedProject, selectedContract)
            .then(result => {
                let poolsList = [];
                result.Result.map( c => {
                    if(c.Title.toUpperCase().includes("pool".toUpperCase()))
                    {
                        let pool = { Name: c.Title };
                        poolsList.push(pool);
                    } 
                });

                this.setState({ poolsList });
            })
            .catch(err => {
                console.log(err);
            });        
    }

    handlePoolsOnChange = (event) => {
        const { selectedProject, selectedContract } = this.state;

        let selectedPool = event.currentTarget.value; 
        this.setState({ selectedPool });

        getReadingsList(selectedProject, selectedContract, selectedPool)
            .then(result => {
                console.log('getReadings: ', result);
                let poolReadings = [];
                result.Result.map( c => {
                    poolReadings.push(c);
                });

                console.log('poolReadings: ', poolReadings);
                this.setState({ poolReadings }); 
            })
            .catch(err => {
                console.log(err);
            });        
    }

    handleTransDateOnChange = (event) => {
        let readingData = {...this.state.readingData};

        readingData.transDate = event.currentTarget.value;
        this.setState({ readingData });

        // Get the pool reading for the given date...
        let readingByDate;

        getReadingsList(this.state.selectedProject, 
                        this.state.selectedContract, 
                        this.state.selectedPool)
            .then(result => {
                readingByDate = {...result};        
                console.log("ReadingByDate: ", readingByDate);
            });
    }

    handleTransTimeOnChange = (event) => {
        let readingData = {...this.state.readingData};

        readingData.transTime = event.currentTarget.value;
        this.setState({ readingData });

        // Get the pool reading for the given date...
        let readingByDate;

        getReadingsList(this.state.selectedProject, 
                        this.state.selectedContract, 
                        this.state.selectedPool)
            .then(result => {
                readingByDate = {...result};        
                console.log("ReadingByDate: ", readingByDate);
            });
    }

    handleReadingValueOnChange = (event) => {
        let readingData = {...this.state.readingData};

        readingData[event.currentTarget.name] = event.currentTarget.value;
        console.log(event.currentTarget.name, event.currentTarget.value);
        this.setState({ readingData });
    }

    handleOnSubmit = () => {
        let missingField = '';

        if(this.state.readingData.transDate === '')
        {
            toast.warn('Reading Date cannot be left empty...',
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

        if(this.state.readingData.transTime === '')
        {
            toast.warn('Reading Time cannot be left empty...',
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

        this.setState({ showProcess: true });

        const { flags, selectedClient, selectedContract, selectedProject, selectedPool } =this.state;

        if(flags.isAdd)
        {
            let readingData = { ...this.state.readingData, 
                                clientName: selectedClient,
                                projectName: selectedProject,
                                contractName: selectedContract,
                                poolName: selectedPool
                            }; 
            
            console.log(readingData);

            let returnedResult = addPoolReading(selectedProject, selectedContract, 
                                                selectedPool, readingData)
            .then(result => {
                    
                let poolReadings = [...this.state.poolReadings];
                console.log(result);
                poolReadings.push(readingData);

                let flags = {...this.state.flags};
                flags.isAdd = false;
                flags.isEdit = false;
        
                let buttonsOptions = {...this.state.buttonsOptions};
                buttonsOptions.addButton.showAdd = true;
                buttonsOptions.editButton.showEdit = false;
                buttonsOptions.saveButton.showSave = false;
                buttonsOptions.cancelButton.showCancel = false;
        
                this.setState({  flags, buttonsOptions, poolReadings });
                //soaTransactions,

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
            let poolReadings = [...this.state.poolReadings];
            poolReadings[this.state.selectedTransIndex] = {...this.state.readingData};

            // console.log(this.state.selectedTransIndex, poolReadings);
            this.setState({ poolReadings });

            // update the reading in database based on reading id in readings object... 
            updatePoolReading(selectedProject, selectedContract, selectedPool, this.state.readingData)
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

    handleReadingClick = (index) => {
        let readingData = {...this.state.poolReadings[index]};
        let buttonsOptions = {...this.state.buttonsOptions};
        buttonsOptions.editButton.showEdit = true;

        this.setState({ readingData, buttonsOptions, selectedTransIndex: index });
    }

    render() {

        return (
            <React.Fragment>
                <TitlePageHeader title="Pools Readings Log" bgColor="white" color="gray" />
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

                    <DropDownList name='ddlPools' 
                        label='Pools'  
                        values={this.state.poolsList} 
                        onChange={this.handlePoolsOnChange}
                        flgDisabled={this.state.flags.isAdd || this.state.flags.isEdit} 
                        error={this.state.error} 
                    />

                    <div className='col-md-12'>
                        <div className='col-md-6'>
                            <Input 
                                type='date'
                                name='txtTransDate'
                                label='Reading Date'
                                value={this.state.readingData.transDate}
                                onChange={this.handleTransDateOnChange}
                                flgDisabled={false}
                                //{!this.state.flags.isAdd && !this.state.flags.isEdit}
                                error={this.state.error}
                            />
                        </div>
                        <div className='col-md-6'>
                            <Input 
                                type='time'
                                name='txtTransTime'
                                label='Reading Time'
                                value={this.state.readingData.transTime}
                                onChange={this.handleTransTimeOnChange}
                                flgDisabled={false}
                                //{!this.state.flags.isAdd && !this.state.flags.isEdit}
                                error={this.state.error}
                            />
                        </div>
                    </div>

                    <div className='col-md-12'>
                        <div className='col-md-6'>
                            <Input 
                                type='number'
                                name='pHReading'
                                label='pH Value'
                                value={this.state.readingData.pHReading}
                                onChange={this.handleReadingValueOnChange}
                                flgDisabled={!this.state.flags.isAdd && !this.state.flags.isEdit}
                                error={this.state.error}
                            />
                        </div>
                        <div className='col-md-6'>
                            <Input 
                                type='text'
                                name='clReading'
                                label='Chlorine Value'
                                value={this.state.readingData.clReading}
                                onChange={this.handleReadingValueOnChange}
                                flgDisabled={!this.state.flags.isAdd && !this.state.flags.isEdit}
                                error={this.state.error}
                            />
                        </div>
                    </div>
                    <div className='col-md-12'>
                        <div className='col-md-6'>
                            <Input 
                                type='number'
                                name='tempReading'
                                label='Temperature Value'
                                value={this.state.readingData.tempReading}
                                onChange={this.handleReadingValueOnChange}
                                flgDisabled={!this.state.flags.isAdd && !this.state.flags.isEdit}
                                error={this.state.error}
                            />
                        </div>
                        <div className='col-md-6'>
                            
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
                            <th style={{width: "10%"}}>
                                <div onClick={this.sortByDate}
                                    style={this.state.dateSorted ? {color: 'blue'} : {color: 'black'}}>
                                    Date
                                </div>
                            </th>
                            <th style={{width: "10%"}}>
                                <div onClick={this.sortByDate}
                                    style={this.state.dateSorted ? {color: 'blue'} : {color: 'black'}}>
                                    Time
                                </div>
                            </th>
                            <th style={{width: "20%", textAlign: "center"}}>pH Reading</th>
                            <th style={{width: "20%", textAlign: "center"}}>Chlorine Reading</th>
                            <th style={{width: "20%", textAlign: "center"}}>Temp. Reading</th>
                            <th style={{textAlign: "center"}}>Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.poolReadings ? 
                            this.state.poolReadings.map((reading, index) => {
                            return <ServiceChargeRow key={index} id={index}
                                reading={reading}
                                transClick={this.handleReadingClick} />
                            }) : null
                        }
                    </tbody>
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

    // sumDr = () => {
    //     let sumdr = 0;
    //     let soaTrans = this.state.soaTransactions;
    //     soaTrans.map(s => {
    //         if(s.transType === 'Debit') sumdr += parseFloat(s.transAmount);
    //     });

    //     return sumdr.toFixed(3);
    // }

    // calcBalance = () => {
    //     let sumcr = 0;
    //     let soaTrans = this.state.soaTransactions;
    //     soaTrans.map(s => {
    //         if(s.transType === 'Credit') sumcr += parseFloat(s.transAmount);
    //     });

    //     let sumdr = 0;
    //     soaTrans.map(s => {
    //         if(s.transType === 'Debit') sumdr += parseFloat(s.transAmount);
    //     });

    //     return (sumcr - sumdr).toFixed(3);
    // }

    sortByDate = () => {
        // let soaTransactions = [...this.state.soaTransactions];

        // soaTransactions = _.orderBy(soaTransactions, 'transDate');
        // let dateSorted = true;
        // let transNumSorted = false;

        // this.setState({ soaTransactions, dateSorted, transNumSorted });
    } 

    sortByTransNum = () => {
        // let soaTransactions = [...this.state.soaTransactions];

        // soaTransactions = _.orderBy(soaTransactions, 'transId');

        // let dateSorted = false;
        // let transNumSorted = true;

        // this.setState({ soaTransactions, dateSorted, transNumSorted });
    } 

}

export default MaintPoolReadingForm;

const currColStyle = {
    textAlign: "right",
    width: "40%"
};
