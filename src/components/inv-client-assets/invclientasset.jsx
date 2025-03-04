import React, { Component } from 'react';
import ItemsList from '../../common/itemslist';
import { getClientsNames, 
         getProjectsOfClient, 
         getContractsForProject } from '../../appcode/fincsoa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getClientDocument, 
         addClient, updateClientByName, 
         getProjectDocument,
         addProject, updateProjectByName,
         getContractByName,
         getAssetDoc, getAssetsList,
         addAsset, updateAsset,
         getMainLogList, getMainLogDoc,
         addMainLog, updateMainLog } from '../../appcode/invclientassets';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ClientForm from './clientform';
import ProjectForm from './projectform';
import ContractForm from './contractform';
import AssetForm from './assetform';
import MainLogForm from './mainlogform';
import { TitlePageHeader } from '../titleheader/titleheader';

class InvCliAsst extends Component {
    state = {
        fullClientsList: [],
        clientsList: [],
        projectsList: [],
        fullProjectsList: [],
        contractsList: [],
        fullContractsList: [],
        assetsItems: [],
        fullAssetsItems: [],
        assetsMaintLog: [],
        fullAssetsMaintLog: [],
        showClientsProcess: true,
        showProjectsProcess: false,
        showContractsProcess: false,
        showAssetsProcess: false,
        showMainLogProcess: false,
        showFormProcess: "hidden",
        selectedClient: '',
        selectedProject: '',
        selectedContract: '',
        selectedAsset: '',
        selectedMainLog: '',
        visibileColumns: {
            first: 0,
            last: 2
        },
        visibilityFlags: [
            "",
            "",
            "",
            "hidden",
            "hidden"
        ],
        propControl: ``,
        propControlTitle: 'Client',
        client: {
            clName: '',
            clEmail: '',
            clContactName: '',
            clContactNumber: '',
            clAddress: '',
            SitesCount: 0
        },
        project: {
            prjName: '',
            prjCode: '',
            prjDescription: '',
            clientName: ''
        },
        asset: {
            Title: '',
            pool: false,
            assetEquip: false,
            Description: '',
            Location: '',
            Count: 0,
            serialNo: '',
            Remarks: ''
        },
        contract: {
            contName: '',
            contCode: '',
            Description: '',
            contactEmails: '',
            contactPerson: '',
            effectDate: '',
            expiryDate: ''
        },
        mainLog: {
            logId: '',
            logDate: '',
            logDetails: '',
            logPerformedBy: ''
          },
        uprofile: {},

        locations: []
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

    clientFormHandlers = {
        handleClientNameChange: (event) => {
            let client = {...this.state.client};
            client.clName = event.currentTarget.value;
    
            this.setState({ client });
        },
    
        handleClientEmailChange: (event) => {
            let client = {...this.state.client};
            client.clEmail = event.currentTarget.value;
    
            this.setState({ client });
        },
    
        handleContactNameChange: (event) => {
            let client = {...this.state.client};
            client.clContactName = event.currentTarget.value;
    
            this.setState({ client });
        },
    
        handleContactNumberChange: (event) => {
            let client = {...this.state.client};
            client.clContactNumber = event.currentTarget.value;
    
            this.setState({ client });
        },
    
        handleAddressChange: (event) => {
            let client = {...this.state.client};
            client.clAddress = event.currentTarget.value;
    
            this.setState({ client });
        },
        
        handleOnAdd: () => {
            let client = {...this.state.client};

            client.clName = "";
            client.clEmail = "";
            client.clContactName = "";
            client.clContactNumber = "";
            client.clAddress = "";

            this.setState({ client });
        },

        handleOnCancel: () => {
            getClientDocument(this.state.selectedClient)
                .then(result => {
                    let clients = [...result.Result];
                    let client = {...clients[0]};

                    this.setState({ client });
                })
                .catch(error => {
                    console.log(error);
                });
        },

        handleOnSave: (flags) => {
            this.setState({ showFormProcess: "" })
            let client = {...this.state.client};

            if(flags.isAdd)
            {
                addClient(client)
                    .then(result => {
                        let clientsList = [...this.state.clientsList];

                        clientsList.push(client);
                        clientsList = clientsList.sort(function(a, b){
                            var x = a.clName.toLowerCase();
                            var y = b.clName.toLowerCase();
                            if (x < y) {return -1;}
                            if (x > y) {return 1;}
                            return 0;
                        });

                        this.setState({ clientsList, showFormProcess: "hidden" });
                        
                        toast.success('New Client Saved Successfully...',
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
                updateClientByName(client)
                    .then(result => {
                        this.setState({ showFormProcess: "hidden" });
                        
                        toast.success('Exitsing Client Updated Successfully...',
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

    projectFormHandlers = {
        handleProjectNameChange: (event) => {
            let project = {...this.state.project};
            project.prjName = event.currentTarget.value;
    
            this.setState({ project });
        },
    
        handleProjectCodeChange: (event) => {
            let project = {...this.state.project};
            project.prjCode = event.currentTarget.value;
    
            this.setState({ project });
        },
    
        handleProjectDescriptionChange: (event) => {
            let project = {...this.state.project};
            project.prjDescription = event.currentTarget.value;
    
            this.setState({ project });
        },
    
        handleClientNameChange: (event) => {
            let project = {...this.state.project};
            project.clientName = event.currentTarget.value;
    
            this.setState({ project });
        },
            
        handleOnAdd: () => {
            let project = {...this.state.project};

            project.prjName = "";
            project.prjCode = "";
            project.prjDescription = "";
            project.clientName = this.state.selectedClient;
            
            this.setState({ project });
        },

        handleOnCancel: () => {
            getProjectDocument(this.state.selectedProject)
                .then(result => {
                    let projects = [...result.Result];
                    let project = {...projects[0]};

                    this.setState({ project });
                })
                .catch(error => {
                    console.log(error);
                });
        },

        handleOnSave: (flags) => {
            this.setState({ showFormProcess: "" })
            let project = {...this.state.project};

            if(flags.isAdd)
            {
                addProject(project)
                    .then(result => {
                        let projectsList = [...this.state.projectsList];

                        projectsList.push(project);
                        projectsList = projectsList.sort(function(a, b){
                            var x = a.prjName.toLowerCase();
                            var y = b.prjName.toLowerCase();
                            if (x < y) {return -1;}
                            if (x > y) {return 1;}
                            return 0;
                        });

                        this.setState({ projectsList, showFormProcess: "hidden" });
                        
                        toast.success('New Project Saved Successfully...',
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
                updateProjectByName(project)
                    .then(result => {
                        this.setState({ showFormProcess: "hidden" });
                        
                        toast.success('Exitsing Project Updated Successfully...',
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

    assetFormHandlers = {
        handleAssetTitleChange: (event) => {
            let asset = {...this.state.asset};
            asset.Title = event.currentTarget.value;
    
            this.setState({ asset });
        },

        handleAssetPoolChange: (event) => {
            let asset = {...this.state.asset};
            asset.pool = event.currentTarget.checked; // ? 1 : 0;
    
            this.setState({ asset });
        },

        handleAssetAssetEquipChange: (event) => {
            let asset = {...this.state.asset};

            console.log('Asset Handler: ', asset);
            asset.assetEquip = event.currentTarget.checked; // ? 1 : 0;
    
            this.setState({ asset });
        },
    
        handleAssetLocationChange: (event) => {
            let asset = {...this.state.asset};
            asset.Location = event.currentTarget.value;
    
            this.setState({ asset });
        },

        handleAssetLocationSelect: (event) => {
            let asset = {...this.state.asset};
    
            asset.Location = event.currentTarget.value;
    
            this.setState({ asset });
        },
    
        handleAssetDescriptionChange: (event) => {
            let asset = {...this.state.asset};
            asset.Description = event.currentTarget.value;
    
            this.setState({ asset });
        },
    
        handleAssetCountChange: (event) => {
            let asset = {...this.state.asset};
            asset.Count = event.currentTarget.value;
    
            this.setState({ asset });
        },

        handleAssetRemarksChange: (event) => {
            let asset = {...this.state.asset};
            asset.Remarks = event.currentTarget.value;
    
            this.setState({ asset });
        },

        handleAssetSNoChange: (event) => {
            let asset = {...this.state.asset};
            asset.serialNo = event.currentTarget.value;
    
            this.setState({ asset });
        },
            
        handleOnAdd: () => {
            let asset = {...this.state.asset};

            asset.Title = "";
            asset.pool = false;
            asset.assetEquip = false;
            asset.Location = "";
            asset.Description = "";
            asset.Count = 0;
            asset.serialNo = '';
            asset.Remarks = '';
            
            this.setState({ asset });
        },

        handleOnCancel: () => {
            const { selectedProject, selectedContract, selectedAsset } = this.state;

            if(selectedAsset === '') 
            {   let asset = {
                Title: '',
                pool: false,
                assetEquip: false,
                Description: '',
                Location: '',
                Count: 0,
                serialNo: '',
                Remarks: '' }
                this.setState({ asset });
                return;
            }

            getAssetDoc(selectedProject, selectedContract, selectedAsset)
                .then(result => {
                    let asset = {...result.Result};

                    this.setState({ asset });
                })
                .catch(error => {
                    console.log(error);
                });
        },

        handleOnSave: async (flags) => {
            this.setState({ showFormProcess: "" })
            let asset = {...this.state.asset};
            let prjName = this.state.selectedProject;
            let contName = this.state.selectedContract;

            if(flags.isAdd)
            {
                return addAsset(prjName, contName, asset)
                    .then(result => {
                        if(result.Success === 'Ok')
                        {
                            let assetsItems = [...this.state.assetsItems];
    
                            assetsItems.push(asset);
                            assetsItems = assetsItems.sort(function(a, b){
                                var x = a.Title.toLowerCase();
                                var y = b.Title.toLowerCase();
                                if (x < y) {return -1;}
                                if (x > y) {return 1;}
                                return 0;
                            });
    
                            this.setState({ assetsItems, showFormProcess: "hidden" });
                            
                            toast.success('New Asset Saved Successfully...',
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
                            toast.warn(result.FailReason,
                            {
                                position: toast.POSITION.TOP_RIGHT,
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true
                            });
                            this.setState({ showFormProcess: "hidden" });

                        }

                        return result;
                    })
                    .catch(error => {
                        console.log(error);
                        return error;
                    });
            }
            else
            {
                return updateAsset(prjName, contName, asset)
                    .then(result => {

                        this.setState({ showFormProcess: "hidden" });
                        
                        toast.success('Exitsing Asset Updated Successfully...',
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
                        return error;
                    });
                    
            }
        }
    }

    mainLogFormHandlers = {
        handleMainLogDateChange: (event) => {
            let mainLog = {...this.state.mainLog};
            mainLog.logDate = event.currentTarget.value;
    
            this.setState({ mainLog });
        },
    
        handleMainLogPerfromedByChange: (event) => {
            let mainLog = {...this.state.mainLog};
            mainLog.logPerformedBy = event.currentTarget.value;
    
            this.setState({ mainLog });
        },
    
        handleMainLogDetailsChange: (event) => {
            let mainLog = {...this.state.mainLog};
            mainLog.logDetails = event.currentTarget.value;
    
            this.setState({ mainLog });
        },
    
        handleOnAdd: () => {
            let mainLog = {...this.state.mainLog};

            mainLog.logId = '';
            mainLog.logDate = '';
            mainLog.logPerformedBy = '';
            mainLog.logDetails = '';

            this.setState({ mainLog });
        },

        handleOnCancel: () => {
            const { selectedClient, selectedProject, selectedContract, 
                    selectedAsset, selectedMainLog} = this.state;

            getMainLogDoc(selectedClient, selectedProject, 
                          selectedContract, selectedAsset, 
                          selectedMainLog)
                .then(result => {
                    let mainLog = {...result.Result};

                    this.setState({ mainLog });
                })
                .catch(error => {
                    console.log(error);
                });
        },

        handleOnSave: (flags) => {
            this.setState({ showFormProcess: "" })
            let mainLog = {...this.state.mainLog};
            let cltName = this.state.selectedClient;
            let prjName = this.state.selectedProject;
            let contName = this.state.selectedContract;
            let asstTitle = this.state.selectedAsset;
            
            if(flags.isAdd)
            {
                addMainLog(cltName, prjName, contName, asstTitle, mainLog)
                    .then(result => {
                        mainLog = {...result.Result};
                        let assetsMaintLog = [...this.state.assetsMaintLog];

                        assetsMaintLog.push(mainLog);
                        assetsMaintLog = assetsMaintLog.sort(function(a, b){
                            var x = a.logId.toLowerCase();
                            var y = b.logId.toLowerCase();
                            if (x < y) {return -1;}
                            if (x > y) {return 1;}
                            return 0;
                        });

                        this.setState({ assetsMaintLog, showFormProcess: "hidden", mainLog });
                        
                        toast.success('New Asset Log Saved Successfully...',
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
                updateMainLog(cltName, prjName, contName, asstTitle, mainLog)
                    .then(result => {
                        this.setState({ showFormProcess: "hidden" });
                        
                        toast.success('Exitsing Asset Log Updated Successfully...',
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

    handleClientColumnClick = () => {
        let propControl= 'ClientForm';
        let propControlTitle= 'Client';
        let client = {...this.state.client};

        client.clName = '';
        client.clEmail = '';
        client.clContactName = '';
        client.clContactNumber = '';
        client.clAddress = '';

        this.setState({ propControl, propControlTitle, client });
    }

    handleOnClientClick = (clName) => {
        this.setState({ showProjectsProcess: true });
        this.setState({ projectsList: [], 
                        contractsList: [],
                        assetsItems: [],
                        assetsMaintLog: [],
                        selectedProject: '',
                        selectedContract: '',
                        selectedAsset: '',
                        selectedMainLog: ''
                    });
        let selectedClient = clName;

        getProjectsOfClient(clName)
            .then(result => {
                let projectsList = [];
                let fullProjectsList = [];

                if(result.Result.length !== 0)
                {
                    result.Result.map(c => {
                        let project = {
                            prjName: c.name
                        };
    
                        projectsList.push(project);
                        fullProjectsList.push(project);
                    });    
                }
                
                getClientDocument(clName)
                    .then(result => {
                        let clients = [...result.Result];
                        let client = {...clients[0]};

                        this.setState({ client });
                    })
                    .catch(error => {
                        console.log(error);
                    });

                this.setState({ projectsList, fullProjectsList, selectedClient });
                this.setState({ showProjectsProcess: false });
                this.setState({ propControl: 'ClientForm', propControlTitle: 'Client' });
                
            })
            .catch(error => {
                console.log(error);
            });
    }

    handleProjectColumnClick = () => {
        if(this.state.selectedClient === '')
        {
            toast.warn('You did not select a client!');
        }
        else
        {
            let propControl= 'ProjectForm';
            let propControlTitle= 'Project';
            let project = {...this.state.project};
    
            project.prjName = '';
            project.prjCode = '';
            project.prjDescription = '';
            project.clientName = '';
    
            this.setState({ propControl, propControlTitle, project });
        }
    }

    handleOnProjectClick = (prjName) => {
        this.setState({ showContractsProcess: true });
        this.setState({ contractsList: [],
                        assetsItems: [],
                        assetsMaintLog: [] });
        let selectedProject = prjName;

        getContractsForProject(prjName)
            .then(result => {
                let contractsList = [];
                let fullContractsList = [];

                if(result.Result.length !== 0) {
                    result.Result.map(c => {
                        let contract = {
                            contName: c.name
                        };
    
                        contractsList.push(contract);
                        fullContractsList.push(contract);
                    });
                }

                getProjectDocument(prjName)
                    .then(result => {
                        let projects = [...result.Result];
                        let project = {...projects[0]};

                        this.setState({ project });
                    })
                    .catch(error => {
                        console.log(error);
                    });

                this.setState({ contractsList, fullContractsList, selectedProject, 
                                propControl: 'ProjectForm', 
                                propControlTitle: 'Project' });
                this.setState({ showContractsProcess: false });
            })
            .catch(error => {
                console.log(error);
            });
    }

    handleContractColumnClick = () => {
        if(this.state.selectedProject === '')
        {
            toast.warn('You did not select a project!');
        }
        else
        {
            let propControl= 'ContractForm';
            let propControlTitle= 'Contract';
            let contract = {...this.state.contract};
    
            contract.contName = '';
            contract.contCode = '';
            contract.Description = '';
            contract.contactPerson = '';
            contract.contactEmails = '';
            contract.effectDate = '';
            contract.expiryDate = '';
    
            this.setState({ propControl, propControlTitle, contract });
        }
    }

    handleOnContractClick = (contName) => {
        this.setState({ showAssetsProcess: true });
        this.setState({ assetsItems: [],
                        assetsMaintLog: [] });
        let selectedContract = contName;
        let prjName = this.state.selectedProject;

        getAssetsList(prjName, contName)
            .then(result => {
                let assetsItems = [];
                let fullAssetsItems = [];
                let locations = [];

                if(result.Result.length !== 0) {
                    result.Result.map(c => {
                        let asset = {
                            Title: c.Title
                        };
    
                        assetsItems.push(asset);
                        fullAssetsItems.push(asset);
                    });

                    // select assets which are not asset equipments
                    const locAssets = result.Result.filter(i => !i.assetEquip);
                    locations = [...new Set(locAssets.map(la => la.Title))];
                }

                getContractByName(this.state.selectedProject, selectedContract)
                    .then(result => {
                        let contract = {...result.Result};
                        this.setState({ contract });
                    })
                    .catch(error => {
                        console.log(error);
                    });

                this.setState({ assetsItems, fullAssetsItems, selectedContract, locations,
                                propControl: 'ContractForm', 
                                propControlTitle: 'Contract' });
                this.setState({ showAssetsProcess: false });
            })
            .catch(error => {
                console.log(error);
            });

            if(this.state.visibileColumns.last < 3)
            {
                this.handleGoRight();
            }
    }

    handleOnAssetClick = (assetTitle) => {
        this.setState({ showMainLogProcess: true });
        this.setState({ assetsMaintLog: [] });
        let selectedAsset = assetTitle;
        let cltName = this.state.selectedClient;
        let prjName = this.state.selectedProject;
        let contName = this.state.selectedContract;

        getMainLogList(cltName, prjName, contName, selectedAsset)
            .then(result => {
                let assetsMaintLog = [];

                if(result.Result.length !== 0) {
                    console.log(result.Result);
                    result.Result.map(c => {
                        let mainLog = {
                            logId: c.logId
                        };
    
                        assetsMaintLog.push(mainLog);
                    });
                }

                getAssetDoc(prjName, contName, selectedAsset)
                    .then(result => {
                        let asset = {...result.Result};
                        this.setState({ asset });
                    })
                    .catch(error => {
                        console.log(error);
                    });

                this.setState({ selectedAsset, assetsMaintLog,
                                propControl: 'AssetForm', 
                                propControlTitle: 'Asset' });
                this.setState({ showMainLogProcess: false });
            })
            .catch(error => {
                console.log(error);
            });

            if(this.state.visibileColumns.last < 3)
            {
                this.handleGoRight();
            }

        if(this.state.visibileColumns.last < 4)
        {
            this.handleGoRight();
        }

    }

    handleAssetsColumnClick = () => {
        if(this.state.selectedContract === '')
        {
            toast.warn('You did not select a contract!');
        }
        else
        {
            let propControl= 'AssetForm';
            let propControlTitle= 'Asset';
            let asset = {...this.state.asset};
    
            asset = {
                Title: '',
                Description: '',
                Location: '',
                Count: 0,
                Remarks: ''
            }

            this.setState({ propControl, propControlTitle, asset });
        }
    }

    handleMainLogColumnClick = () => {
        if(this.state.selectedAsset === '')
        {
            toast.warn('You did not select an asset!');
        }
        else
        {
            let propControl= 'MainLogForm';
            let propControlTitle= 'Maintenance Log';
            let mainLog = {...this.state.mainLog};
    
            mainLog = {
                logId: '',
                logDate: '',
                logDetails: '',
                logPerformedBy: ''
            }

            this.setState({ propControl, propControlTitle, mainLog });
        }
    }

    handleOnMainLogClick = (mainLogId) => {
        this.setState({ showMainLogProcess: true });
        this.setState({ mainLog: {} });
        let selectedMainLog = mainLogId;
        let cltName = this.state.selectedClient;
        let prjName = this.state.selectedProject;
        let contName = this.state.selectedContract;
        let asstTitle = this.state.selectedAsset;

        getMainLogDoc(cltName, prjName, contName, asstTitle, selectedMainLog)
            .then(result => {
                let mainLog = result.Result;

                this.setState({ selectedMainLog, mainLog,
                                propControl: 'MainLogForm', 
                                propControlTitle: 'Maintenance Log' });
                this.setState({ showMainLogProcess: false });
            })
            .catch(error => {
                console.log(error);
            });
        

        if(this.state.visibileColumns.last < 4)
        {
            this.handleGoRight();
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
    
        this.state.showClientsProcess = true;

        getClientsNames()
            .then(result => {
                let clientsList = [];
                let fullClientsList = [];

                result.Result.map(c => {
                    let client = {
                        clName: c
                    };

                    clientsList.push(client);
                    fullClientsList.push(client);
                });

                this.setState({ propControl: 'ClientForm' });
                this.setState({ clientsList, fullClientsList });
                this.setState({ showClientsProcess: false });
            })
            .catch(error => {
                console.log(error);
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

    handleOnContractSearch = (event) => {
        let fullContractsList = [...this.state.fullContractsList];

        let contractsList = fullContractsList.filter(c => c.contName
                                                       .toLowerCase()
                                                       .indexOf(
                                                           event.currentTarget.value.toLowerCase()
                                                           ) !== -1);
        this.setState({ contractsList });
        
    } 

    handleOnAssetSearch = (event) => {
        let fullAssetsItems = [...this.state.fullAssetsItems];

        let assetsItems = fullAssetsItems.filter(c => c.title
                                                       .toLowerCase()
                                                       .indexOf(
                                                           event.currentTarget.value.toLowerCase()
                                                           ) !== -1);
        this.setState({ assetsItems });
        
    } 

    render() {
        // { data, name, label, onClick, showProcess, showList }
        return (
            <div className="col-md-12">
                <TitlePageHeader title="Clients and Contracts Assets Management" bgColor="white" color="gray" />
                <div className="col-md-8">
                    <div className="row">
                        <div className={"col-md-4 " + this.state.visibilityFlags[0]} 
                            style={columnStyle} onClick={this.handleClientColumnClick}>
                            <div className='col-md-12' 
                                style={columnTitleStyle}>
                                Clients
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
                                    name='clName'
                                    label='clName'
                                    selected={this.state.selectedClient}
                                    showList={true}
                                    onClick={this.handleOnClientClick}
                                    data={this.state.clientsList}
                                    showProcess={this.state.showClientsProcess}
                                />
                            </div>
                        </div>
                        <div className={"col-md-4 " + this.state.visibilityFlags[1]} 
                            onClick={this.handleProjectColumnClick}
                            style={columnStyle}>
                            <div className='col-md-12' 
                                style={columnTitleStyle}>
                                Projects
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
                                    name='prjName'
                                    label='prjName'
                                    selected={this.state.selectedProject}
                                    showList={true}
                                    onClick={this.handleOnProjectClick}
                                    data={this.state.projectsList}
                                    showProcess={this.state.showProjectsProcess}
                                />
                            </div>
                        </div>
                        <div className={"col-md-4 " + this.state.visibilityFlags[2]} 
                            style={columnStyle} onClick={this.handleContractColumnClick}>
                            <div className='col-md-12' 
                                style={columnTitleStyle}>
                                Contracts
                            </div>
                            <div className='col-md-12' 
                                style={searchTextStyle}>
                                <input  type='text' 
                                        style={{width: "100%"}} 
                                        className="form-control"
                                        onChange={this.handleOnContractSearch} />
                            </div>
                            <div style={{width: "100%", height: "52vh", overflow: "auto"}}>
                                <ItemsList 
                                    name='contName'
                                    label='contName'
                                    selected={this.state.selectedContract}
                                    showList={true}
                                    onClick={this.handleOnContractClick}
                                    data={this.state.contractsList}
                                    showProcess={this.state.showContractsProcess}
                                />
                            </div>
                            
                        </div>
                        <div className={"col-md-4 " + this.state.visibilityFlags[3]}
                            style={columnStyle}
                            onClick={this.handleAssetsColumnClick}>
                            <div className='col-md-12' 
                                style={columnTitleStyle}>
                                Assets
                            </div>
                            <div className='col-md-12' 
                                style={searchTextStyle}>
                                <input  type='text' 
                                        style={{width: "100%"}} 
                                        className="form-control"
                                        onChange={this.handleOnAssetSearch} />
                            </div>
                            <div style={{width: "100%", height: "52vh", overflow: "auto"}}>
                                <ItemsList 
                                    name='Title'
                                    label='Title'
                                    selected={this.state.selectedAsset}
                                    showList={true}
                                    onClick={this.handleOnAssetClick}
                                    data={this.state.assetsItems}
                                    showProcess={this.state.showAssetsProcess}
                                />
                            </div>
                        </div>
                        <div className={"col-md-4 " + this.state.visibilityFlags[4]}
                            style={columnStyle} onClick={this.handleMainLogColumnClick}>
                            <div className='col-md-12' 
                                style={columnTitleStyle}>
                                Maintainance Log
                            </div>
                            <div className='col-md-12' 
                                style={searchTextStyle}>
                                <input  type='text' 
                                        style={{width: "100%"}} 
                                        className="form-control"
                                        onChange={this.handleOnMainLogSearch} />
                            </div>
                            <div style={{width: "100%", height: "52vh", overflow: "auto"}}>
                                <ItemsList 
                                    name='logId'
                                    label='logId'
                                    selected={this.state.selectedMainLog}
                                    showList={true}
                                    data={this.state.assetsMaintLog}
                                    onClick={this.handleOnMainLogClick}
                                    showProcess={this.state.showMainLogProcess}
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
            case 'ClientForm':
                return (<ClientForm 
                    client={this.state.client} 
                    handlers={this.clientFormHandlers} 
                    showFormProcess={this.state.showFormProcess} />);
            case 'ProjectForm':
                return (<ProjectForm 
                    project={this.state.project} 
                    handlers={this.projectFormHandlers} 
                    showFormProcess={this.state.showFormProcess} />);

            case 'AssetForm':
                return (<AssetForm 
                    asset={this.state.asset} 
                    locations={this.state.locations}
                    handlers={this.assetFormHandlers} 
                    showFormProcess={this.state.showFormProcess} />);
            
            case 'ContractForm':
                return (<ContractForm 
                    contract={this.state.contract} 
                    showFormProcess={this.state.showFormProcess} />);
  
            case 'MainLogForm':
                return (<MainLogForm 
                    mainLog={this.state.mainLog}
                    handlers={this.mainLogFormHandlers} 
                    showFormProcess={this.state.showFormProcess} />);
            
            default:
                break;
        }
    }
}

export default InvCliAsst;

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