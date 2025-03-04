import React, { Component } from 'react';
import { TitlePageHeader } from '../titleheader/titleheader';
import Input, { DropDownList, TextArea } from '../../common/input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ServiceRow from './servicerow';
import ToolsBar from '../../common/toolsbar';
import {ToastContainer, toast } from 'react-toastify';
import Joi from 'joi-browser';

import processing from '../../images/processing.gif';

import { getServicesList, getProjectsList, 
         getProjectsContractsList, getProjectsContractDoc,
         addContract, updateContract } from '../../appcode/contractdefinition';

class ContractDef extends Component {
   state={
      projectsList: [],
      selectedProject: '',
      selectedContract: '',
      contractsList: [],
      servicesList: [],
      contract: {
         Description: '',
         ProjectName: '',
         Services: [],
         contCode: '',
         contName: '',
         contactEmails: '',
         contactPerson: '',
         effectDate: '',
         expiryDate: '',
         prjCode: ''
      },
      service: {
         serviceName: '',
         subcontracted: false,
         subcontValue: 0,
         manfeestype: '',
         manfeesvalue: 0,
         manPower: 0,
         quotedValue: 0,
         remarks: ''
      },
      errors: {},
      formProcess: false,
      formVisible: true,
      flags: {
         isAdd: false,
         isEdit: false
      },

      buttonsOptions: {
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
         saveButton: {
            showSave: false,
            onSave: () => this.handleOnSubmit()
         },
         cancelButton: {
            showCancel: false,
            onCancel: () => this.handleOnCancel()
         }

      },
      TopButtonsOptions: {
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
             showRefresh: false,
             onRefresh: () => this.handleRefresh()
         },
         searchButton: {
             showSearch: false,
             onSearch: null
         }
      },
      uprofile: {}
   }

   schema = {
      Description: Joi
                  .string()
                  .optional()
                  .allow("")
                  .regex(/^[a-zA-Z0-9\s\_\-\.\&\:\,]+$/, {name: "No Special Chars"})
                  .label('Contract Description'),
      ProjectName: Joi
                  .string().required()
                  .label('Project Name'),
      Services: Joi.any().label('Contract Services List'),
      contCode: Joi
               .string()
               .regex(/^[a-zA-Z0-9\s\_\-]+$/, {name: "No Special Chars"})
               .label('Contract Code'),
      contName: Joi
               .string()
               .regex(/^[a-zA-Z0-9\s\_\-]+$/, {name: "No Special Chars"})
               .label('Contract Name'),
      contactEmails: Joi
                  .string()
                  .regex(/^[a-zA-Z0-9\s\_\-\@\.]+$/, {name: "No Special Chars"})
                  .label("Contact Person's Email Address"),
      contactPerson: Joi
                  .string()
                  .regex(/^[a-zA-Z0-9\s\_\-]+$/, {name: "No Special Chars"})
                  .label("Contact Person's Name"),
      effectDate: Joi
                  .string()
                  .label('Contract Effective Date'),
      expiryDate: Joi
                  .string()
                  .label('Contract Effective Date'),
      prjCode:    Joi.string().optional().allow('').label('Project Code')
      // serviceName: Joi
      //             .string()
      //             .required()
      //             .label('Service Name'),
      // subcontracted: Joi.boolean().allow(false),
      // subcontValue: Joi.number().positive().optional().allow(0).label('Subcontract Value'),
      // manfeestype: Joi.string().label('Subcontract Type'),
      // manfeesvalue: Joi.number().positive().label('Management Fees Value'),
      // manPower: Joi.number().integer().positive().label('Manpower Value'),
      // quotedValue: Joi.number().positive().label('Quoted Service Value'),
      // remarks: Joi
      //          .string()
      //          .optional().allow("")
      //          .label('Remarks'),
      // Services: Joi.any()
   };

   validateFields = () => {
      let errors = {};

      let result = Joi.validate(this.state.contract, this.schema, { abortEarly: false });
      
      if(!result.error) return null;

      for(let item of result.error.details)
          errors[item.path[0]] = item.message;

      if(Object.keys(errors).length === 0) return null;
      return errors;
  };

   handleAdd = () => {
      let contract = {
         Description: '',
         ProjectName: this.state.selectedProject,
         Services: [],
         contCode: '',
         contName: '',
         contactEmails: '',
         contactPerson: '',
         effectDate: '',
         expiryDate: '',
         prjCode: ''
      };

      // hide the top buttons...
      let TopButtonsOptions = {...this.state.TopButtonsOptions};
      TopButtonsOptions.addButton.showAdd = false;
      TopButtonsOptions.editButton.showEdit = false;

      // show the bottom buttons...
      let buttonsOptions = {...this.state.buttonsOptions};
      buttonsOptions.saveButton.showSave = true;
      buttonsOptions.cancelButton.showCancel = true;

      let flags = {...this.state.flags};
      flags.isAdd = true;
      flags.isEdit = false;

      this.setState({ contract, flags, TopButtonsOptions, buttonsOptions });
   }

   handleOnSubmit = () => {
      let errors = this.validateFields();
      this.setState({ errors: errors || {} });

      let formProcess = true;
      let formVisible = false;

      this.setState({ formProcess, formVisible });

      if(errors) 
      {
         console.log(errors);
         let formProcess = false;
         let formVisible = true;

         this.setState({ formProcess, formVisible });

         toast.error(errors, 
            {
               position: toast.POSITION.TOP_RIGHT,
               autoClose: 10000,
               hideProgressBar: false,
               closeOnClick: true,
               pauseOnHover: true,
               draggable: true
            });

   
         return;
      }

      if(this.state.flags.isAdd)
      {
          // Adding a new contract...
          addContract(this.state.contract.ProjectName, this.state.contract)
              .then(result => {

                  if(result.Success === 'Ok')
                  {
                      let flags = {...this.state.flags};
                      flags.isAdd = false;
                      flags.isEdit = false;
                         
                      let formProcess = false;
                      let formVisible = true;
              
                      this.setState({ result, flags, formProcess, formVisible });
                      
                      toast.success('New Contract Saved Successfully.', 
                      {
                          position: toast.POSITION.TOP_RIGHT,
                          autoClose: 5000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true
                      });

                      // hide the top buttons
                      let TopButtonsOptions = {...this.state.TopButtonsOptions};
                      TopButtonsOptions.addButton.showAdd = true;
                      TopButtonsOptions.editButton.showEdit = true;

                      // show the bottom buttons
                      let buttonsOptions = {...this.state.buttonsOptions};
                      buttonsOptions.saveButton.showSave = false;
                      buttonsOptions.cancelButton.showCancel = false;

                      this.setState({ TopButtonsOptions, buttonsOptions });
                  }
                  else
                  {
                      let contract = {};
                      let flags = {...this.state.flags};
                      flags.isAdd = false;
                      flags.isEdit = false;

                      let formProcess = false;
                      let formVisible = true;

                      this.setState({ contract, flags, result, formProcess, formVisible });

                      toast.error('New Job Card was not Saved Successfully!\n'+result.FailReason, 
                      {
                          position: toast.POSITION.TOP_RIGHT,
                          autoClose: 5000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true
                      });

                      // hide the top buttons
                      let TopButtonsOptions = {...this.state.TopButtonsOptions};
                      TopButtonsOptions.addButton.showAdd = true;
                      TopButtonsOptions.editButton.showEdit = true;

                      // show the bottom buttons
                      let buttonsOptions = {...this.state.buttonsOptions};
                      buttonsOptions.saveButton.showSave = false;
                      buttonsOptions.cancelButton.showCancel = false;

                      this.setState({ TopButtonsOptions, buttonsOptions });
                  }
              })
              .catch(err => {
                  let contract = {};
                  let flags = {...this.state.flags};
                  flags.isAdd = false;
                  flags.isEdit = false;

                  let formProcess = false;
                  let formVisible = true;
          
                  this.setState({ errors: err, contract, flags, formProcess, formVisible });
                  toast.error('Error occured!\n'+err, 
                      {
                          position: toast.POSITION.TOP_RIGHT,
                          autoClose: 5000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true
                      });

                  // hide the top buttons
                  let TopButtonsOptions = {...this.state.TopButtonsOptions};
                  TopButtonsOptions.addButton.showAdd = true;
                  TopButtonsOptions.editButton.showEdit = true;

                  // show the bottom buttons
                  let buttonsOptions = {...this.state.buttonsOptions};
                  buttonsOptions.saveButton.showSave = false;
                  buttonsOptions.cancelButton.showCancel = false;

                  this.setState({ TopButtonsOptions, buttonsOptions });
              }); 
      }
      else if(this.state.flags.isEdit)
      {
         // Updating existing contract...
         updateContract(this.state.contract.ProjectName, this.state.contract)
            .then(result => {

               console.log(result);
               
               if(result.Success === 'Ok')
               {
                  let flags = {...this.state.flags};
                  flags.isAdd = false;
                  flags.isEdit = false;
                     
                  let formProcess = false;
                  let formVisible = true;
            
                  this.setState({ result, flags, formProcess, formVisible });
                  
                  toast.success('New Contract Saved Successfully.', 
                  {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true
                  });

                  // hide the top buttons
                  let TopButtonsOptions = {...this.state.TopButtonsOptions};
                  TopButtonsOptions.addButton.showAdd = true;
                  TopButtonsOptions.editButton.showEdit = true;

                  // show the bottom buttons
                  let buttonsOptions = {...this.state.buttonsOptions};
                  buttonsOptions.saveButton.showSave = false;
                  buttonsOptions.cancelButton.showCancel = false;

                  this.setState({ TopButtonsOptions, buttonsOptions });
               }
               else
               {
                  let contract = {};
                  let flags = {...this.state.flags};
                  flags.isAdd = false;
                  flags.isEdit = false;

                  let formProcess = false;
                  let formVisible = true;

                  this.setState({ contract, flags, result, formProcess, formVisible });

                  toast.error('New Job Card was not Saved Successfully!\n'+result.FailReason, 
                  {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true
                  });

                  // hide the top buttons
                  let TopButtonsOptions = {...this.state.TopButtonsOptions};
                  TopButtonsOptions.addButton.showAdd = true;
                  TopButtonsOptions.editButton.showEdit = true;

                  // show the bottom buttons
                  let buttonsOptions = {...this.state.buttonsOptions};
                  buttonsOptions.saveButton.showSave = false;
                  buttonsOptions.cancelButton.showCancel = false;

                  this.setState({ TopButtonsOptions, buttonsOptions });
               }
            })
            .catch(err => {
               let contract = {};
               let flags = {...this.state.flags};
               flags.isAdd = false;
               flags.isEdit = false;

               let formProcess = false;
               let formVisible = true;
      
               this.setState({ errors: err, contract, flags, formProcess, formVisible });
               toast.error('Error occured!\n'+err, 
                  {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true
                  });

               // hide the top buttons
               let TopButtonsOptions = {...this.state.TopButtonsOptions};
               TopButtonsOptions.addButton.showAdd = true;
               TopButtonsOptions.editButton.showEdit = true;

               // show the bottom buttons
               let buttonsOptions = {...this.state.buttonsOptions};
               buttonsOptions.saveButton.showSave = false;
               buttonsOptions.cancelButton.showCancel = false;

               this.setState({ TopButtonsOptions, buttonsOptions });
            }); 
      }
   }

   handleOnCancel = () => {
      let contract = {
         Description: '',
         ProjectName: '',
         Services: [],
         contCode: '',
         contName: '',
         contactEmails: '',
         contactPerson: '',
         effectDate: '',
         expiryDate: '',
         prjCode: ''
      };

      this.setState({ contract });

      let flags = {...this.state.flags};
      flags.isAdd = false;
      flags.isEdit = false;

      let TopButtonsOptions = {...this.state.TopButtonsOptions};
      TopButtonsOptions.addButton.showAdd = true;
      TopButtonsOptions.editButton.showEdit = false;

      let buttonsOptions = {...this.state.buttonsOptions};
      buttonsOptions.saveButton.showSave = false;
      buttonsOptions.cancelButton.showCancel= false;

      // check if Selected Prj and Selected Contract exists...
      if(this.state.selectedProject !== '' && this.state.selectedContract !== '')
      {
         this.setState({ formProcess: true });
         getProjectsContractDoc(this.state.selectedProject, this.state.selectedContract)
            .then(result => {
               contract = {...result.Result};
               this.setState({ contract, formProcess: false });
            })
            .catch(error => {
               console.log(error);
               this.setState({ formProcess: false });
            });
         
         TopButtonsOptions.editButton.showEdit = true;
 
      }

      this.setState({ contract, flags, TopButtonsOptions, buttonsOptions });
   }

   handleEdit = () => {
      // hide the top buttons...
      let TopButtonsOptions = {...this.state.TopButtonsOptions};
      TopButtonsOptions.addButton.showAdd = false;
      TopButtonsOptions.editButton.showEdit = false;

      // show the bottom buttons...
      let buttonsOptions = {...this.state.buttonsOptions};
      buttonsOptions.saveButton.showSave = true;
      buttonsOptions.cancelButton.showCancel = true;

      let flags = {...this.state.flags};
      flags.isAdd = false;
      flags.isEdit = true;

      this.setState({ flags, TopButtonsOptions, buttonsOptions });
      
   }

   handleOnDetailsChange = (event) => {
      const {name, value} = event.currentTarget;
   
      let contract = {...this.state.contract};
      contract[name] = value;

      this.setState({ contract });
   }

   handleOnProjectsChange = (event) => {
      if(this.state.flags.isAdd === true)
      {
         const {value} = event.currentTarget;
         let contract = this.state.contract;

         contract.ProjectName = value;

         this.setState({ contract });

         return;
      }

      this.setState({ formProcess: true });
      
      const {value} = event.currentTarget;

      

      if(this.state.flags.isAdd)
      {      
         let contract = {...this.state.contract};
         contract.ProjectName = value;
   
         this.setState({ contract });
      }
      else {
         this.setState({ contract: {
                         Description: '',
                         ProjectName: '',
                         Services: [],
                         contCode: '',
                         contName: '',
                         contactEmails: '',
                         contactPerson: '',
                         effectDate: '',
                         expiryDate: '',
                         prjCode: ''
                        } });
         getProjectsContractsList(value)
            .then(result => {
               console.log(result.Result);
               let contractsList = [];
               result.Result.map(r => {
                  contractsList.push({Name: r});
               });

               this.setState({ contractsList, selectedProject: value, 
                               formProcess: false });
            })
            .catch(error => {
               console.log(error);
               this.setState({ formProcess: false });
            })
      }
   }

   handleOnContractChange = (event) => {
      this.setState({ formProcess: true });
      const { value } = event.currentTarget;
      const { selectedProject } = this.state;
      
      getProjectsContractDoc(selectedProject, value)
         .then(result => {
            let contract = result.Result;
            let TopButtonsOptions = {...this.state.TopButtonsOptions};
            TopButtonsOptions.editButton.showEdit = true;

            let ed = new Date(contract.effectDate);
            let xd = new Date(contract.expiryDate);
            console.log(ed - xd);

            this.setState({ contract, formProcess: false, TopButtonsOptions, selectedContract: value });
         })
         .catch(error => {
            console.log(error);
            this.setState({ formProcess: false });
         })
   }

   handleOnChange = (name, value, index) => {
      let contract = {...this.state.contract};
      contract.Services[index][name] = value;

      if(name === 'manfeestype')
      {
         const { subcontracted, subcontValue, manfeestype } = contract.Services[index];
         if(subcontracted)
         {
            if(manfeestype === '%')
            {
               contract.Services[index].manfeesvalue = (subcontValue * 10) / 100;
               contract.Services[index].quotedValue = parseFloat(contract.Services[index].manfeesvalue) +
                  parseFloat(contract.Services[index].subcontValue);
            }
         }   
      }
      else if(name === 'manfeesvalue')
      {
         const { subcontracted, subcontValue, manfeestype } = contract.Services[index];
         if(subcontracted)
         {
            contract.Services[index].quotedValue = parseFloat(contract.Services[index].manfeesvalue) +
                  parseFloat(contract.Services[index].subcontValue);
         } 
         else {
            contract.Services[index].quotedValue = parseFloat(contract.Services[index].manfeesvalue);
         }
         
      }

      this.setState({ contract });
   }

   // handleOnSubContValueChange = (e) => {
   //    const { subcontracted, subcontValue, manfeestype } = this.props.service;
   //    if(subcontracted)
   //    {
   //       if(manfeestype === '%')
   //       {
   //          let manfeesvalue = (subcontValue * e.currentTarget.value) / 100;
   //          console.log(manfeesvalue);
   //       }
   //    }
   // }

   handleOnServiceAdded = () => {
      let contract = {...this.state.contract};
      let service = {...this.state.service};
      contract.Services.push(service);

      this.setState({ contract });
   }

   componentDidMount = () => {
      this.setState({ formProcess: true });
      getServicesList()
         .then(result => {
               let servicesList = [...result.Result];
               this.setState({ servicesList });
         });
         
      getProjectsList()
         .then(result => {
               let projectsList = [];
               result.Result.map(r => {
                  projectsList.push({Name: r});
               });

               this.setState({ projectsList });
               this.setState({ formProcess: false });
         });
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
   };

   render() {
      const { errors } = this.state;

      return (
         <React.Fragment>
            <div style={{paddingLeft: '10px', paddingRight: '10px'}}>
               <TitlePageHeader title="Contract Definition" 
                  bgColor="white" color="gray" />

            <ToolsBar buttonsOptions={this.state.TopButtonsOptions} />
            <div style={{height:"2vh"}} ></div>
            <img src={processing} 
                  width="30vw" 
                  alt="processing" 
                  className={this.state.formProcess ? "" : "hidden"} 
                  style={{marginTop: "2vh"}} />
   
               <div className='row'>
                  <div className='col-md-6'>
                     <DropDownList name='ProjectName' 
                        label='Projects'  
                        values={this.state.projectsList} 
                        onChange={this.handleOnProjectsChange} 
                        flgDisabled={this.state.flags.isEdit} 
                        defValue={this.state.contract.ProjectName}
                        error={errors.ProjectName ? errors.ProjectName : ""} 
                     />
                  </div>
                  <div className='col-md-6'>
                     <DropDownList name='ContractsList' 
                        label='Contracts'  
                        values={this.state.contractsList} 
                        onChange={this.handleOnContractChange} 
                        flgDisabled={this.state.flags.isEdit || this.state.flags.isAdd}
                        error={errors.ContractList ? errors.ContractList : ""} 
                     />
                  </div>
               </div>
               <div className='row'>
                  <div className='col-md-6'>
                     <Input 
                        name='contName'
                        label='Contract Name'
                        type="text"
                        onChange={this.handleOnDetailsChange} 
                        flgDisabled={!this.state.flags.isEdit && !this.state.flags.isAdd}
                        value={this.state.contract.contName}
                        error={errors.contName ? errors.contName : ""}
                     />
                  </div>
                  <div className='col-md-6'>
                     <Input 
                        name="contCode"
                        label="Contract Code"
                        type="text"
                        onChange={this.handleOnDetailsChange} 
                        value={this.state.contract.contCode}
                        flgDisabled={!this.state.flags.isEdit && !this.state.flags.isAdd}
                        error={errors.contCode ? errors.contCode : ""}
                     />
                  </div>
               </div>
               <div className='row'>
                  <div className='col-md-6'>
                     <Input 
                        name='contactPerson'
                        label='Contact Person'
                        type="text"
                        onChange={this.handleOnDetailsChange} 
                        value={this.state.contract.contactPerson}
                        flgDisabled={!this.state.flags.isEdit && !this.state.flags.isAdd}
                        error={errors.contactPerson ? errors.contactPerson : ""}
                     />
                  </div>
                  <div className='col-md-6'>
                     <Input 
                        name="contactEmails"
                        label="Contact Email"
                        type="text"
                        onChange={this.handleOnDetailsChange} 
                        value={this.state.contract.contactEmails}
                        flgDisabled={!this.state.flags.isEdit && !this.state.flags.isAdd}
                        error={errors.contactEmails ? errors.contactEmails : ""}
                     />
                  </div>
               </div>
               <div className='row'>
                  <div className='col-md-6'>
                     <Input 
                        name='effectDate'
                        label='Effective Date'
                        type="date"
                        onChange={this.handleOnDetailsChange} 
                        value={this.state.contract.effectDate}
                        flgDisabled={!this.state.flags.isEdit && !this.state.flags.isAdd}
                        error={errors.effectDate ? errors.effectDate : ""}
                     />
                  </div>
                  <div className='col-md-6'>
                     <Input 
                        name="expiryDate"
                        label="Expiry Date"
                        type="date"
                        onChange={this.handleOnDetailsChange} 
                        value={this.state.contract.expiryDate}
                        flgDisabled={!this.state.flags.isEdit && !this.state.flags.isAdd}
                        error={errors.expiryDate ? errors.expiryDate : ""}
                     />
                  </div>
               </div>
               <TextArea 
                  name="Description"
                  label="Contract Details"
                  rows="7"
                  onChange={this.handleOnDetailsChange} 
                  value={this.state.contract.Description}
                  flgDisabled={!this.state.flags.isEdit && !this.state.flags.isAdd}
                  error={errors.Description ? errors.Description : ""}
               />

               <hr style={{borderColor: "gray", boxShadow: "2px 1px 2px gray"}} />

               <div >
                  <div className='row' >
                     <div className="col-md-1">
                        <div className='row'>
                           <div className='col-md-12' style={{height: "45px"}}></div>
                        </div>
                        {this.state.contract.Services.map((s, index) => {
                           return (
                              <div key={index} className='row'>
                                 <div className='col-md-12' style={{height: "35px"}}></div>
                              </div>
                           )
                        })}
                        <div className='row'>
                           <div className="col-md-12">
                              <button onClick={this.handleOnServiceAdded} 
                                 className={(this.state.flags.isAdd || this.state.flags.isEdit) ? "" : "hidden"}>
                                 <FontAwesomeIcon icon="plus"></FontAwesomeIcon>
                              </button>
                           </div>
                        </div>
                     </div>
                     <div className="col-md-11">
                        <div className='row' style={servicesStyle}>
                           <div className='row'>
                              <div className='col-md-2' style={{fontWeight: 'bold'}}>
                                 {"Service"}
                              </div>
                              <div className='col-md-1'  style={{fontWeight: 'bold'}}>
                                 {"Subcontracted?"}   
                              </div>
                              <div className='col-md-2'  style={{fontWeight: 'bold'}}>
                                 {"SC Value"}
                              </div>
                              <div className='col-md-1'  style={{fontWeight: 'bold'}}>
                                 {"Fees Type"}
                              </div>
                              <div className='col-md-2'  style={{fontWeight: 'bold'}}>
                                 {"Fees Value"}
                              </div>
                              <div className='col-md-2'  style={{fontWeight: 'bold'}}>
                                 {"Manpower"}
                              </div>
                              <div className='col-md-2'  style={{fontWeight: 'bold'}}>
                                 {"Total Value"}
                              </div>
                           </div>
                           {
                              this.state.contract.Services.map((s, index) => {
                                 return <ServiceRow key={s} id={index} 
                                          service={s} onChange={this.handleOnChange}
                                          servList={this.state.servicesList}
                                          flags={this.state.flags}
                                          />
                              })
                           }
                           <div style={{height: "3vh"}}>
                              <hr />
                           </div>
                           
                           <div className='row'>
                              <div className='col-md-8'>
                              </div>
                              <div className='col-md-2'  style={{fontWeight: 'bold', textAlign: "right"}}>
                                 {"Subtotal"}
                              </div>
                              <div className='col-md-2'  style={{fontWeight: 'bold', textAlign: "right"}}>
                                 {this.caclSubtotal()}
                              </div>
                           </div>
                           
                           <div style={{height: "3vh"}}>
                              <hr />
                           </div>
                           
                           <div className='row'>
                              <div className='col-md-8'>
                              </div>
                              <div className='col-md-2'  style={{fontWeight: 'bold', textAlign: "right"}}>
                                 {"Total Contract Value"}
                              </div>
                              <div className='col-md-2'  style={{fontWeight: 'bold', textAlign: "right"}}>
                                 {this.calcContractValue()}
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>  
               </div>

               <img src={processing} 
                     width="60vw" 
                     alt="processing" 
                     className={this.state.formProcess ? "" : "hidden"} 
                     style={{marginTop: "2vh"}} />

               <ToolsBar buttonsOptions={this.state.buttonsOptions} />
               <ToastContainer />
            </div>
         </React.Fragment>
      );
   }

   caclSubtotal = () => {
      let subtotal = 0;
      this.state.contract.Services.map(s => {
         subtotal += parseFloat(s.quotedValue);
      });
      return subtotal.toFixed(3);
   }

   calcContractValue = () => {
      const { effectDate, expiryDate } = this.state.contract;
      let subtotal = 0;
      this.state.contract.Services.map(s => {
         subtotal += parseFloat(s.quotedValue);
      });

      let time = new Date(expiryDate) - new Date(effectDate);
      let months = Math.round(time / 1000/60/60/24/30);
      
      console.log(months)
      return (subtotal * months).toFixed(3);
   }
   
}


export default ContractDef;

const servicesStyle = {
   backgroundColor: 'lightgray', 
   borderRadius: "25px", 
   paddingTop: "5px", 
   paddingLeft: "10px",
   paddingRight: "10px",
   paddingBottom: "5px",
   margin: "0"
}
