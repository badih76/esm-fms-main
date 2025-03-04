import React, { Component } from 'react';
import ItemsList from '../../common/itemslist';
import ToolsBar from '../../common/toolsbar';
import MastPrjServForm from './mastprjsrvform';
import _ from 'lodash';

import { getPrjServices, getPrjServicesDoc,
         addPrjService, updatePrjService } from '../../appcode/mastprjserv';

import Joi from 'joi-browser';
import { TitlePageHeader } from '../titleheader/titleheader';

class MastPrjServices extends Component {

    state = {
        services: [],
        result: {},

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
                onSearch: null
            }
        },

        listProcess: true,
        listVisible: false,
        
        formProcess: false,
        formVisible: true,

        service: {
            Description: "",
            Manning: 0,
            Value: 0
        },

        flags: {
            isAdd: false,
            isEdit: false
        },

        showmodal: false,

        errors: {},

        uprofile: {}
    };

    schema = {
        Description: Joi
                    .string()
                    .required()
                    .regex(/^[a-zA-Z0-9\s\_\-]+$/, {name: "No Special Chars"})
                    .label('Service Description'),
        Manning: Joi
                    .number().integer().min(0).default(0)
                    .label('Service Manning'),
        Value: Joi
                    .number().integer().min(0).default(0)
                    .label('Service Value')
    };

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

        let formProcess = true;
        let formVisible = false;

        this.setState({ formProcess, formVisible });

        if(errors) return;

        if(this.state.flags.isAdd)
        {
            // Adding a new category...
            addPrjService(this.state.service)
                .then(result => {

                    if(result.Success === 'Ok')
                    {
                        let flags = {...this.state.flags};
                        flags.isAdd = false;
                        flags.isEdit = false;
                        
                        let services = [...this.state.services];
                        
                        services.push(this.state.service);

                        services = _.orderBy(services, ["Description"]);

                        console.log(services);
                        

                        let formProcess = false;
                        let formVisible = true;
                
                        this.setState({ result, flags, services, formProcess, formVisible });
                        
                    }
                    else
                    {
                        let service = {};
                        let flags = {...this.state.flags};
                        flags.isAdd = false;
                        flags.isEdit = false;

                        let formProcess = false;
                        let formVisible = true;

                        this.setState({ service, flags, result, formProcess, formVisible });
                    }
                })
                .catch(err => {
                    let service = {};
                    let flags = {...this.state.flags};
                    flags.isAdd = false;
                    flags.isEdit = false;

                    let formProcess = false;
                    let formVisible = true;
            
                    this.setState({ result: err, service, flags, formProcess, formVisible });
                    
                }); 
        }
        else if(this.state.flags.isEdit)
        {
            // Adding a new category...
            updatePrjService(this.state.service)
                .then(result => {

                    if(result.Success === 'Ok')
                    {
                        let flags = {...this.state.flags};
                        flags.isAdd = false;
                        flags.isEdit = false;
                        
                        let formProcess = false;
                        let formVisible = true;

                        this.setState({ result, flags, formProcess, formVisible });
                        
                    }
                    else
                    {
                        let service = {};
                        let flags = {...this.state.flags};
                        flags.isAdd = false;
                        flags.isEdit = false;

                        let formProcess = false;
                        let formVisible = true;

                        this.setState({ service, flags, result, formProcess, formVisible });
                    }
                })
                .catch(err => {
                    let service = {};
                    let flags = {...this.state.flags};
                    flags.isAdd = false;
                    flags.isEdit = false;

                    let formProcess = false;
                    let formVisible = true;
                    
                    this.setState({ result: err, service, flags, formProcess, formVisible });
                    
                }); 
        }
    };

    handleAdd = () => {
        let service = {...this.state.service};
        let flags = {...this.state.flags};
        let buttonsOptions = {...this.state.buttonsOptions};

        service.Description = "";
        service.Manning = 0;
        service.Value = 0;

        flags.isAdd = true;
        flags.isEdit = false;
        buttonsOptions.showEdit = false;


        this.setState({ service, flags, buttonsOptions });
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

        this.setState({ flags, errors });
    };

    handleChange = (e) => {
        const { name, value } = e.currentTarget;

        let service = {...this.state.service};
        service[name] = value;
        
        this.setState({ service });
    };

    handleServiceClick = (c) => {
        getPrjServicesDoc(c)
            .then(result => {

                if(result.Success === 'Ok')
                {
                    let service = {...result.Result};

                    console.log(service);
                    let buttonsOptions = {...this.state.buttonsOptions};
                    buttonsOptions.editButton.showEdit = true;

                    this.setState({ result });
                    this.setState({ service, buttonsOptions });
                    
                }
                else
                {
                    let service = {};
                    this.setState({ service });
                }
            })
            .catch(err => {
                let service = {};
                this.setState({ result: err });
                this.setState({ service });
            }); 
    };

    handleRefresh = () => {
        let result = getPrjServices();

        this.setState({ listProcess: true });
        this.setState({ listVisible: false });

        result.then((returnedresult) => { 
                this.setState({ services: returnedresult.Result });
                let service = {...this.state.service};
                let buttonsOptions = {...this.state.buttonsOptions};
                
                service.Description = '';
                service.Manning = 0;
                service.Value = 0;

                buttonsOptions.addButton.showAdd = true;
                buttonsOptions.editButton.showEdit = false;
                buttonsOptions.refreshButton.showRefresh = true;
                buttonsOptions.deleteButton.showDelete = false;
                
                this.setState({ listProcess: false, listVisible: true, service, buttonsOptions });
                this.setState({ result: returnedresult });
                
                return returnedresult;
             })
            .catch((err) => {
                let service = {...this.state.service};
                service.Description = '';
                service.Manning = 0;
                service.Value = 0;

                this.setState({ listProcess: false, 
                                listVisible: true, 
                                service, 
                                services: [],
                                result: err,
                                showmodal: true });
                
                return err 
            });
        
    };

    validateFields = () => {
        let errors = {};

        let result = Joi.validate(this.state.service, this.schema, { abortEarly: false });
        
        if(!result.error) return null;

        for(let item of result.error.details)
            errors[item.path[0]] = item.message;

        if(Object.keys(errors).length === 0) return null;
        return errors;
    };

    
    async componentDidMount() {
        let result = getPrjServices();

        this.setState({ listProcess: true });
        this.setState({ listVisible: false });

        result.then((returnedresult) => { 
                this.setState({ services: returnedresult.Result });
            
                this.setState({ result: returnedresult });
                this.setState({ listProcess: false });
                this.setState({ listVisible: true });
                
                return returnedresult;
             })
            .catch((err) => {
                this.setState({ services: [] });
                this.setState({ result: err });
                this.setState({ listProcess: false });
                this.setState({ listVisible: true });
                this.setState({ showmodal: true });
                
                return err 
            });

    };

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
    };

    render() {
        return (
            <React.Fragment>
                <TitlePageHeader title="Contracts Services Master Setting" bgColor="white" color="gray" />
                <div className="col-md-3 leftCol" >
                    <ToolsBar 
                        buttonsOptions={this.state.buttonsOptions} />
                    <ItemsList 
                        data={this.state.services} 
                        name="Description" 
                        label="Description" 
                        value="Description" 
                        showProcess={this.state.listProcess}
                        showList={this.state.listVisible}
                        onClick={this.handleServiceClick}
                        />
                </div>
                <div className="col-md-9 rightCol">
                    <MastPrjServForm 
                        onChange={this.handleChange}
                        onSubmit={this.handleSubmit}
                        onCancel={this.handleCancel} 
                        data={this.state.service} 
                        flags={this.state.flags}
                        errors={this.state.errors}
                        showProcess={this.state.formProcess}
                        showButtons={this.state.formVisible} />
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
            </React.Fragment>
        );
    }
}

export default MastPrjServices;