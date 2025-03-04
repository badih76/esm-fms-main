import React, { Component } from 'react';
import ItemsList from '../../common/itemslist';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { TitlePageHeader } from '../titleheader/titleheader';
import ClientUserForm from './clientuserform';

import { getClientsNames, getProjectsOfClient, getContractsForProject } from '../../appcode/fincsoa';
import { getClientUsers, addClientUser } from '../../appcode/useradmin';

class ClientUserAdmin extends Component {
    state = {
        showUGProcess: true,
        showUsersProcess: false,
        showFormProcess: "hidden",
        selectedUser: '',
        visibileColumns: {
            first: 0,
            last: 2
        },
        visibilityFlags: [
            "",
            ""
        ],
        propControl: ``,
        propControlTitle: '',
        users: [],
        user: {
            clientName: '',
            commGroup: '',
            contractName: '',
            passWord: '',
            projectName: '',
            userEmail: ''
        },
        oldPw: '',
        uprofile: {},
        clients: [],
        projects: [],
        contracts: []
    } 

    handleGoLeft = () => {
        let visibileColumns = {...this.state.visibileColumns};
        let visibilityFlags = [...this.state.visibilityFlags];

        if(visibileColumns.first === 0) return;

        for(let i=0; i<this.state.visibilityFlags.length; i++)
        {   
            if(i>=visibileColumns.first-1 && i<=visibileColumns.last-1) 
            {
                visibilityFlags[i] = "";
            }
            else
            {
                visibilityFlags[i] = "hidden";
            }
        }

        --visibileColumns.first;
        --visibileColumns.last;

        this.setState({ visibileColumns, visibilityFlags });

    }

    handleGoRight = () => {
        let visibileColumns = {...this.state.visibileColumns};
        let visibilityFlags = [...this.state.visibilityFlags];

        if(visibileColumns.last === visibilityFlags.length-1) return;


        for(let i=0; i<this.state.visibilityFlags.length; ++i)
        {
            if(i>=visibileColumns.first+1 && i<=visibileColumns.last+1) 
            {
                visibilityFlags[i] = "";
            }
            else
            {
                visibilityFlags[i] = "hidden";
            }
        }

        ++visibileColumns.first;
        ++visibileColumns.last;

        this.setState({ visibileColumns, visibilityFlags });
    }

