import React, { Component } from 'react';
import ItemsList from '../../common/itemslist';
import ToolsBar from '../../common/toolsbar';
import {ToastContainer, toast } from 'react-toastify';
import MainJCForm from './mainjcform';

import { getJobCardList, getJobCardDoc,
         addJobCard, updateJobCard,
         getProjectsList, getTicketsList } from '../../appcode/mainjobcards';


import Joi from 'joi-browser';
import { TitlePageHeader } from '../titleheader/titleheader';

class MainJobCards extends Component {

    state = {
        uprofile: {},
        jobcards: [],
        displayJC: [],
        projects: [],
        contracts: [],
        tickets: [],
        result: {},
        searchValue: '',

        buttonsOptions: {
            addButton: {
                showAdd: true,
                onAdd: () => this.handleAdd()
            },
            editButton: {
                showEdit: false,
                onEdit: () => this.handleEdit()
            },
            deleteButton: {
                showDelete: false,
                onDelete: null
            },
            refreshButton: {
                showRefresh: true,
                onRefresh: () => this.handleRefresh()
            },
            searchButton: {
                showSearch: true,
                onValueChange: () => this.handleSearchValueChange(),
                onSearch: () => this.handleSearch()
            }
        },

        listProcess: true,
        listVisible: false,
        
        formProcess: false,
        formVisible: true,

        jobcard: {
            jcNumber: '',
            jcDate: '',
            jcDetails: '',
            jcMonth: 1,
            jcYear: 2018,
            jcTime: '',
            jcTicketNum: '',
            jcStatus: 'Pending',
            jcPrjName: '',
            jcContName: ''
        },

        flags: {
            isAdd: false,
            isEdit: false
        },

        showmodal: false,

        errors: {}
    };

    schema = {
        jcNumber: Joi
                    .string()
                    .optional()
                    .allow("")
                    .regex(/^[a-zA-Z0-9\s\_\-]+$/, {name: "No Special Chars"})
                    .label('JC Number'),
        jcDate: Joi
                    .string()
                    .required()
                    .regex(/^[a-zA-Z0-9\s\_\-]+$/, {name: "No Special Chars"})
                    .label('JC Date'),
        jcDetails: Joi
                    .string()
                    .required()
                    .regex(/^[a-zA-Z0-9\s\_\-\.\,\n\&\""\:]+$/, {name: "No Special Chars"})
                    .label('JC Details'),
        jcMonth: Joi.number().integer().min(1).max(12).optional(),
        jcYear: Joi.number().integer().optional(),
        jcTime: Joi
                    .string()
                    .required()
                    .regex(/^[a-zA-Z0-9\s\_\-\:]+$/, {name: "No Special Chars"})
                    .label('JC Time'),
        jcTicketNum: Joi
                    .string()
                    .optional()
                    .allow("")
                    .regex(/^[a-zA-Z0-9\s\_\-]+$/, {name: "No Special Chars"})
                    .label('JC Ticket #'),
        jcStatus: Joi
                    .string()
                    .required()
                    .regex(/^[a-zA-Z0-9\s\_\-]+$/, {name: "No Special Chars"})
                    .label('JC Status'),
        jcPrjName: Joi
                    .string()
                    .required()
                    .regex(/^[a-zA-Z0-9\s\_\-]+$/, {name: "No Special Chars"})
                    .label('JC Project Name'),
        jcContName: Joi
                    .string()
                    .required()
                    .regex(/^[a-zA-Z0-9\s\_\-]+$/, {name: "No Special Chars"})
                    .label('JC Contract Name')
    };

    handleSearch = () => {
        let jobcards = [...this.state.jobcards];

        let displayJC = jobcards.filter(jc => {
            console.log(jc.jcNumber, this.state.searchValue,jc.jcNumber.indexOf(this.state.searchValue));
            return jc.jcNumber.indexOf(this.state.searchValue) !== -1;
        });

        this.setState({ displayJC });
    }

