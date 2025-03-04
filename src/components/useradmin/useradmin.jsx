import React, { Component } from 'react';
import ItemsList from '../../common/itemslist';
import { getUserGroups, getUserGroup, getUsers,
         addUserGroup, editUserGroup,
         getUser, addUser, editUser } from '../../appcode/useradmin';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { TitlePageHeader } from '../titleheader/titleheader';
import UserGroupForm from './usergroupform';
import UserForm from './userform';

class UserAdmin extends Component {
    state = {
        showUGProcess: true,
        showUsersProcess: false,
        showFormProcess: "hidden",
        selectedUG: '',
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
        userGroups: [],
        user: {
            UID: '',
            UserGroup: '',
            disabled: false,
            displayName: '',
            email: '',
            emailVerified: false,
            password: '',
            photoURL: '',
            unitsPath: ''
        },
        oldPw: '',
        userGroup: {
            Name: '',
            Privileges: {
                Superuser: false,
                Dashboard: false,
                Masters: false,
                MastHDD: false,
                MastInvD: false,
                MastUAdmin: false,
                MastSProf: false,
                Assets: false,
                AssetsClients: false,
                AssetsContracts: false,
                Financials: false,
                FinClientSOA: false,
                Maintenance: false,
                MaintenanceJP: false,
                MaintenanceJC: false,
                CustCare: false,
                CustCareTkt: false,
                Reports: false
            }
        },
        uprofile: {}
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

    userGroupFormHandlers = {
        handleOnChange: (val, name) => {
            let userGroup = {...this.state.userGroup};

            userGroup.Privileges[name] = val;
            this.setState(userGroup);
        },

        handleInputChange: (val, name) => {
            console.log(name, val);

            let userGroup = {...this.state.userGroup};

            userGroup.Name = val;
            this.setState({ userGroup });
        },
        
        handleOnAdd: () => {
            let userGroup = {
                    Name: '',
                    Privileges: {
                        Superuser: false,
                        Dashboard: false,
                        Masters: false,
                        MastHDD: false,
                        MastInvD: false,
                        MastUAdmin: false,
                        MastSProf: false,
                        Assets: false,
                        AssetsClients: false,
                        AssetsContracts: false,
                        Financials: false,
                        FinClientSOA: false,
                        Maintenance: false,
                        MaintenanceJP: false,
                        MaintenanceJC: false,
                        CustCare: false,
                        CustCareTkt: false,
                        Reports: false
                    }
            }

            this.setState({ userGroup });
        },

        handleOnCancel: () => {
            // getClientDocument(this.state.selectedClient)
            //     .then(result => {
            //         let clients = [...result.Result];
            //         let client = {...clients[0]};

            //         this.setState({ client });
            //     })
            //     .catch(error => {
            //         console.log(error);
            //     });
        },

        handleOnSave: (flags) => {
            this.setState({ showFormProcess: "" })
            let userGroup = {...this.state.userGroup};

            if(flags.isAdd)
            {
                addUserGroup(userGroup)
                    .then(result => {
                        let userGroups = [...this.state.userGroups];

                        userGroups.push(userGroup);
                        userGroups = userGroups.sort(function(a, b){
                            var x = a.Name.toLowerCase();
                            var y = b.Name.toLowerCase();
                            if (x < y) {return -1;}
                            if (x > y) {return 1;}
                            return 0;
                        });

                        this.setState({ userGroups, showFormProcess: "hidden" });
                        
                        toast.success('New User Group Saved Successfully...',
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
                editUserGroup(userGroup)
                    .then(result => {
                        console.log("Result: ", result);
                        this.setState({ showFormProcess: "hidden" });
                        
                        toast.success('Exitsing User Group Updated Successfully...',
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
        }
    }

    userFormHandlers = {
        handleChange: (value, name = null) => {
            let user = {...this.state.user};
            user[name] = value;
    
            this.setState({ user });
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
                UID: '',
                UserGroup: '',
                disabled: false,
                displayName: '',
                email: '',
                emailVerified: false,
                password: '',
                phoneNumber: '',
                photoURL: '',
                unitsPath: ''
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
            let user = {...this.state.user};

            if(flags.isAdd)
            {
                addUser(user)
                    .then(result => {
                        let users = [...this.state.users];

                        users.push(user);
                        users = users.sort(function(a, b){
                            var x = a.displayName.toLowerCase();
                            var y = b.displayName.toLowerCase();
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
                editUser(user, this.state.oldPw)
                    .then(result => {
                        this.setState({ showFormProcess: "hidden" });
                        
                        toast.success('Exitsing User Updated Successfully...',
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

        }
    }


    handleUGColumnClick = () => {
        
        let propControl= 'userGroupForm';
        let propControlTitle= 'User Groups';
        let userGroup = {
            Name: '',
            Privileges: {
                Superuser: false,
                Dashboard: false,
                Masters: false,
                MastHDD: false,
                MastInvD: false,
                MastUAdmin: false,
                MastSProf: false,
                Assets: false,
                AssetsClients: false,
                AssetsContracts: false,
                Financials: false,
                FinClientSOA: false,
                Maintenance: false,
                MaintenanceJP: false,
                MaintenanceJC: false,
                CustCare: false,
                CustCareTkt: false,
                Reports: false
            }
        }

        this.setState({ propControl, propControlTitle, userGroup });
    }

    handleOnUGClick = (userGroupName) => {
        this.setState({ showUsersProcess: true });
        this.setState({ users: [], 
                        selectedUser: '' 
                    });
        let selectedUG = {};
        let userGroup = {};
        let users = [];
    
        getUsers(userGroupName)
        .then(result => {

            if(result.Result.length > 0)
            {
                users = [...result.Result];
            }

            return getUserGroup(userGroupName);
        })
        .then(result => {
            selectedUG = {...result.Result};
            userGroup = {...result.Result};
            
            this.setState({ users, 
                            selectedUG, userGroup,
                            showUsersProcess: false, 
                            propControl: 'userGroupForm' });

        })
        .catch(error => {
            console.log("Error: ", error);
        })
    }

    handleUserColumnClick = () => {
        if(this.state.selectedUG === '')
        {
            toast.warn('You did not select a User Group!');
        }
        else
        {
            let propControl= 'userForm';
            let propControlTitle= 'Users';
            let user = {
                UID: '',
                UserGroup: '',
                disabled: false,
                displayName: '',
                email: '',
                emailVerified: false,
                password: '',
                phoneNumber: '',
                photoURL: '',
                unitsPath: ''
            }
    
            this.setState({ propControl, propControlTitle, user });
        }
    }

    handleOnUserClick = (userName) => {
        this.setState({ showUsersProcess: true });
        this.setState({ user: {}, 
                        oldPw: '',
                        selectedUser: '' 
                    });
        let selectedUser = {};
        let user = {};
        let oldPw = '';
    
        console.log(userName);

        getUser(userName)
        .then(result => {
            console.log(result);

            if(result.Success === "Ok")
            {
                user = {...result.Result};
            }
            else
            {
                console.log("Not OK: ", result);
            }
            
            selectedUser = {...user};
            
            this.setState({ user, 
                            selectedUser,
                            oldPw: user.password,
                            showUsersProcess: false, 
                            propControl: 'userForm' });

        })
        .catch(error => {
            console.log("Error: ", error);
        })
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
        getUserGroups()
        .then(result => {
            let userGroups = [];

            if(result.Result.length > 0)
            {
                userGroups = [...result.Result];
            }

            this.setState({ userGroups, showUGProcess: false });
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
                <TitlePageHeader title="User Administration" bgColor="white" color="gray" />
                <div className="col-md-8">
                    <div className="row">
                        <div className={"col-md-6 " + this.state.visibilityFlags[0]} 
                            style={columnStyle} onClick={this.handleUGColumnClick}>
                            <div className='col-md-12' 
                                style={columnTitleStyle}>
                                User Groups
                            </div>
                            <div className='col-md-12' 
                                style={searchTextStyle}>
                                <input  type='text' 
                                        style={{width: "100%"}} 
                                        className="form-control"
                                        onChange={this.handleOnClientSearch} />
                            </div>
                            <div style={{width: "100%", height: "52vh", overflow: "auto"}}>
                                <ItemsList 
                                    name='Name'
                                    label='Name'
                                    selected={this.state.selectedUG}
                                    showList={true}
                                    onClick={this.handleOnUGClick}
                                    data={this.state.userGroups}
                                    showProcess={this.state.showUGProcess}
                                />
                            </div>
                        </div>
                        <div className={"col-md-6 " + this.state.visibilityFlags[1]} 
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
                                    name='displayName'
                                    label='displayName'
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
                
                <div className="col-md-4" style={propColumnStyle}>
                    <div className='col-md-12' 
                        style={propColumnTitleStyle}>
                        {this.state.propControlTitle + " Properties"}
                    </div>
                    {this.renderProperties()}
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
            case 'userGroupForm':
                return (<UserGroupForm 
                        userGroup={this.state.userGroup}
                        handlers={this.userGroupFormHandlers}
                        showFormProcess={this.state.showFormProcess} />)

            case 'userForm':
                return (<UserForm 
                        user={this.state.user}
                        handlers={this.userFormHandlers}
                        showFormProcess={this.state.showFormProcess}
                        userGroups={this.state.userGroups} />)
            

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

export default UserAdmin;

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