    userFormHandlers = {
        handleClientChange: (value, name = null) => {
            console.log("Client Handler");
            let projects = [];
            let selectedUser = {...this.state.selectedUser};

            selectedUser.clientName = value;

            getProjectsOfClient(value)
            .then(result => {

                if(result.Result.length > 0)
                {
                    result.Result.map(e => {
                        projects.push({Name: e.name});
                    });
                    this.setState({ projects, selectedUser });
                }
                                    
            })
            .catch(error => {
                console.log("Error: ", error.message);
                this.setState({ projects, selectedUser });
            }) 

            console.log(projects);
        }, 

        handleProjectChange: (value, name = null) => {
            let contracts = [];
            let selectedUser = {...this.state.selectedUser};

            selectedUser.projectName = value;

            getContractsForProject(value)
            .then(result => {

                if(result.Result.length > 0)
                {
                    result.Result.map(e => {
                        contracts.push({Name: e.name});
                    });
                    console.log("Contracts: ", contracts);
                    this.setState({ contracts, selectedUser });
                }
                                    
            })
            .catch(error => {
                console.log("Error: ", error.message);
                this.setState({ contracts, selectedUser });
            }) 

        },

        handleContractChange: (value, name = null) => {
            let selectedUser = {...this.state.selectedUser};

            selectedUser.contractName = value;

                                    
            this.setState({ selectedUser });
             
        },

        handleChange: (value, name = null) => {
            let selectedUser = {...this.state.selectedUser};
            selectedUser[name] = value;
    
            this.setState({ selectedUser });
        },
    
        handleUGChange: (value) => {
            let user = {...this.state.user};
            user.UserGroup = value;
    
            this.setState({ user });
        },

        handleDisable: (value) => {
            let user = {...this.state.user};
            user.disabled = value;
    
            this.setState({ user });
        },
        
        handleOnAdd: () => {
            let user = {
                clientName: '',
                commGroup: '',
                contractName: '',
                passWord: '',
                projectName: '',
                userEmail: ''
            };

            this.setState({ user });
        },

        handleOnCancel: () => {
            // getProjectDocument(this.state.selectedProject)
            //     .then(result => {
            //         let projects = [...result.Result];
            //         let project = {...projects[0]};

            //         this.setState({ project });
            //     })
            //     .catch(error => {
            //         console.log(error);
            //     });
        },

        handleOnSave: (flags) => {
            this.setState({ showFormProcess: "" })
            let user = {...this.state.selectedUser};

            if(flags.isAdd)
            {
                addClientUser(user)
                    .then(result => {
                        let users = [...this.state.users];

                        users.push(user);
                        users = users.sort(function(a, b){
                            var x = a.userEmail.toLowerCase();
                            var y = b.userEmail.toLowerCase();
                            if (x < y) {return -1;}
                            if (x > y) {return 1;}
                            return 0;
                        });

                        this.setState({ users, showFormProcess: "hidden" });
                        
                        toast.success('New User Added Successfully...',
                        {
                            position: toast.POSITION.TOP_RIGHT,
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true
                        });
                        return result;
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
            else
            {
                // editUser(user, this.state.oldPw)
                //     .then(result => {
                //         this.setState({ showFormProcess: "hidden" });
                        
                //         toast.success('Exitsing User Updated Successfully...',
                //         {
                //             position: toast.POSITION.TOP_RIGHT,
                //             autoClose: 5000,
                //             hideProgressBar: false,
                //             closeOnClick: true,
                //             pauseOnHover: true,
                //             draggable: true
                //         });

                //         return result;
                //     })
                //     .catch(error => {
                //         console.log(error);
                //     });
            }

        }
    }


    handleUserColumnClick = () => {
        
        let propControl= 'userForm';
        let propControlTitle= 'Users';
        let user = {
            clientName: '',
            commGroup: '',
            contractName: false,
            passWord: '',
            projectName: '',
            userEmail: false
        }

        this.setState({ propControl, propControlTitle, user });
    }

    handleOnUserClick = (userEmail) => {
        this.setState({ showUsersProcess: true });
        this.setState({ user: {}, 
                        oldPw: '',
                        selectedUser: '' 
                    });
        let selectedUser = {};
        let user = {};
        let oldPw = '';
        let projects = [];
        let contracts = [];
    
        console.log(userEmail);

        let userIndex = this.state.users.findIndex(e => e.userEmail === userEmail);

        selectedUser = {...this.state.users[userIndex]};

        getProjectsOfClient(selectedUser.clientName)
            .then(result => {

                if(result.Result.length > 0)
                {
                    result.Result.map(e => {
                        projects.push({Name: e.name});
                    });
                    console.log(projects);
                    
                    this.setState({ projects });
                    return getContractsForProject(selectedUser.projectName)
                }
                else
                {
                    return ""
                }
            })
            .then(result => {
                if(result.Result.length > 0)
                {
                    result.Result.map(e => {
                        contracts.push({Name: e.name});
                    });

                    console.log(contracts);
                    this.setState({ contracts });
                }
            })

        this.setState({ selectedUser, showUsersProcess: false });

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
    
        this.state.showClientsProcess = true;

    }

    componentDidMount = () => {
        this.setState({ showUsersProcess: true })
        getClientUsers()
            .then(result => {
                let users = [];

                if(result.Result.length > 0)
                {
                    users = [...result.Result];
                }

                this.setState({ users, showUsersProcess: false });
            })
            .catch(error => {
                console.log("Error: ", error);
            })

        getClientsNames()
            .then(result => {
                let clients = [...this.state.clients];

                if(result.Result.length > 0)
                {
                    result.Result.map(e => {
                        clients.push({Name: e});
                    })
                }

                this.setState({ clients });
            })
            .catch(error => {
                console.log("Error: ", error);
            })
    }

    handleOnClientSearch = (event) => {
        let fullClientsList = [...this.state.fullClientsList];

        let clientsList = fullClientsList.filter(c => c.clName
                                                       .toLowerCase()
                                                       .indexOf(
                                                           event.currentTarget.value.toLowerCase()
                                                           ) !== -1);
        this.setState({ clientsList });
        
    } 

    handleOnProjectSearch = (event) => {
        let fullProjectsList = [...this.state.fullProjectsList];
        let projectsList = fullProjectsList.filter(c => c.prjName
                                                       .toLowerCase()
                                                       .indexOf(
                                                           event.currentTarget.value.toLowerCase()
                                                           ) !== -1);
        this.setState({ projectsList });
        
    } 

    render() {
        // { data, name, label, onClick, showProcess, showList }
        return (
            <div className="col-md-12">
                <TitlePageHeader title="Client User Administration" bgColor="white" color="gray" />
                <div className="col-md-6">
                    <div className="row">
                        <div className={"col-md-12 "} 
                            onClick={this.handleUserColumnClick}
                            style={columnStyle}>
                            <div className='col-md-12' 
                                style={columnTitleStyle}>
                                Users
                            </div>
                            <div className='col-md-12' 
                                style={searchTextStyle}>
                                <input  type='text' 
                                        style={{width: "100%"}} 
                                        className="form-control"
                                        onChange={this.handleOnProjectSearch} />
                            </div>
                            <div style={{width: "100%", height: "52vh", overflow: "auto"}}>
                                <ItemsList 
                                    name='userEmail'
                                    label='userEmail'
                                    selected={this.state.selectedUser}
                                    showList={true}
                                    onClick={this.handleOnUserClick}
                                    data={this.state.users}
                                    showProcess={this.state.showUsersProcess}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row" 
                        style={{height: "5vh", backgroundColor: 'lightblue', borderRadius: "25px"}}>
                        <div className="col-md-1">
                            <button className="btn btn-sm btn-primary"
                                onClick={this.handleGoLeft}>
                                <FontAwesomeIcon icon="chevron-left" />
                            </button>
                        </div>
                        <div className="col-md-10"></div>
                        <div className="col-md-1"
                            onClick={this.handleGoRight}>
                            <button className="btn btn-sm btn-primary" >
                            <FontAwesomeIcon icon="chevron-right" />
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className="col-md-6" style={propColumnStyle}>
                    <div className='col-md-12' 
                        style={propColumnTitleStyle}>
                        {this.state.propControlTitle + " Properties"}
                    </div>
                    <ClientUserForm
                            user={this.state.selectedUser}
                            handlers={this.userFormHandlers}
                            clients={this.state.clients}
                            projects={this.state.projects}
                            contracts={this.state.contracts}
                            showFormProcess={this.state.showFormProcess}
                            />
                </div>
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
            </div>
        );
   }

    renderProperties = () => {
        switch(this.state.propControl)
        {
            case 'userForm':
                return  (
                        <ClientUserForm
                            user={this.state.user}
                            handlers={this.userFormHandlers}
                            showFormProcess={this.state.showFormProcess}
                            />
                        )
            

            // case 'AssetForm':
            //     return (<AssetForm 
            //         asset={this.state.asset} 
            //         handlers={this.assetFormHandlers} 
            //         showFormProcess={this.state.showFormProcess} />);
            
            // case 'ContractForm':
            //     return (<ContractForm 
            //         contract={this.state.contract} 
            //         showFormProcess={this.state.showFormProcess} />);
  
            // case 'MainLogForm':
            //     return (<MainLogForm 
            //         mainLog={this.state.mainLog}
            //         handlers={this.mainLogFormHandlers} 
            //         showFormProcess={this.state.showFormProcess} />);
            
            default:
                break;
        }
    }
}

export default ClientUserAdmin;

const columnStyle = {
    border: "solid",
    borderWidth: "1px",
    borderColor: "lightgray",
    borderRadius: "25px",
    height: "70vh"
}

const propColumnStyle = {
    border: "solid",
    borderWidth: "1px",
    borderColor: "lightgray",
    borderRadius: "25px",
    height: "75vh",
    backgroundColor: 'lightgray',
    overflow: "auto"
}

const columnTitleStyle = {
    color: "blue", 
    fontSize: '1vw', 
    fontWeight: 'bold', 
    borderBottom: 'solid', 
    borderColor: 'lightgray',
    borderWidth: 1,
    paddingTop: "10px",
    marginBottom: "10px",
    textAlign: 'left'
} 

const searchTextStyle = {
    fontSize: '0.75vw', 
    borderBottom: 'solid', 
    borderColor: 'lightgray',
    borderWidth: 1,
    paddingTop: "5px",
    paddingBottom: "5px",
    marginBottom: "10px",
    textAlign: 'left'
} 

const propColumnTitleStyle = {
    color: "blue", 
    fontSize: '1vw', 
    fontWeight: 'bold', 
    borderBottom: 'solid', 
    borderColor: 'gray',
    borderWidth: 1,
    paddingTop: "10px",
    marginBottom: "10px",
    textAlign: 'left'
} 