    handleSearchValueChange = (e) => {
        const { value } = e.currentTarget;
        this.setState({ searchValue: value });
    }

    handleCloseModal = () => {
        this.setState({ showmodal: false });
    };

    handleListUpdated = () => {
        const listProcess = false;
        const listVisible = true;

        this.setState({ listProcess, listVisible });
    };

    handleSubmit = () => {
        let errors = this.validateFields();
        this.setState({ errors: errors || {} });
        let buttonsOptions = {...this.state.buttonsOptions};

        let formProcess = true;
        let formVisible = false;

        this.setState({ formProcess, formVisible });

        if(errors) 
        {
            let formProcess = false;
            let formVisible = true;

            this.setState({ formProcess, formVisible });

            return;
        }

        if(this.state.flags.isAdd)
        {
            // Adding a new category...
            addJobCard(this.state.jobcard)
                .then(result => {

                    if(result.Success === 'Ok')
                    {
                        let jobcard = {...result.Result};

                        let flags = {...this.state.flags};
                        flags.isAdd = false;
                        flags.isEdit = false;
                        
                        let jobcards = [...this.state.jobcards];
                        
                        jobcards.push(jobcard);
                        let displayJC = [...jobcards];


                        let formProcess = false;
                        let formVisible = true;
                
                        this.setState({ result, flags, jobcards, jobcard, 
                                        formProcess, formVisible, displayJC });
                        
                        toast.success('New Job Card Saved Successfully.', 
                        {
                            position: toast.POSITION.TOP_RIGHT,
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true
                        });
                    }
                    else
                    {
                        let jobcard = {};
                        let flags = {...this.state.flags};
                        flags.isAdd = false;
                        flags.isEdit = false;

                        let formProcess = false;
                        let formVisible = true;

                        this.setState({ jobcard, flags, result, formProcess, formVisible });

                        toast.error('New Job Card was not Saved Successfully!\n'+result.FailReason, 
                        {
                            position: toast.POSITION.TOP_RIGHT,
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true
                        });
                    }

                    buttonsOptions.addButton.showAdd = true;
                    buttonsOptions.editButton.showEdit = true;
                    buttonsOptions.refreshButton.showRefresh = true;
                    this.setState({ buttonsOptions });
                })
                .catch(err => {
                    let jobcard = {};
                    let flags = {...this.state.flags};
                    flags.isAdd = false;
                    flags.isEdit = false;

                    let formProcess = false;
                    let formVisible = true;
            
                    this.setState({ jobcard: err, jobcard, flags, formProcess, formVisible });
                    toast.error('Error occured!\n'+err, 
                        {
                            position: toast.POSITION.TOP_RIGHT,
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true
                        });

                    buttonsOptions.addButton.showAdd = true;
                    buttonsOptions.editButton.showEdit = true;
                    buttonsOptions.refreshButton.showRefresh = true;
                    this.setState({ buttonsOptions });
    
                }); 
        }
        else if(this.state.flags.isEdit)
        {
            console.log('Editing');
            // Adding a new category...
            updateJobCard(this.state.jobcard)
                .then(result => {

                    if(result.Success === 'Ok')
                    {
                        let flags = {...this.state.flags};
                        flags.isAdd = false;
                        flags.isEdit = false;
                        
                        let formProcess = false;
                        let formVisible = true;

                        this.setState({ result, flags, formProcess, formVisible });
                        
                        toast.success('Job Card Updated Successfully.', 
                        {
                            position: toast.POSITION.TOP_RIGHT,
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true
                        });
                    }
                    else
                    {
                        let jobcard = {};
                        let flags = {...this.state.flags};
                        flags.isAdd = false;
                        flags.isEdit = false;

                        let formProcess = false;
                        let formVisible = true;

                        this.setState({ jobcard, flags, result, formProcess, formVisible });

                        toast.error('Job Card was not Updated Successfully!\n'+result.FailReason, 
                        {
                            position: toast.POSITION.TOP_RIGHT,
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true
                        });
                    }

                    buttonsOptions.addButton.showAdd = true;
                    buttonsOptions.editButton.showEdit = true;
                    buttonsOptions.refreshButton.showRefresh = true;
                    this.setState({ buttonsOptions });

                })
                .catch(err => {
                    let jobcard = {};
                    let flags = {...this.state.flags};
                    flags.isAdd = false;
                    flags.isEdit = false;

                    let formProcess = false;
                    let formVisible = true;
                    
                    this.setState({ result: err, jobcard, flags, formProcess, formVisible });
                    toast.error('Error Occured!\n'+err, 
                        {
                            position: toast.POSITION.TOP_RIGHT,
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true
                        });

                    buttonsOptions.addButton.showAdd = true;
                    buttonsOptions.editButton.showEdit = true;
                    buttonsOptions.refreshButton.showRefresh = true;
                    this.setState({ buttonsOptions });
    
                }); 
        }
    };

