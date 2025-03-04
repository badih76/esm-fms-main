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
         getMeterDoc, getMetersList,
         addMeter, updateMeter,
         getMeterReadingList, getMeterReadingDoc,
         addMeterReading, updateMeterReading } from '../../appcode/invclientassets';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ClientForm from './clientform';
import ProjectForm from './projectform';
import ContractForm from './contractform';
import MetersForm from './metersform';
import ReadingsForm from './meterreadingsform';
import { TitlePageHeader } from '../titleheader/titleheader';

class ContMeterReadings extends Component {
    state = {
        fullClientsList: [],
        clientsList: [],
        projectsList: [],
        fullProjectsList: [],
        contractsList: [],
        fullContractsList: [],
        metersItems: [],
        fullMetersItems: [],
        meterReadings: [],
        fullMeterReadings: [],
        showClientsProcess: true,
        showProjectsProcess: false,
        showContractsProcess: false,
        showMetersProcess: false,
        showMainLogProcess: false,
        showFormProcess: "hidden",
        selectedClient: '',
        selectedProject: '',
        selectedContract: '',
        selectedMeter: '',
        selectedReading: '',
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
        meter: {
            Number: '',
            Location: '',
            Remarks: '',
            Type: ''
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
        meterReading: {
            readingDate: new Date(),
            readingValue: 0,
            consumption: 0
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

    metersFormHandlers = {
        handleGetReadings: (event) => {
            // this.setState({ showMainLogProcess: true });
            // this.setState({ assetsMaintLog: [] });
            // let selectedMeter = this.state.selectedMeter;
            // let cltName = this.state.selectedClient;
            // let prjName = this.state.selectedProject;
            // let contName = this.state.selectedContract;
            // let meterReadingsValue = [];

            // getMeterReadingList(cltName, prjName, contName, selectedMeter)
            //     .then(result => {
            //         console.log(result);
            //         if(result.Result.length !== 0) {
            //             result.Result.map(c => {
            //                 let meterReading = {
            //                     readingDate: c.readingDate,
            //                     readingValue: c.readingValue
            //                 };
            //                 console.log(meterReading);
            //                 meterReadingsValue.push(meterReading);
            //             });
            //         }

            //     })
            //     .catch(error => {
            //         console.log(error);
            //     });

            // console.log(meterReadingsValue);
            return this.state.meterReadings;
        },

        handleMeterNumberChange: (event) => {
            let meter = {...this.state.meter};
            meter.Number = event.currentTarget.value;
    
            this.setState({ meter });
        },
    
        handleMeterLocationChange: (event) => {
            let meter = {...this.state.meter};
            meter.Location = event.currentTarget.value;
    
            this.setState({ meter });
        },
    
        handleMeterTypeChange: (event) => {
            let meter = {...this.state.meter};
            meter.Type = event.currentTarget.value;
    
            this.setState({ meter });
        },
    
        handleMeterCountChange: (event) => {
            let meter = {...this.state.meter};
            meter.Count = event.currentTarget.value;
    
            this.setState({ meter });
        },

        handleMeterRemarksChange: (event) => {
            let meter = {...this.state.meter};
            meter.Remarks = event.currentTarget.value;
    
            this.setState({ meter });
        },
            
        handleOnAdd: () => {
            let meter = {...this.state.meter};

            meter.Number = "";
            meter.Location = "";
            // meter.Description = "";
            // meter.Count = 0;
            meter.Remarks = '';
            
            this.setState({ meter });
        },

        handleOnCancel: () => {
            const { selectedProject, selectedContract, selectedMeter } = this.state;

            if(selectedMeter === '') 
            {   let meter = {
                Number: '',
                // Description: '',
                Location: '',
                // Count: 0,
                Remarks: '' }
                this.setState({ meter });
                return;
            }

            getMeterDoc(selectedProject, selectedContract, selectedMeter)
                .then(result => {
                    let meter = {...result.Result};

                    this.setState({ meter });
                })
                .catch(error => {
                    console.log(error);
                });
        },

        handleOnSave: async (flags) => {
            this.setState({ showFormProcess: "" })
            let meter = {...this.state.meter};
            let prjName = this.state.selectedProject;
            let contName = this.state.selectedContract;

            if(flags.isAdd)
            {
                return addMeter(prjName, contName, meter)
                    .then(result => {
                        if(result.Success === 'Ok')
                        {
                            let metersItems = [...this.state.metersItems];
    
                            metersItems.push(meter);
                            metersItems = metersItems.sort(function(a, b){
                                var x = a.Number.toLowerCase();
                                var y = b.Number.toLowerCase();
                                if (x < y) {return -1;}
                                if (x > y) {return 1;}
                                return 0;
                            });
    
                            this.setState({ metersItems, showFormProcess: "hidden" });
                            
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
                return updateMeter(prjName, contName, meter)
                    .then(result => {

                        this.setState({ showFormProcess: "hidden" });
                        
                        toast.success('Exitsing Meter Updated Successfully...',
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

    readingsFormHandlers = {
        handleReadingDateChange: (event) => {
            let meterReading = {...this.state.meterReading};
            meterReading.readingDate = event.currentTarget.value;
    
            this.setState({ meterReading });
        },
    
        handleReadingValueChange: (event) => {
            let meterReading = {...this.state.meterReading};
            meterReading.readingValue = event.currentTarget.value;
    
            this.setState({ meterReading });
        },

        handleOnAdd: () => {
            let meterReading = {...this.state.meterReading};

            meterReading.readingDate = new Date();
            meterReading.readingValue = "";
            meterReading.consumption = 0;

            this.setState({ meterReading });
        },

        handleOnCancel: () => {
            const { selectedClient, selectedProject, selectedContract, 
                    selectedMeter, selectedReading} = this.state;

                getMeterReadingList(selectedClient, selectedProject, 
                          selectedContract, selectedMeter, 
                          selectedReading)
                .then(result => {
                    let meterReading = {...result.Result};

                    this.setState({ meterReading });
                })
                .catch(error => {
                    console.log(error);
                });
        },

        handleOnSave: (flags) => {
            this.setState({ showFormProcess: "" })
            let meterReading = {...this.state.meterReading};
            let cltName = this.state.selectedClient;
            let prjName = this.state.selectedProject;
            let contName = this.state.selectedContract;
            let meterNumber = this.state.selectedMeter;
            
            if(flags.isAdd)
            {
                addMeterReading(cltName, prjName, contName, meterNumber, meterReading)
                    .then(result => {
                        // meterReading = {...result.Result};
                        let meterReadings = [...this.state.meterReadings];

                        meterReadings.push(meterReading);
                        meterReadings = meterReadings.sort(function(a, b){                            
                            var x = a.readingDate;
                            var y = b.readingDate;
                            if (x < y) {return -1;}
                            if (x > y) {return 1;}
                            return 0;
                        });

                        for(let n=0; n < meterReadings.length; n++)
                        {
                            if(meterReadings[n].readingDate === meterReading.readingDate)
                            {
                                let prevReading = 0;

                                if(n !== 0)
                                {
                                    prevReading = meterReadings[n].readingValue - meterReadings[n-1].readingValue;
                                    
                                }
                                else
                                {
                                    prevReading = 0;
                                }

                                meterReading.consumption = prevReading;
                            }
                        }

                        this.setState({ meterReadings, showFormProcess: "hidden", meterReading });
                        
                        toast.success('New Meter Reading Saved Successfully...',
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
                updateMeterReading(cltName, prjName, contName, meterNumber, meterReading)
                    .then(result => {
                        this.setState({ showFormProcess: "hidden" });
                        
                        toast.success('Exitsing Meter Reading Updated Successfully...',
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
        this.setState({ showMetersProcess: true });
        this.setState({ metersItems: [],
                        meterReadings: [] });
        let selectedContract = contName;
        let prjName = this.state.selectedProject;

        getMetersList(prjName, contName)
            .then(result => {
                let metersItems = [];
                let fullMetersItems = [];

                if(result.Result.length !== 0) {
                    result.Result.map(c => {
                        let meter = {
                            Number: c.Number,
                            Type: c.Type
                        };
    
                        metersItems.push(meter);
                        fullMetersItems.push(meter);
                    });
                }

                getContractByName(this.state.selectedProject, selectedContract)
                    .then(result => {
                        let contract = {...result.Result};
                        this.setState({ contract });
                    })
                    .catch(error => {
                        console.log(error);
                    });

                this.setState({ metersItems, fullMetersItems, selectedContract, 
                                propControl: 'ContractForm', 
                                propControlTitle: 'Contract' });
                this.setState({ showMetersProcess: false });
            })
            .catch(error => {
                console.log(error);
            });

            if(this.state.visibileColumns.last < 3)
            {
                this.handleGoRight();
            }
    }

    handleOnMeterClick = (meterNumber) => {
        this.setState({ showMainLogProcess: true });
        this.setState({ assetsMaintLog: [] });
        let selectedMeter = meterNumber;
        let cltName = this.state.selectedClient;
        let prjName = this.state.selectedProject;
        let contName = this.state.selectedContract;

        getMeterReadingList(cltName, prjName, contName, selectedMeter)
            .then(result => {
                let meterReadings = [];

                if(result.Result.length !== 0) {
                    result.Result.map(c => {
                        let meterReading = {
                            readingDate: c.readingDate,
                            readingValue: c.readingValue
                        };
    
                        meterReadings.push(meterReading);
                    });
                }

                getMeterDoc(prjName, contName, selectedMeter)
                    .then(result => {
                        let meter = {...result.Result};
                        this.setState({ meter });
                    })
                    .catch(error => {
                        console.log(error);
                    });

                this.setState({ selectedMeter, meterReadings,
                                propControl: 'MetersForm', 
                                propControlTitle: 'Meters' });
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

    handleMetersColumnClick = () => {
        if(this.state.selectedContract === '')
        {
            toast.warn('You did not select a contract!');
        }
        else
        {
            let propControl= 'MetersForm';
            let propControlTitle= 'Meters';
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

    handleReadingsLogColumnClick = () => {
        if(this.state.selectedMeter === '')
        {
            toast.warn('You did not select a Meter!');
        }
        else
        {
            let propControl= 'ReadingsForm';
            let propControlTitle= 'Meter Reading Log';
            let meterReading = {...this.state.meterReading};
    
            meterReading = {
                readingDate: new Date(),
                readingValue: ''
              }
    

            this.setState({ propControl, propControlTitle, meterReading });
        }
    }

    handleOnMeterReadingsClick = (readingDate) => {
        this.setState({ showMainLogProcess: true });
        this.setState({ meterReading: {} });
        let meterReading = {};
        let selectedReadingDate = readingDate;
        let cltName = this.state.selectedClient;
        let prjName = this.state.selectedProject;
        let contName = this.state.selectedContract;
        let meterNumber = this.state.selectedMeter;

        // for(let n=0; n<this.state.meterReadings.length; n++)
        // {
        //     if(this.state.meterReadings[n].readingDate === readingDate)
        //     {
        //         let prevReading = 0;

        //         if(n !== 0)
        //         {
        //             prevReading = this.state.meterReadings[n].readingValue - this.state.meterReadings[n-1].readingValue;
                    
        //         }
        //         else
        //         {
        //             prevReading = 0;
        //         }

        //         meterReading = {...this.state.meterReadings[n]};
        //         meterReading.consumption = prevReading;

        //         // this.setState({ meterReading }, () => {
        //         //     console.log(this.state.meterReading);
        //         // });
        //         console.log(meterReading);
        //         this.setState({ selectedReadingDate, meterReading, 
        //                         propControl: 'ReadingsForm', 
        //                         propControlTitle: 'Meter Readings',
        //                         showMainLogProcess: false }, () => { console.log(this.state.meterReading); });
        //     }
        // }

        // console.log('Outside For: ', meterReading);



        getMeterReadingDoc(cltName, prjName, contName, meterNumber, selectedReadingDate)
            .then(result => {
                console.log('Result: ', result.Result);
                let meterReading = result.Result;

                for(let n=0; n<this.state.meterReadings.length; n++)
                {
                    if(this.state.meterReadings[n].readingDate === meterReading.readingDate)
                    {
                        let prevReading = 0;

                        if(n !== 0)
                        {
                            prevReading = this.state.meterReadings[n].readingValue - this.state.meterReadings[n-1].readingValue;
                            
                        }
                        else
                        {
                            prevReading = 0;
                        }

                        meterReading.consumption = prevReading;

                    }
                }

                this.setState({ selectedReadingDate, meterReading,
                                propControl: 'ReadingsForm', 
                                propControlTitle: 'Meter Readings' });
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
                            onClick={this.handleMetersColumnClick}>
                            <div className='col-md-12' 
                                style={columnTitleStyle}>
                                Meters
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
                                    name='Number'
                                    label='Number'
                                    selected={this.state.selectedMeter}
                                    showList={true}
                                    onClick={this.handleOnMeterClick}
                                    data={this.state.metersItems}
                                    showProcess={this.state.showMetersProcess}
                                    mtype="meter"
                                />
                            </div>
                            
                        </div>
                        <div className={"col-md-4 " + this.state.visibilityFlags[4]}
                            style={columnStyle} onClick={this.handleReadingsLogColumnClick}>
                            <div className='col-md-12' 
                                style={columnTitleStyle}>
                                Meter Readings
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
                                    name='readingDate'
                                    label='readingDate'
                                    selected={this.state.selectedMainLog}
                                    showList={true}
                                    data={this.state.meterReadings}
                                    onClick={this.handleOnMeterReadingsClick}
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

            case 'MetersForm':
                return (<MetersForm 
                    meter={this.state.meter} 
                    projectName={this.state.selectedProject}
                    contractName={this.state.selectedContract}
                    meterNumber={this.state.selectedMeter}
                    handlers={this.metersFormHandlers} 
                    showFormProcess={this.state.showFormProcess} />);
            
            case 'ContractForm':
                return (<ContractForm 
                    contract={this.state.contract} 
                    showFormProcess={this.state.showFormProcess} />);
  
            case 'ReadingsForm':
                return (<ReadingsForm 
                    meterReading={this.state.meterReading}
                    handlers={this.readingsFormHandlers} 
                    showFormProcess={this.state.showFormProcess} />);
            
            default:
                break;
        }
    }
}

export default ContMeterReadings;

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