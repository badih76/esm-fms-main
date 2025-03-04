import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Joi from 'joi-browser';
import _ from 'lodash';
import { toast, ToastContainer } from 'react-toastify';

import ToolsBar from '../../common/toolsbar';
import '../../css/mastcc-inqcat.css';
import MastCCICForm from './mastcc-ic-form';

import { getInquiriesCategories, getCompCateg, addNewCompCateg, updateCompCateg } from '../../appcode/mastcustcare';
import ItemsList from '../../common/itemslist';

class MastCCInqCat extends Component {

    state = {
        categories: [],
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

        category: {
            categname: "",
            categdesc: ""
        },

        flags: {
            isAdd: false,
            isEdit: false
        },

        showmodal: false,

        errors: {}
    };

    schema = {
        categname: Joi
                    .string()
                    .required()
                    .regex(/^[a-zA-Z0-9\s\_\-]+$/, {name: "No Special Chars"})
                    .label('Category Name'),
        categdesc: Joi
                    .string()
                    .regex(/^[a-zA-Z0-9\s\_\-\.\&\+\:\,]+$/, {name: "No Special Chars"})
                    .label('Category Description')
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

        if(errors) 
        {
            let formProcess = false;
            let formVisible = true;
            this.setState({ formProcess, formVisible });
            return
        };

        if(this.state.flags.isAdd)
        {
            // Adding a new category...
            addNewCompCateg(this.state.category)
                .then(result => {

                    if(result.Success === 'Ok')
                    {
                        let flags = {...this.state.flags};
                        flags.isAdd = false;
                        flags.isEdit = false;
                        
                        let categories = [...this.state.categories];
                        let newCategory = {...categories[0]};
                        newCategory.categName = this.state.category.categname;
                        newCategory.categDescription = this.state.category.categdesc;

                        categories.push(newCategory);
                        categories = _.orderBy(categories, 'categName');

                        let formProcess = false;
                        let formVisible = true;
                
                        this.setState({ result, flags, categories, formProcess, formVisible });
                        
                        toast.success('New Customer Care Category Saved Successfully...',
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
                        let category = {};
                        let flags = {...this.state.flags};
                        flags.isAdd = false;
                        flags.isEdit = false;

                        let formProcess = false;
                        let formVisible = true;

                        this.setState({ category, flags, result, formProcess, formVisible });

                        toast.warn("Category was not saved Successfully...\n" + result.FailReason,
                        {
                            position: toast.POSITION.TOP_RIGHT,
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true
                        });
                    }
                })
                .catch(err => {
                    let category = {};
                    let flags = {...this.state.flags};
                    flags.isAdd = false;
                    flags.isEdit = false;

                    let formProcess = false;
                    let formVisible = true;
            
                    this.setState({ result: err, category, flags, formProcess, formVisible });
                    
                    toast.error("Error occured: \n" + err.message,
                        {
                            position: toast.POSITION.TOP_RIGHT,
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true
                        });
                }); 
        }
        else if(this.state.flags.isEdit)
        {
            // Adding a new category...
            updateCompCateg(this.state.category)
                .then(result => {

                    if(result.Success === 'Ok')
                    {
                        let flags = {...this.state.flags};
                        flags.isAdd = false;
                        flags.isEdit = false;
                        
                        let formProcess = false;
                        let formVisible = true;

                        this.setState({ result, flags, formProcess, formVisible });
                        
                        toast.success('Customer Care Category updated Successfully...',
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
                        let category = {};
                        let flags = {...this.state.flags};
                        flags.isAdd = false;
                        flags.isEdit = false;

                        let formProcess = false;
                        let formVisible = true;

                        this.setState({ category, flags, result, formProcess, formVisible });

                        toast.warn("Customer Care Category was not updated Successfully...\n" + result.FailReason,
                        {
                            position: toast.POSITION.TOP_RIGHT,
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true
                        });
                    }
                })
                .catch(err => {
                    let category = {};
                    let flags = {...this.state.flags};
                    flags.isAdd = false;
                    flags.isEdit = false;

                    let formProcess = false;
                    let formVisible = true;
                    
                    this.setState({ result: err, category, flags, formProcess, formVisible });
                    
                    toast.error("Error occured: \n" + err.message,
                        {
                            position: toast.POSITION.TOP_RIGHT,
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true
                        });
                }); 
        }
    };

    handleAdd = () => {
        let category = {...this.state.category};
        let flags = {...this.state.flags};
        let buttonsOptions = {...this.state.buttonsOptions};

        category.categname = "";
        category.categdesc = "";

        flags.isAdd = true;
        flags.isEdit = false;
        buttonsOptions.showEdit = false;


        this.setState({ category, flags, buttonsOptions });
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
        let category = {...this.state.category};
        category.categname = '';
        category.categdesc = '';

        this.setState({ flags, errors, category });
    };

    handleChange = (e) => {
        const { name, value } = e.currentTarget;

        let category = {...this.state.category};
        category[name] = value;
        
        this.setState({ category });
    };

    handleCategClick = (c) => {
        getCompCateg(c)
            .then(result => {

                if(result.Success === 'Ok')
                {
                    let category = {};

                    category.categname = result.Result.categName;
                    category.categdesc = result.Result.categDescription;

                    let buttonsOptions = {...this.state.buttonsOptions};
                    buttonsOptions.editButton.showEdit = true;

                    this.setState({ result });
                    this.setState({ category, buttonsOptions });
                    
                }
                else
                {
                    let category = {};
                    this.setState({ category });
                }
            })
            .catch(err => {
                let category = {};
                this.setState({ result: err });
                this.setState({ category });
            }); 
    };

    handleRefresh = () => {
        let result = getInquiriesCategories();

        this.setState({ listProcess: true });
        this.setState({ listVisible: false });

        result.then((returnedresult) => { 
                this.setState({ categories: returnedresult.Result });
                let category = {...this.state.category};
                let buttonsOptions = {...this.state.buttonsOptions};
                
                category.categdesc = '';
                category.categname = '';

                buttonsOptions.addButton.showAdd = true;
                buttonsOptions.editButton.showEdit = false;
                buttonsOptions.refreshButton.showRefresh = true;
                buttonsOptions.deleteButton.showDelete = false;
                
                this.setState({ listProcess: false, listVisible: true, category, buttonsOptions });
                this.setState({ result: returnedresult });
                
                return returnedresult;
             })
            .catch((err) => {
                let category = {...this.state.category};
                category.categdesc = '';
                category.categname = '';

                this.setState({ listProcess: false, 
                                listVisible: true, 
                                category, 
                                categories: [],
                                result: err,
                                showmodal: true });
                
                return err 
            });
        
    };

    validateFields = () => {
        let errors = {};

        let result = Joi.validate(this.state.category, this.schema, { abortEarly: false });
        
        if(!result.error) return null;

        for(let item of result.error.details)
            errors[item.path[0]] = item.message;

        if(Object.keys(errors).length === 0) return null;
        
        toast.warn("Some data fields are invalid.\nPlease recheck entered fields!",
                {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });

        return errors;

    };

    
    async componentDidMount() {
        let result = getInquiriesCategories();

        this.setState({ listProcess: true });
        this.setState({ listVisible: false });

        result.then((returnedresult) => { 
                this.setState({ categories: returnedresult.Result });
            
                this.setState({ result: returnedresult });
                this.setState({ listProcess: false });
                this.setState({ listVisible: true });
                
                return returnedresult;
             })
            .catch((err) => {
                this.setState({ categories: [] });
                this.setState({ result: err });
                this.setState({ listProcess: false });
                this.setState({ listVisible: true });
                this.setState({ showmodal: true });
                
                return err 
            });

    };


    render() {

        return (
            <div className="container" style={{marginTop: "20px"}}>
                <div className="col-md-3 leftCol" >
                    <ToolsBar 
                        buttonsOptions={this.state.buttonsOptions} />
                    <ItemsList 
                        data={this.state.categories} 
                        name="categName" 
                        label="categName" 
                        value="categDescription" 
                        showProcess={this.state.listProcess}
                        showList={this.state.listVisible}
                        onClick={this.handleCategClick}
                     />
                </div>
                <div className="col-md-9 rightCol">
                    <MastCCICForm 
                        onChange={this.handleChange}
                        onSubmit={this.handleSubmit}
                        onCancel={this.handleCancel} 
                        data={this.state.category} 
                        flags={this.state.flags}
                        errors={this.state.errors}
                        showProcess={this.state.formProcess}
                        showButtons={this.state.formVisible} />
                </div>
                <Modal show={this.state.showmodal} onHide={this.handleCloseModal}>
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
                </Modal>
                <ToastContainer />
            </div>
        );
    }
};

export default MastCCInqCat;