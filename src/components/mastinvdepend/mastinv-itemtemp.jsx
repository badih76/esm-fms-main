import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Joi from 'joi-browser';
import { ToastContainer, toast } from 'react-toastify';

import ToolsBar from '../../common/toolsbar';
import '../../css/mastcc-inqcat.css';
import MastInvICForm from './mastinv-icform';

import { addEquipmentTemplate, updateEquipTemplate, getEquipTemplate, 
         getEquipTemplatesList, addSPTemplate, updateSPTemplate,
         getSPTemplate, getSPTemplatesList, getCategList } from '../../appcode/mastinvdepend';

import ItemsList from '../../common/itemslist';
import MastInvTempForm from './mastinv-tempform';

class MastInvTemplates extends Component {

    state = {
        templates: [],
        equipTemp: {
            Name: '',
            Description: '',
            SerialNum: '',
            Categ1: '',
            Categ2: '',
            PurchDate: new Date,
            PurchVal: 0
        },

        template: {},
        
        spartTemp: {
            Name: '',
            Description: '',
            SerialNum: '',
            Categ1: '',
            Categ2: '',
            Quantity: 0,
            UPCNum: ""
        },
        
        selectedType: '',
        categories: [],

        result: {},

        types: [
            {
                tempType: "Equipment",
            },
            {
                tempType: "Spare Part"
            }
        ],

        typesButtonsOptions: {
            addButton: {
                showAdd: false,
                onAdd: null
            },
            editButton: {
                showEdit: false,
                onEdit: null
            },
            deleteButton: {
                showDelete: false,
                onDelete: null
            },
            refreshButton: {
                showRefresh: false,
                onRefresh: null
            },
            searchButton: {
                showSearch: false,
                onSearch: null
            },

            btnPlaceHolder: true,
            searchPlaceHolder: true 
        },

        tempButtonsOptions: {
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
            },

            btnPlaceHolder: false,
            searchPlaceHolder: false 

        },

        listProcess: false,
        listVisible: true,
        
        formProcess: false,
        formVisible: true,

        flags: {
            isAdd: false,
            isEdit: false
        },

        showmodal: false,

        errors: {},