    handleAdd = () => {
        let jobcard = {...this.state.jobcard};
        let flags = {...this.state.flags};
        let buttonsOptions = {...this.state.buttonsOptions};

        jobcard = {
            jcNumber: '',
            jcDate: '',
            jcDetails: '',
            jcMonth: 1,
            jcYear: 0,
            jcTime: '',
            jcTicketNum: '',
            jcStatus: 'Pending',
            jcPrjName: '',
            jcContName: ''
        }

        flags.isAdd = true;
        flags.isEdit = false;
        buttonsOptions.showEdit = false;
        buttonsOptions.addButton.showAdd = false;
        buttonsOptions.refreshButton.showRefresh = false;


        this.setState({ jobcard, flags, buttonsOptions });
    };

    handleEdit = () => {
        let flags = {...this.state.flags};

        flags.isEdit = true;
        flags.isAdd = false;

        this.setState({ flags });
    };

    handleCancel = () => {
        let flags  = { isAdd: false, isEdit: false };
        let errors = {};
        let buttonsOptions = {...this.state.buttonsOptions};

        buttonsOptions.addButton.showAdd = true;
        buttonsOptions.editButton.showEdit = false;
        buttonsOptions.refreshButton.showRefresh = true;

        this.setState({ flags, errors, buttonsOptions });
    };

    handleChange = (e) => {
        const { name, value } = e.currentTarget;

        let jobcard = {...this.state.jobcard};
        jobcard[name] = value;
        
        this.setState({ jobcard });
    };

    handleJCClick = (c) => {
        getJobCardDoc(c)
            .then(result => {

                if(result.Success === 'Ok')
                {
                    let jobcard = {...result.Result};

                    let buttonsOptions = {...this.state.buttonsOptions};
                    buttonsOptions.editButton.showEdit = true;

                    this.setState({ result });
                    this.setState({ jobcard, buttonsOptions });
                    
                }
                else
                {
                    let jobcard = {};
                    this.setState({ jobcard });
                }
            })
            .catch(err => {
                let jobcard = {};
                this.setState({ result: err });
                this.setState({ jobcard });
            }); 
    };

    handleRefresh = () => {
        let result = getJobCardList();

        this.setState({ listProcess: true });
        this.setState({ listVisible: false });

        result.then((returnedresult) => { 
                let jobcards = returnedresult.Result.filter(jc => jc.jcStatus === 'Pending');
                let displayJC = [...jobcards];
                this.setState({ jobcards, displayJC });
                let jobcard = {...this.state.jobcard};
                let buttonsOptions = {...this.state.buttonsOptions};
                
                jobcard = {
                    jcNumber: '',
                    jcDate: '',
                    jcDetails: '',
                    jcMonth: 1,
                    jcYear: 0,
                    jcTime: '',
                    jcTicketNum: '',
                    jcStatus: 'Pending',
                    jcPrjName: '',
                    jcContName: ''
                };
        
                buttonsOptions.addButton.showAdd = true;
                buttonsOptions.editButton.showEdit = false;
                buttonsOptions.refreshButton.showRefresh = true;
                buttonsOptions.deleteButton.showDelete = false;
                
                this.setState({ listProcess: false, listVisible: true, jobcard, buttonsOptions, searchValue: '' });
                this.setState({ result: returnedresult });
                
                return returnedresult;
             })
            .catch((err) => {
                let jobcard = {...this.state.jobcard};
                
                jobcard = {
                    jcNumber: '',
                    jcDate: '',
                    jcDetails: '',
                    jcMonth: 1,
                    jcYear: 0,
                    jcTime: '',
                    jcTicketNum: '',
                    jcStatus: 'Pending',
                    jcPrjName: '',
                    jcContName: ''
                };
        
                this.setState({ listProcess: false, 
                                listVisible: true, 
                                jobcard, 
                                jobcards: [],
                                result: err,
                                showmodal: true });
                
                return err 
            });
        
    };

