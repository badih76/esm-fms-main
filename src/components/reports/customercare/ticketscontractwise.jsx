import React, { Component } from 'react';
import Input, { DropDownList } from '../../../common/input';
import { 
    getClientsNames, getProjectsOfClient, getContractsForProject
} from '../../../appcode/fincsoa';
import process from '../../../images/processing.gif';

class TicketsByContractForm extends Component {
    state = {
        params: {
            ddlClients: "",
            ddlProjects: "",
            ddlContracts: "",
            dtFrom: new Date(),
            dtTo: new Date()
        },
        clientsList: [],
        projectsList: [],
        contractsList: [],
        selectedClient: '',
        selectedProject: '',
        selectedContract: '',
        errors: '',
        processing: false
    }

    handleOnChange = (event) => {
        const { name, value } = event.currentTarget;
        let params = {...this.state.params};

        params[name] = value;
        this.setState({ params });
    } 

    handleClientsClick = (event) => {
        const { value } = event.currentTarget;
        this.setState({ processing: true });

        getProjectsOfClient(value)
            .then(result => {
                if(result.Success === 'Ok')
                {
                    let projectsList = [];
                    result.Result.map(r => {
                        projectsList.push({Name: r.name});
                    });
                    this.setState({ projectsList, 
                                    selectedClient: value,
                                    processing: false });
                }
                else
                {
                    console.log(result);
                    this.setState({ processing: false });
                }
            })
            .catch(error => {
                console.log(error);
                this.setState({ processing: false });
            })
    }

    handleProjectsClick = (event) => {
        const { value } = event.currentTarget;
        this.setState({ processing: true });

        console.log(value);
        getContractsForProject(value)
            .then(result => {
                if(result.Success === 'Ok')
                {
                    let contractsList = [];
                    result.Result.map(r => {
                        contractsList.push({Name: r.name});
                    });
                    this.setState({ contractsList, 
                                    selectedProject: value,
                                    processing: false});
                }
                else
                {
                    console.log(result);
                    this.setState({ processing: false });
                }
            })
            .catch(error => {
                console.log(error);
                this.setState({ processing: false });
            })
    }

    constructor () {
        super();
        getClientsNames()
            .then(result => {
                if(result.Success === 'Ok')
                {
                    let clientsList = [];

                    result.Result.map(r => {
                        clientsList.push({Name: r});
                    });
                    this.setState({ clientsList });
                }
            })
            .catch(error => {
                console.log(error);
            })
    }

    render() {
        return (
            <form action="http://airmechfms.com/fms/repCustCareTicketsList.aspx" 
                target="_blank" method="POST" >
                <div class={this.state.processing ? "" : "hidden"}>
                    <img src={process} width={30} height={30} />
                </div>
                <DropDownList
                     name="ddlClients" 
                     label="Client Name" 
                     values={this.state.clientsList} 
                     onChange={this.handleClientsClick} 
                     flgDisabled={false} 
                     error={this.state.errors} 
                     defValue=''
                />
                <DropDownList
                     name="ddlProjects" 
                     label="Project Name" 
                     values={this.state.projectsList} 
                     onChange={this.handleProjectsClick} 
                     flgDisabled={false} 
                     error={this.state.errors} 
                     defValue=''
                />
                <DropDownList
                     name="ddlContracts" 
                     label="Contract Name" 
                     values={this.state.contractsList} 
                     onChange={this.handleProjectsClick} 
                     flgDisabled={false} 
                     error={this.state.errors} 
                     defValue=''
                />
                {/* <Input name="dtFrom" label="From" type="date"
                    value={this.state.params.dtFrom} flgDisabled={false}
                    onChange={this.handleOnChange} error={this.state.errors} /> 
                <Input name="dtTo" label="To" type="date"
                    value={this.state.params.dtTo} flgDisabled={false}
                    onChange={this.handleOnChange} error={this.state.errors} />  */}

                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
       );
    }
}

export default TicketsByContractForm;