        formDivHeight: ""
    };

    schema = {
        equipTemp: {
            Description: Joi.string()
                            .regex(/^[a-zA-Z0-9\s\_\-]+$/, {name: "No Special Chars"})
                            .label('Category Description'),
            SerialNum: Joi.string()
                          .regex(/^$|^[a-zA-Z0-9\s\_\-]+$/, {name: "No Special Chars"})
                          .label('Serial Number').valid(''),
            Categ1: Joi.string().label('Category 1'),
            Categ2: Joi.string().label('Category 2').valid(''),
            Name: Joi.string().required()
                     .regex(/^[a-zA-Z0-9\s\_\-]+$/, {name: "No Special Chars"})
                     .label('Category Name'),
            PurchDate: Joi.date().required()
                          .label('Purchase Date'),
            PurchVal: Joi.number().min(0)
                         .precision(3).label('Purchase Value')
        },
        spartTemp: {
            Name: Joi
                .string().required()
                .regex(/^[a-zA-Z0-9\s\_\-]+$/, {name: "No Special Chars"})
                .label('Category Name'),
            Description: Joi
                .string()
                .regex(/^[a-zA-Z0-9\s\_\-]+$/, {name: "No Special Chars"})
                .label('Category Description'),
            Categ1: Joi.string().label('Category 1'),
            Categ2: Joi.string().label('Category 2').valid(''),
            Quantity: Joi.number().integer().min(0).label('Items Quantity'),
            UPCNum: Joi.string().label('Unique Product Code').valid('')
        }
        
    };

    constructor(props) {
        super(props);

        this.leftColRef = React.createRef();
        this.leftMiddleRef = React.createRef();
        this.formColRef = React.createRef();
    
    }

    handleTypeClick = (t) => {
        // set the selected type...
        let selectedType = t;
        
        this.setState({ 
                        selectedType, 
                        listProcess: true,
                        listVisible: false
                    });

        if(selectedType === 'Equipment')
        {
            // get equipment templates list...
            getEquipTemplatesList()
                .then(result => {
                    // successful retrieve of equip templates list...
                    const template = {...this.state.equipTemp};
                    this.setState({ templates: result.Result,
                                    result,
                                    listProcess: false, 
                                    listVisible: true,
                                    template 
                                });

                })
                .catch(err => {
                    const template = {};

                    this.setState({ templates: [],
                                    result: err,
                                    listProcess: false,
                                    listVisible: true,
                                    showmodal: true,
                                    template
                                 });
                    
                });
        }
        else
        {
            // get equipment templates list...
            getSPTemplatesList()
                .then(result => {
                    // successful retrieve of SP templates list...
                    const template = {...this.state.spartTemp};

                    this.setState({ templates: result.Result,
                                    result,
                                    listProcess: false,
                                    listVisible: true,
                                    template 
                                });

                })
                .catch(err => {
                    const template = {};

                    this.setState({ templates: [],
                                    result: err,
                                    listProcess: false,
                                    listVisible: true,
                                    showmodal: true,
                                    template 
                                });
                    
                });
        }
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

        let formProcess = true;
        let formVisible = false;

        this.setState({ formProcess, formVisible });

        if(errors) {
            let formProcess = false;
            let formVisible = true;

            this.setState({ formProcess, formVisible });
            
            toast.warn("Some data fields are invalid.\nPlease recheck entered fields!",
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

        if(this.state.flags.isAdd)
        {
            const { selectedType, template } = this.state;

            let addResult = selectedType === 'Equipment' ? addEquipmentTemplate(template) : addSPTemplate(template);

            // Adding a new template...
            addResult.then(result => {

                    if(result.Success === 'Ok')
                    {
                        let flags = {...this.state.flags};
                        let templates = [...this.state.templates];

                        flags.isAdd = false;
                        flags.isEdit = false;
                                                
                        templates.push(template);

                        let formProcess = false;
                        let formVisible = true;
                
                        this.setState({ result, flags, templates, formProcess, formVisible });

                        toast.success("New Inventory Template saved successfully...",
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
                        let template = {};
                        let flags = {...this.state.flags};
                        flags.isAdd = false;
                        flags.isEdit = false;

                        let formProcess = false;
                        let formVisible = true;

                        this.setState({ template, flags, result, formProcess, formVisible });
                        toast.warn("New Inventory Template was not saved successfully!\n" + result.FailReason,
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
                    let template = {};
                    let flags = {...this.state.flags};
                    flags.isAdd = false;
                    flags.isEdit = false;

                    let formProcess = false;
                    let formVisible = true;
            
                    this.setState({ result: err, template, flags, formProcess, formVisible });
                    
                    toast.error("Error occured:\n" + err.message,
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
            // Updating existing template...
            const { selectedType, template } = this.state;

            let updateResult = selectedType === 'Equipment' ? updateEquipTemplate(template) : updateSPTemplate(template);

            updateResult.then(result => {

                    if(result.Success === 'Ok')
                    {
                        let flags = {...this.state.flags};
                        flags.isAdd = false;
                        flags.isEdit = false;
                        
                        let formProcess = false;
                        let formVisible = true;

                        this.setState({ result, flags, formProcess, formVisible });
                        
                        toast.success("Inventory Template updated successfully...",
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
                        let template = {};
                        let flags = {...this.state.flags};
                        flags.isAdd = false;
                        flags.isEdit = false;

                        let formProcess = false;
                        let formVisible = true;

                        this.setState({ template, flags, result, formProcess, formVisible });

                        toast.warn("Inventory Template was not updated successfully!\n"+ result.FailReason,
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
                    let template = {};
                    let flags = {...this.state.flags};
                    flags.isAdd = false;
                    flags.isEdit = false;

                    let formProcess = false;
                    let formVisible = true;
                    
                    this.setState({ result: err, template, flags, formProcess, formVisible });
                    
                    toast.error("Error occured:\n" + err.message,
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
        let template = this.state.selectedType === 'Equipment' ? {...this.state.equipTemp} : {...this.state.spartTemp};
        let flags = {...this.state.flags};
        let buttonsOptions = {...this.state.tempButtonsOptions};

        let d = new Date();
        template.PurchDate = d.getFullYear()
                        +'-'+ ("0"+( d.getMonth()+1)).slice(-2)
                        +'-'+ ("0" + d.getDate()).slice(-2);
        console.log("PurchDate: ", template.PurchDate);
        flags.isAdd = true;
        flags.isEdit = false;
        buttonsOptions.showEdit = false;


        this.setState({ template, flags, tempButtonsOptions: buttonsOptions });
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

        console.log(name, value);
        let template = {...this.state.template};
        template[name] = value;
        
        this.setState({ template });
    };

    handleTemplateClick = (t) => {
        // Check the Type of the template...
        if(this.state.selectedType === 'Equipment')
        {
            getEquipTemplate(t)
                .then(result => {

                    if(result.Success === 'Ok')
                    {
                        let template = {...this.state.template};
                        const { Result } = result;

                        template.Name = Result.Name;
                        template.Description = Result.Description;
                        template.SerialNum = Result.SerialNum;
                        template.Categ1 = Result.Categ1;
                        template.Categ2 = Result.Categ2;
                        template.PurchDate = Result.PurchDate;
                        template.PurchVal = Result.PurchVal;

                        let tempButtonsOptions = {...this.state.tempButtonsOptions};
                        tempButtonsOptions.editButton.showEdit = true;

                        this.setState({ result });
                        this.setState({ template, tempButtonsOptions });
                        
                    }
                    else
                    {
                        let template = {};
                        this.setState({ template });
                    }
                })
                .catch(err => {
                    let template = {};
                    this.setState({ result: err });
                    this.setState({ template });
                });
        }
        else
        {
            getSPTemplate(t)
                .then(result => {

                    if(result.Success === 'Ok')
                    {
                        let template = {...this.state.template};
                        const { Result } = result;

                        template.Name = Result.Name;
                        template.Description = Result.Description;
                        template.SerialNum = Result.SerialNum;
                        template.Categ1 = Result.Categ1;
                        template.Categ2 = Result.Categ2;
                        template.Quantity = Result.Quantity;
                        template.UPCNum = Result.UPCNum;

                        let tempButtonsOptions = {...this.state.tempButtonsOptions};
                        tempButtonsOptions.editButton.showEdit = true;

                        this.setState({ result });
                        this.setState({ template, tempButtonsOptions });
                        
                    }
                    else
                    {
                        let template = {};
                        this.setState({ template });
                    }
                })
                .catch(err => {
                    let template = {};
                    this.setState({ result: err });
                    this.setState({ template });
                });
        }
         
        // console.log(this.formColRef.current.clientHeight);
        // this.setState({ formDivHeight: });
        // this.middleColRef.current.clientHeight = this.formColRef.current.clientHeight;
    };

    handleRefresh = () => {
        // let result = getCategList();

        // this.setState({ listProcess: true });
        // this.setState({ listVisible: false });

        // result.then((returnedresult) => { 
        //         this.setState({ categories: returnedresult.Result });
        //         let category = {...this.state.category};
        //         let buttonsOptions = {...this.state.buttonsOptions};
                
        //         category.Description = '';
        //         category.Name = '';

        //         buttonsOptions.addButton.showAdd = true;
        //         buttonsOptions.editButton.showEdit = false;
        //         buttonsOptions.refreshButton.showRefresh = true;
        //         buttonsOptions.deleteButton.showDelete = false;
                
        //         this.setState({ listProcess: false, listVisible: true, category, buttonsOptions });
        //         this.setState({ result: returnedresult });
                
        //         return returnedresult;
        //      })
        //     .catch((err) => {
        //         let category = {...this.state.category};
        //         category.Description = '';
        //         category.Name = '';

        //         this.setState({ listProcess: false, 
        //                         listVisible: true, 
        //                         category, 
        //                         categories: [],
        //                         result: err,
        //                         showmodal: true });
                
        //         return err 
        //     });
        
    };

    validateFields = () => {
        const { template, selectedType } = this.state;
        const { equipTemp, spartTemp } = this.schema;

        let errors = {};

        let result = Joi.validate(template,
                                 (selectedType === 'Equipment' ? equipTemp : spartTemp),
                                 { abortEarly: false });
        
        if(!result.error) return null;

        for(let item of result.error.details)
            errors[item.path[0]] = item.message;

        if(Object.keys(errors).length === 0) return null;
        return errors;
    };

    
    async componentDidMount() {
        let result = getCategList();

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
                <div className="col-md-2 leftColEx" ref={this.leftColRef}>
                    <ToolsBar 
                        buttonsOptions={this.state.typesButtonsOptions} />
                    <ItemsList 
                        data={this.state.types} 
                        name="tempType" 
                        label="tempType" 
                        value="" 
                        showProcess={false}
                        showList={true}
                        onClick={this.handleTypeClick}
                     />
                </div>
                <div className="col-md-4 middleColEx" 
                     ref={this.middleColRef} >
                    <ToolsBar 
                        buttonsOptions={this.state.tempButtonsOptions} />
                    <ItemsList 
                        data={this.state.templates} 
                        name="Name" 
                        label="Name" 
                        value="Description" 
                        showProcess={this.state.listProcess}
                        showList={this.state.listVisible}
                        onClick={this.handleTemplateClick}
                     />
                </div>
                
                <div className="col-md-6 rightColEx" ref={this.formColRef}>
                    <MastInvTempForm 
                        onChange={this.handleChange}
                        onSubmit={this.handleSubmit}
                        onCancel={this.handleCancel} 
                        data={this.state.template} 
                        categories={this.state.categories}
                        flags={this.state.flags}
                        errors={this.state.errors}
                        showProcess={this.state.formProcess}
                        showButtons={this.state.formVisible}
                        selType={this.state.selectedType} />
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

export default MastInvTemplates;