    validateFields = () => {
        let errors = {};

        let result = Joi.validate(this.state.jobcard, this.schema, { abortEarly: false });
        
        if(!result.error) return null;

        for(let item of result.error.details)
            errors[item.path[0]] = item.message;

        if(Object.keys(errors).length === 0) return null;
        return errors;
    };

    async componentDidMount() {
        let result = getJobCardList();
        
        getTicketsList()
            .then(result => {
                let tickets = [];
                result.Result.map(r => {
                    tickets.push({Name: r.ticketNumber});
                });
                this.setState({ tickets });
            })
            .catch(error => {
                console.log(error);

            });

        getProjectsList()
            .then(result => {
                let projects = [];
                result.Result.map(r => {
                    projects.push({Name: r.name});
                })
                this.setState({ projects });
            })
            .catch(error => {
                console.log(error);
            });

        this.setState({ listProcess: true });
        this.setState({ listVisible: false });

        result.then((returnedresult) => { 
                let jobcards = [...returnedresult.Result];
                jobcards = jobcards.filter(jc => {
                    return jc.jcStatus === 'Pending';
                });
                let displayJC = [...jobcards];

                this.setState({ jobcards, displayJC });
            
                this.setState({ result: returnedresult });
                this.setState({ listProcess: false });
                this.setState({ listVisible: true });
                
                return returnedresult;
             })
            .catch((err) => {
                this.setState({ jobcards: [] });
                this.setState({ result: err });
                this.setState({ listProcess: false });
                this.setState({ listVisible: true });
                this.setState({ showmodal: true });
                
                return err 
            });

    };

    constructor(props)
    {
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
    }

    render() {
        return (
            <React.Fragment>
                <TitlePageHeader title="Maintenance Job Cards" bgColor="white" color="gray" />
                <div className="col-md-3 leftCol" >
                    <ToolsBar 
                        buttonsOptions={this.state.buttonsOptions} onSearchValueChange={this.handleSearchValueChange} />
                    <ItemsList 
                        data={this.state.displayJC} 
                        name="jcNumber" 
                        label="jcNumber" 
                        value="jcNumber" 
                        showProcess={this.state.listProcess}
                        showList={this.state.listVisible}
                        onClick={this.handleJCClick}
                        />
                </div>
                <div className="col-md-9 rightCol">
                    <MainJCForm 
                        onChange={this.handleChange}
                        onSubmit={this.handleSubmit}
                        onCancel={this.handleCancel} 
                        data={this.state.jobcard} 
                        flags={this.state.flags}
                        errors={this.state.errors}
                        showProcess={this.state.formProcess}
                        showButtons={this.state.formVisible}
                        projects={this.state.projects}
                        contracts={this.state.contracts}
                        tickets={this.state.tickets} />
                </div>
                {/* <Modal show={this.state.showmodal} onHide={this.handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <pre>
                            {this.state.result.Error}
                        </pre>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.handleCloseModal}>Close</Button>
                    </Modal.Footer>
                </Modal> */}
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnVisibilityChange
                    draggable
                    pauseOnHover
                />
            </React.Fragment>
        );
    }
}

export default MainJobCards;