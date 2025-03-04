import React, { Component } from 'react';
import { TitlePageHeader } from '../titleheader/titleheader';
import Input, { DropDownList } from '../../common/input';
import ToolsBar from '../../common/toolsbar';
import Chart from "react-google-charts";
import { ToastContainer, toast } from 'react-toastify';
import Joi from 'joi-browser';

import processing from '../../images/processing.gif';

import { getPrjContPlan, getProjectsList, 
         getProjectsContractsList, updatePrjContPlans } from '../../appcode/jobplanner';
import { getPrjServices } from '../../appcode/mastprjserv';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class JobPlanner extends Component {
    state = {
        uprofile: {},
        plans: [],
        columns: [],
        rows: [],
        servicesList: [{Name: "MEP"} , {Name:"Landscaping"}],
        projectsList: [],
        contractsList: [],
        selectedPrj: '',
        selectedCont: '',
        selectedPlan: -1,
        selectedPPlan: -1,
        servicePlans: {
            Plans: [],
            ServiceName: '',
            periodsPanelID: null
        },
        plan: {
            fromDate: "",
            toDate: "",
            title: ""
        },

        formProcess: false,
        buttonsOptions: {
            addButton: {
                showAdd: false,
                onAdd: () => this.handleAdd()
            },
            editButton: {
                showEdit: false,
                onEdit: () => this.handleEdit()
            },
            saveButton: {
                showSave: false,
                onSave: () => this.handleOnSave()
            },
            cancelButton: {
                showCancel: false,
                onCancel: () => this.handleCnacel()
            },
            searchButton: {
                showSearch: false
            }
        },
        flags: {
            isAdd: false,
            isEdit: false
        },

        propsPanel: {
            chartPnaleClass: 'col-md-8',
            propPanelVisible: true
        },
        errors: {}
    }

    schema = {
        fromDate: Joi
                    .date()
                    .required()
                    .label('Plan Starting Date'),
        toDate: Joi
                    .date().label('Plan Ending Date'),
        title: Joi
                    .string()
                    .label('Service Title')
    };
    
    columns = [
        { type: "string", id: "Service" },
        { type: "string", id: "Title"},
        { type: "date", id: "Start" },
        { type: "date", id: "End" }
      ];
    
    rows = [
            ["Washington", new Date(1789, 3, 30), new Date(1795, 2, 4)],
            ["Washington", new Date(1797, 2, 15), new Date(1798, 2, 4)],
            ["Badih", new Date(1791, 3, 30), new Date(1794, 1, 4)],
            ["Badih", new Date(1794, 8, 15), new Date(1798, 2, 4)]
    
    ];

    componentDidMount = () => {
        this.setState({ formProcess: true });

        getProjectsList()
            .then(result => {
                let projectsList = [];

                result.Result.map(r => {
                    projectsList.push({Name: r});
                });

                this.setState({ projectsList });
                this.setState({ formProcess: false });
            })
            .catch(error => {
                console.log(error);
                this.setState({ formProcess: false });
            });

        getPrjServices()
            .then(result => {
                let servicesList = [];

                if(result.Success)
                {
                    result.Result.map(r => {
                        servicesList.push({Name: r.Description});
                    });
                }
                else
                {

                }

                this.setState({ servicesList });
            })
            .catch(error => {
                console.log(error);
                // let servicesList = [];
            });

        // getPrjContPlan("Barr Al Jissah Residence", "Common area")
        //     .then(result => {
        //         let plans = [...result.Result];
        //         let rows = [];
        //         plans.map(p => {
        //             p.Plans.map(pp => {
        //                 rows.push([p.ServiceName, pp.title, new Date(pp.fromDate), new Date(pp.toDate)]);
        //             })
        //         });

        //         this.setState({plans, rows});
        //     })
        //     .catch(error => {
        //         console.log(error);
        //     })
    }

    handleProjectsClick = (event) => {
        let { value } = event.currentTarget;
        if(value === '') 
        {
            let plans = [];
            let rows = [];
            let selectedPrj = '';
            let selectedCont = '';

            this.setState({ plans, rows, selectedPrj, selectedCont });
            
            return;
        }

        this.setState({ formProcess: true });
                
        getProjectsContractsList(value)
            .then(result => {
                let contractsList = [];

                result.Result.map(r => {
                    contractsList.push({Name: r});
                });

                this.setState({ contractsList, selectedPrj: value, selectedCont: '' });
                this.setState({ formProcess: false });
            })
            .catch(error => {
                console.log(error);
                this.setState({ formProcess: false, selectedPrj: '', selectedCont: '' });
            })
    } 

    handleContractsClick = (event) => {
        let { value } = event.currentTarget;
        if(value === '') 
        {
            let plans = [];
            let rows = [];

            this.setState({ plans, rows });

            return;
        }
        this.setState({ formProcess: true });
        
        getPrjContPlan(this.state.selectedPrj, value)
            .then(result => {
                let plans = [];
                if(result.Result.length > 0)
                {
                    plans = [...result.Result];
                }

                let rows = [];
                if(plans.length > 0)
                {
                    plans.map(p => {
                        p.Plans.map(pp => {
                            console.log(new Date(pp.fromDate));
                            rows.push([p.ServiceName, pp.title, new Date(pp.fromDate), new Date(pp.toDate)]);
                        })
                    });
                }

                let buttonsOptions = {...this.state.buttonsOptions};
                buttonsOptions.addButton.showAdd = true;

                this.setState({ plans, rows, selectedCont: value, buttonsOptions });
                this.setState({ formProcess: false });
            })
            .catch(error => {
                console.log(error);
                this.setState({ formProcess: false, selectedCont: '' });
            })

    } 

    handleAdd = () => {
        let servicePlans = {
            Plans: [],
            ServiceName: '',
            periodsPanelID: null
                
        }

        let plan = {
            fromDate: '',
            toDate: '',
            title: ''
        }

        let flags = {...this.state.flags};
        flags.isAdd = true;
        flags.isEdit = false;

        let buttonsOptions = {...this.state.buttonsOptions};
        buttonsOptions.addButton.showAdd = false;
        buttonsOptions.editButton.showEdit = false;
        buttonsOptions.saveButton.showSave = true;
        buttonsOptions.cancelButton.showCancel = true;
        
        this.setState({ servicePlans, plan, flags, buttonsOptions });
    }

    handleCnacel = () => {
        let flags = {...this.state.flags};

        // if Add, clear all plan flieds and disable them...
        if(flags.isAdd)
        {
            let servicePlans = {...this.state.servicePlans};
            let plan = {...this.state.plan};
            
            servicePlans.ServiceName = '';
            servicePlans.Plans = [];
            plan = {
                fromDate: '',
                toDate: '',
                title: ''
            }

            flags.isAdd = false;
            flags.isEdit = false;

            let buttonsOptions = {...this.state.buttonsOptions};
            buttonsOptions.addButton.showAdd = true;
            buttonsOptions.editButton.showEdit = false;
            buttonsOptions.saveButton.showSave = false;
            buttonsOptions.cancelButton.showCancel = false;

            this.setState({ servicePlans, plan, flags, buttonsOptions });
        }
        else
        {
            let servicePlans = {...this.state.servicePlans};
            let plan = {...this.state.plan};
            
            servicePlans.ServiceName = '';
            servicePlans.Plans = [];
            plan = {
                fromDate: '',
                toDate: '',
                title: ''
            }

            flags.isAdd = false;
            flags.isEdit = false;

            let buttonsOptions = {...this.state.buttonsOptions};
            buttonsOptions.addButton.showAdd = true;
            buttonsOptions.editButton.showEdit = false;
            buttonsOptions.saveButton.showSave = false;
            buttonsOptions.cancelButton.showCancel = false;

            this.setState({ servicePlans, plan, flags, buttonsOptions });
        }
    }

    handleOnChange = (event) => {
        let { name, value } = event.currentTarget;

        if(name === 'ServiceName')
        {
            let servicePlans = {...this.state.servicePlans};

            let service = this.state.plans.find(p => {
                return p.ServiceName === value;
            });

            if(service)
            {
                if(service.Plans.find(p => {
                    return (p.fromDate === this.state.plan.fromDate && p.title.localeCompare(this.state.plan.title) === 0)
                }))
                {
                    toast.warn('Similar service plan already exists!',
                        {
                            position: toast.POSITION.TOP_RIGHT,
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true
                        });
                }
            }

            servicePlans.ServiceName = value;

            this.setState({ servicePlans });
        }
        else
        {
            let plan = {...this.state.plan};

            let service = this.state.plans.find(p => {
                return p.ServiceName === this.state.servicePlans.ServiceName;
            });

            if(service)
            {
                if(service.Plans.find(p => {
                    return (p.fromDate === value && p.title.localeCompare(plan.title) === 0)
                }))
                {
                    toast.warn('Similar service plan already exists!',
                        {
                            position: toast.POSITION.TOP_RIGHT,
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true
                        });
                }
            }

            plan[name] = value;

            this.setState({ plan });
        }
    }

    validateFields = () => {
        let errors = {};

        if(this.state.servicePlans.ServiceName === '')
        {
            errors['ServiceName'] = 'Service Name is required';
        }

        let result = Joi.validate(this.state.plan, this.schema, { abortEarly: false });
        
        if(!result.error && this.state.servicePlans.ServiceName !== '') return null;

        for(let item of result.error.details)
            errors[item.path[0]] = item.message;

        if(Object.keys(errors).length === 0) return null;
        return errors;
    };

    handleOnSave = () => {
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
            return;
        }

        let flags = {...this.state.flags};
        const { servicePlans, plan, selectedCont, selectedPrj } = this.state;

        this.setState({ formProcess: true });

        if(flags.isAdd)
        {

            // locate the service in the plans array 
            // and push it into the Plans array...
            let plans = [...this.state.plans];
            let index = plans.findIndex(p => {
                return p.ServiceName === servicePlans.ServiceName;
            });
            
            if(index !== -1)
            {
                plans[index].Plans.push(plan);
                console.log(index, plan);

            }
            else
            {
                // Service is not added to this Plans array...
                // Create service object and push it into plans...
                servicePlans.Plans.push(plan);
                plans.push(servicePlans);
                console.log('Added new service: ', plan);
            }

            console.log("Plans: ", plans);
            // update the database...
            updatePrjContPlans(selectedPrj, selectedCont, plans)
                .then(result => {
                    console.log(result);

                    let rows = [];
                    if(plans.length > 0)
                    {
                        plans.map(p => {
                            p.Plans.map(pp => {
                                rows.push([p.ServiceName, pp.title, Date(pp.fromDate), Date(pp.toDate)]);
                            })
                        });
                    }
    
                    // adjust flags... 
                    flags.isAdd = false;
                    flags.isEdit = false;

                    // adjust buttons... 
                    let buttonsOptions = {...this.state.buttonsOptions};
                    buttonsOptions.addButton.showAdd = true;
                    buttonsOptions.editButton.showEdit = true;
                    buttonsOptions.saveButton.showSave = false;
                    buttonsOptions.cancelButton.showCancel = false;

                    this.setState({ formProcess: false, flags, buttonsOptions, rows, plans });
                })
                .then(result => {
                    getPrjContPlan(this.state.selectedPrj, this.state.selectedCont)
                        .then(result => {
                            let plans = [];
                            if(result.Result.length > 0)
                            {
                                plans = [...result.Result];
                            }

                            let rows = [];
                            if(plans.length > 0)
                            {
                                plans.map(p => {
                                    p.Plans.map(pp => {
                                        rows.push([p.ServiceName, pp.title, new Date(pp.fromDate), new Date(pp.toDate)]);
                                    })
                                });
                            }

                            let buttonsOptions = {...this.state.buttonsOptions};
                            buttonsOptions.addButton.showAdd = true;

                            this.setState({ plans, rows, buttonsOptions });
                            this.setState({ formProcess: false });
                        })
                        .catch(error => {
                            console.log(error);
                            this.setState({ formProcess: false, selectedCont: '' });
                        })
                })
                .catch(error => {
                    console.log(error);

                    let rows = [];
                    if(plans.length > 0)
                    {
                        plans.map(p => {
                            p.Plans.map(pp => {
                                let fd = new Date(pp.fromDate).getDate(), 
                                    fm = new Date(pp.fromDate).getMonth() + 1,
                                    fy = new Date(pp.fromDate).getFullYear(),
                                    td = new Date(pp.toDate).getDate(),
                                    tm = new Date(pp.toDate).getMonth() + 1,
                                    ty = new Date(pp.toDate).getFullYear();

                                rows.push([p.ServiceName, pp.title, new Date(fy, fm, fd), new Date(ty, tm, td)]);
                            })
                        });
                    }
    
                    // adjust flags... 
                    flags.isAdd = false;
                    flags.isEdit = false;

                    // adjust buttons... 
                    let buttonsOptions = {...this.state.buttonsOptions};
                    buttonsOptions.addButton.showAdd = true;
                    buttonsOptions.editButton.showEdit = true;
                    buttonsOptions.saveButton.showSave = false;
                    buttonsOptions.cancelButton.showCancel = false;

                    this.setState({ formProcess: false, flags, buttonsOptions, rows });
                });
        }
        else
        {
            // isEdit === true
            // locate the service in the plans array 
            // and push it into the Plans array...
            let plans = [...this.state.plans];
            const { selectedPlan, selectedPPlan } = this.state;

            plans[selectedPlan].Plans[selectedPPlan] = {...plan};
            
            // update the database...
            updatePrjContPlans(selectedPrj, selectedCont, plans)
                .then(result => {
                    console.log(result);

                    let rows = [];
                    if(plans.length > 0)
                    {
                        plans.map(p => {
                            p.Plans.map(pp => {
                                let fd = new Date(pp.fromDate).getDate(), 
                                    fm = new Date(pp.fromDate).getMonth() + 1,
                                    fy = new Date(pp.fromDate).getFullYear(),
                                    td = new Date(pp.toDate).getDate(),
                                    tm = new Date(pp.toDate).getMonth() + 1,
                                    ty = new Date(pp.toDate).getFullYear();

                                rows.push([p.ServiceName, pp.title, new Date(fy, fm, fd), new Date(ty, tm, td)]);
                            })
                        });
                    }
    
                    // adjust flags... 
                    flags.isAdd = false;
                    flags.isEdit = false;

                    // adjust buttons... 
                    let buttonsOptions = {...this.state.buttonsOptions};
                    buttonsOptions.addButton.showAdd = true;
                    buttonsOptions.editButton.showEdit = true;
                    buttonsOptions.saveButton.showSave = false;
                    buttonsOptions.cancelButton.showCancel = false;

                    this.setState({ formProcess: false, flags, buttonsOptions, rows });
                })
                .then(result => {
                    getPrjContPlan(this.state.selectedPrj, this.state.selectedCont)
                        .then(result => {
                            let plans = [];
                            if(result.Result.length > 0)
                            {
                                plans = [...result.Result];
                            }

                            let rows = [];
                            if(plans.length > 0)
                            {
                                plans.map(p => {
                                    p.Plans.map(pp => {
                                        rows.push([p.ServiceName, pp.title, new Date(pp.fromDate), new Date(pp.toDate)]);
                                    })
                                });
                            }

                            let buttonsOptions = {...this.state.buttonsOptions};
                            buttonsOptions.addButton.showAdd = true;

                            this.setState({ plans, rows, buttonsOptions });
                            this.setState({ formProcess: false });
                        })
                        .catch(error => {
                            console.log(error);
                            this.setState({ formProcess: false, selectedCont: '' });
                        })
                })
                .catch(error => {
                    console.log(error);

                    let rows = [];
                    if(plans.length > 0)
                    {
                        plans.map(p => {
                            p.Plans.map(pp => {
                                rows.push([p.ServiceName, pp.title, new Date(pp.fromDate), new Date(pp.toDate)]);
                            })
                        });
                    }
    
                    // adjust flags... 
                    flags.isAdd = false;
                    flags.isEdit = false;

                    // adjust buttons... 
                    let buttonsOptions = {...this.state.buttonsOptions};
                    buttonsOptions.addButton.showAdd = true;
                    buttonsOptions.editButton.showEdit = true;
                    buttonsOptions.saveButton.showSave = false;
                    buttonsOptions.cancelButton.showCancel = false;

                    this.setState({ formProcess: false, flags, buttonsOptions, rows });
                });

        }
    }

    handleEdit = () => {
        // set the flags... 
        let flags = {...this.state.flags};
        flags.isAdd = false;
        flags.isEdit = true;

        // set the buttons... 
        let buttonsOptions = {...this.state.buttonsOptions};
        buttonsOptions.addButton.showAdd = false;
        buttonsOptions.editButton.showEdit = false;
        buttonsOptions.saveButton.showSave = true;
        buttonsOptions.cancelButton.showCancel = true;

        this.setState({ flags, buttonsOptions });
    }

    handleOnPlanClick = (key) => {
        let ServiceName = key.split('_')[0]; 
        let index = key.split('_')[1];

        let plans = [...this.state.plans];

        let planIndex = plans.findIndex(p => {
            return p.ServiceName.localeCompare(ServiceName) === 0; 
        });
        if(planIndex !== -1)
        {
            let servicePlans = {...plans[planIndex]};
            let plan = {...plans[planIndex].Plans[index]};
            let buttonsOptions = {...this.state.buttonsOptions};
            buttonsOptions.editButton.showEdit = true;

            this.setState({ servicePlans, plan, selectedPlan: planIndex, selectedPPlan: index });

            
        }
    }

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
        const { errors } = this.state;
        return (
            <React.Fragment>
                <TitlePageHeader title='Job Planner' bgColor='white' color='gray' />

                <div className='row' style={rowStyle}>
                    <div className={this.state.propsPanel.chartPnaleClass} style={columnStyle}>
                    <Chart
                        chartType="Timeline"
                        data={[this.columns, ...this.state.rows]}
                        width="300%"
                        height="300px"
                        loader={<div>Loading Chart</div>}
                        chartPackage={['controls']}
                        chartEvents={this.state.chart_events}
                        graph_id="plansTimeline"
                        options={{
                            showRowNumber: true,
                            hAxis: {
                                minValue: new Date(2019, 1, 1),
                                maxValue: new Date(2019, 12, 31),
                                format: "dd/MM/yyyy"
                            }
                        }} />
                    <hr style={hrStyle} />
                    <div >
                        <table className="table table-striped table-hover" style={{width: "100%"}}>
                            <thead>
                                <tr class="success">
                                    <th>Service Name</th>
                                    <th>Service Title</th>
                                    <th>From Date</th>
                                    <th>To Date</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.plans.map(p => {
                                    return p.Plans.map((pp, index) => {
                                        return <tr key={p.ServiceName+index} >
                                            <td>{p.ServiceName}</td>
                                            <td>{pp.title}</td>
                                            <td>{pp.fromDate}</td>
                                            <td>{pp.toDate}</td>
                                            <td>
                                                <button 
                                                    onClick={() => this.handleOnPlanClick(p.ServiceName+'_'+index)}>
                                                    <FontAwesomeIcon icon="edit"></FontAwesomeIcon>
                                                </button></td>
                                        </tr>
                                    });
                                })}
                            </tbody>
                        </table>
                    </div>
                    </div>
                    <div className={'col-md-1 ' + (!this.state.propsPanel.propPanelVisible ? "" : "hidden")}
                         style={propColumnStyle}>
                        <div style={{width: "100%", marginBottom: "15px"}}>
                            <div className='row'>
                                <div className='col-md-1'>
                                    <div onClick={() => { this.handleToggleProperties(); }}>
                                        <FontAwesomeIcon icon='angle-double-left'></FontAwesomeIcon>
                                    </div>
                                </div>
                                <div className='col-md-11'>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={'col-md-4 ' + (this.state.propsPanel.propPanelVisible ? "" : "hidden")} 
                         style={propColumnStyle}>
                        <div style={{width: "100%", marginBottom: "15px"}}>
                            <div className='row'>
                                <div className='col-md-1'>
                                    <div onClick={() => { this.handleToggleProperties(); }}>
                                        <FontAwesomeIcon icon='angle-double-right'></FontAwesomeIcon>
                                    </div>
                                </div>
                                <div className='col-md-10'>
                                    <ToolsBar buttonsOptions={this.state.buttonsOptions} />
                                </div>
                                <div className='col-md-1'>
                                </div>
                            </div>
                        </div>

                        <img src={processing} 
                            width="40vw" 
                            alt="processing" 
                            className={this.state.formProcess ? "" : "hidden"} 
                            style={{marginTop: "2vh"}} />

                        <DropDownList name="Projects" label="Project" 
                            values={this.state.projectsList}
                            onChange={this.handleProjectsClick} 
                            defValue={this.state.selectedPrj}
                            flgDisabled={this.state.flags.isAdd || this.state.flags.isEdit} />
                        <DropDownList name="Contracts" label="Contract" 
                            values={this.state.contractsList}
                            onChange={this.handleContractsClick}
                            defValue={this.state.selectedCont}
                            flgDisabled={this.state.flags.isAdd || this.state.flags.isEdit} />
                        <DropDownList name="ServiceName" label="Service" 
                            values={this.state.servicesList}
                            onChange={this.handleOnChange}
                            defValue={this.state.servicePlans.ServiceName}
                            flgDisabled={!this.state.flags.isAdd && !this.state.flags.isEdit} 
                            error={errors.ServiceName ? errors.ServiceName : ""} />
                        <Input name="title" label="Service Title"
                            value={this.state.plan.title}
                            onChange={this.handleOnChange}
                            error={errors.title ? errors.title : ""}
                            flgDisabled={!this.state.flags.isAdd && !this.state.flags.isEdit} />
                        <div className="row">
                            <div className="col-md-6">
                                <Input type="date" label="From Date" 
                                    name="fromDate"
                                    value={this.state.plan.fromDate}
                                    onChange={this.handleOnChange}
                                    error={errors.fromDate ? errors.fromDate : ""}
                                    flgDisabled={!this.state.flags.isAdd && !this.state.flags.isEdit} />
                            </div>
                            <div className="col-md-6">
                                <Input type="date" label="to Date" 
                                    name="toDate" 
                                    value={this.state.plan.toDate}
                                    onChange={this.handleOnChange}
                                    error={errors.toDate ? errors.toDate : ""}
                                    flgDisabled={!this.state.flags.isAdd && !this.state.flags.isEdit} />
                            </div>
                        </div>
                        
                    </div>
                </div>
                <ToastContainer />
            </React.Fragment>
        );
    }

    handleToggleProperties = () => {
        const { propsPanel } = this.state;

        if(propsPanel.propPanelVisible)
        {
            propsPanel.propPanelVisible = false;
            propsPanel.chartPnaleClass = 'col-md-11';
        }
        else
        {
            propsPanel.propPanelVisible = true;
            propsPanel.chartPnaleClass = 'col-md-8';
        }

        this.setState({ propsPanel });
    }
}

export default JobPlanner;

const columnStyle = {
    border: "solid",
    borderWidth: "1px",
    borderColor: "lightgray",
    borderRadius: "25px",
    height: "68vh",
    overflow: 'auto'
}

const propColumnStyle = {
    paddingTop: "15px",
    border: "solid",
    borderWidth: "1px",
    borderColor: "lightgray",
    borderRadius: "25px",
    height: "68vh",
    backgroundColor: 'lightgray',
    overflow: 'auto'
}

const rowStyle = {
    marginLeft: "1vw",
    marginRight: "1vw"
}

const hrStyle = {
    borderColor: 'gray',
    boxShadow: "2px 1px lightgray"
}