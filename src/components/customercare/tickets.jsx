import React, { Component } from 'react';
import TicketsList from './ticketslist';
import ToolsBar from '../../common/toolsbar';
import TicketForm from './ticketform';
import { TitlePageHeader } from '../titleheader/titleheader';
import _ from 'lodash';

import {    getTicketsList, getComplCat, getTicketReplies,
            addTicketSupport, postTicketReplySupport } from '../../appcode/custcaretickets';
import { getClientsNames, getProjectsOfClient, 
         getContractsForProject } from '../../appcode/fincsoa';

         import processing from '../../images/processing.gif';
import TicketDetails from './ticketdetails';

import { getAttachmentsList, getClientAttachmentsList, uploadReplyAttachment, deleteAttachment } from '../../appcode/crmuploadattachments';

class Tickets extends Component {
    state = {
        tickets: [],
        replies: [],
        selectedTicketIndex: 0,
        reply: {            
            Details: '',
            FileAttachment: {
                client: "",
                TitleText: "",
                FileName: "",
                FileSize: "",
                UploadDate: new Date().toString(),
                DownloadURL: ""
            },
            RepliedBy: '',
            tsReplyDT: new Date()
        },
        clientsList: [],
        projectsList: [],
        contractsList: [],
        compleCatList: [],

        uprofile: {},
        
        ticket: {
            AttendedBy: '',
            ClientName: '',
            ClosedBy: '',
            ClosingDT: '',
            ComplCat: '',
            ContractName: '',
            Details: '',
            Duration: 0,
            FileAttach: "",
            OpeningDT: "",
            ProjectName: '',
            ReportedBy: '',
            ReportedOn: '',
            Subject: '',
            TicketStatus: '',
            tsOpeningDT: '',
            userID: ''
        },
        buttonsOptions: {
            addButton: {
                showAdd: true,
                onAdd: () => this.handleAdd()
            },
            saveButton: {
                showSave: false,
                onSave: () => this.handleSubmit()
            },
            cancelButton: {
                showCancel: false,
                onCancel: () => this.handleCancel()
            },
            searchButton: {
                showSearch: false,
                onSearch: null
            },
            replyButton: {
                showReply: false,
                onReply: () => this.handleReply()
            }

        },
        flags: {
            isAdd: false,
            isReply: false,
            isEdit: false
        },
        showButtons: true,
        file: null
    }

    handleOnFileSelect = (event) => {
        let { value } = event.currentTarget;
        
        let reply = {...this.state.reply}

        let FileAttachment = {...reply.FileAttachment};
        let file = event.currentTarget.files[0];
        console.log('*** File: ', file);

        if(file) {
            FileAttachment.FileName = value.name;
            FileAttachment.FileName = file.name;
            FileAttachment.FileSize = file.size;
        } else {
            FileAttachment = 'X'
        }

        reply.FileAttachment = {...FileAttachment};

        this.setState({ reply, file });
    }

    handleAdd = () => {
        let ticket= {
            AttendedBy: '',
            ClientName: '',
            ClosedBy: '',
            ClosingDT: '',
            ComplCat: '',
            ContractName: '',
            Details: '',
            Duration: 0,
            FileAttach: "",
            OpeningDT: new Date().toLocaleDateString().formatDate("dd-mm-yyyy", '-'),
            ProjectName: '',
            ReportedBy: this.state.uprofile.displayName,
            ReportedOn: new Date(),
            Subject: '',
            TicketStatus: 'Open',
            tsOpeningDT: new Date(),
            userID: this.state.uprofile.UID,
            TicketNum: ''
        }

        let replies = [];
        
        let flags = {...this.state.flags};
        flags.isAdd = true;
        flags.isEdit = false;
        flags.isReply = false;

        let buttonsOptions = {...this.state.buttonsOptions};
        buttonsOptions.addButton.showAdd = false;
        buttonsOptions.replyButton.showReply = false;
        buttonsOptions.saveButton.showSave = true;
        buttonsOptions.cancelButton.showCancel = true;

        this.setState({ ticket, replies, flags, buttonsOptions });
    }

    handleReply = () => {
        let reply = {
            Details: '',
            FileAttachment: {
                client: "",
                TitleText: "",
                FileName: "",
                FileSize: "",
                UploadDate: new Date().toString(),
                DownloadURL: ""
            },
            RepliedBy: this.state.uprofile.displayName,
            tsReplyDT: new Date()
        }        

        let flags = {...this.state.flags};
        flags.isAdd = false;
        flags.isEdit = false;
        flags.isReply = true;

        let buttonsOptions = {...this.state.buttonsOptions};
        buttonsOptions.addButton.showAdd = false;
        buttonsOptions.replyButton.showReply = false;
        buttonsOptions.saveButton.showSave = true;
        buttonsOptions.cancelButton.showCancel = true;

        this.setState({ reply, flags, buttonsOptions });
    }

    handleSubmit = () => {
        this.setState({ showButtons: false });

        let flags = {...this.state.flags};
        let ticket = {...this.state.ticket};

        // if isAdd === true
        if(flags.isAdd)
        {
            addTicketSupport(ticket, this.state.uprofile)
                .then(result => {
                    ticket.TicketNum = result.Result; 
                
                    let tickets = [...this.state.tickets];
                    tickets.push(ticket);
                    tickets = _.orderBy(tickets, ['TicketNum']);
    
                    flags.isAdd = false;
                    flags.isReply = false;
                    flags.isEdit = false;
    
                    let buttonsOptions = {...this.state.buttonsOptions};
                    buttonsOptions.addButton.showAdd = true;
                    buttonsOptions.replyButton.showReply = true;
                    buttonsOptions.saveButton.showSave = false;
                    buttonsOptions.cancelButton.showCancel = false;
    
                    this.setState({ ticket, tickets, flags, 
                                    buttonsOptions, showButtons: true,
                                    replies: [] });
                })
                .catch(error => {
                    console.log(error);

                    ticket = {
                        AttendedBy: '',
                        ClientName: '',
                        ClosedBy: '',
                        ClosingDT: '',
                        ComplCat: '',
                        ContractName: '',
                        Details: '',
                        Duration: 0,
                        FileAttach: "",
                        OpeningDT: "",
                        ProjectName: '',
                        ReportedBy: '',
                        ReportedOn: '',
                        Subject: '',
                        TicketStatus: '',
                        tsOpeningDT: '',
                        userID: ''
                    }

                    flags.isAdd = false;
                    flags.isReply = false;
                    flags.isEdit = false;
    
                    let buttonsOptions = {...this.state.buttonsOptions};
                    buttonsOptions.addButton.showAdd = true;
                    buttonsOptions.replyButton.showReply = true;
                    buttonsOptions.saveButton.showSave = false;
                    buttonsOptions.cancelButton.showCancel = false;
    
                    this.setState({ ticket, flags, buttonsOptions, 
                                    showButtons: true, replies: [] });

                });
        }
        else if(flags.isReply)        
        {
            // add the reply to the replies list... 
            let replies = [...this.state.replies];
            let replyId = (new Date()).getDate().pad(2, '0') + '.' 
                        + ((new Date()).getMonth()+1).pad(2, '0') + '.'
                        + (new Date()).getFullYear().toString() + ' '
                        + (new Date()).getHours().toString() + ':'
                        + (new Date()).getMinutes().toString() + ':'
                        + (new Date()).getSeconds().toString();     
                        
            let reply = {...this.state.reply, replyId };
            
            // upload the file and get the DownloadURL
            let attachment = {...reply.FileAttachment}
            uploadReplyAttachment(attachment, this.state.file, this.state.ticket)
                .then(result => {
                    console.log('** Upload result: ', result);
                    attachment = {...result}; 
                        
                    reply.FileAttachment = {...attachment};

                    console.log('File attachment result: ', reply.FileAttachment);

                    postTicketReplySupport(this.state.ticket, reply, this.state.ticket.TicketStatus, this.state.uprofile)
                    .then(result => {
                        replies.push(reply)

                        console.log('Trying to log reply');

                        replies = replies.sort(function compare(a, b) {
                            let arrA = a.replyId.split(' ');
                            let arrB = b.replyId.split(' ');
        
                            let arrAD = arrA[0].split('.');
                            let arrAT = arrA[1].split(':');
        
                            let arrBD = arrB[0].split('.');
                            let arrBT = arrB[1].split(':');
        
                            var dateA = new Date(parseInt(arrAD[2]), parseInt(arrAD[1]), parseInt(arrAD[0]), 
                                                parseInt(arrAT[2]), parseInt(arrAT[1]), parseInt(arrAT[0]));
                            var dateB = new Date(parseInt(arrBD[2]), parseInt(arrBD[1]), parseInt(arrBD[0]), 
                                                parseInt(arrBT[2]), parseInt(arrBT[1]), parseInt(arrBT[0]));
                                
                            return dateA - dateB;    
                        });
        
                        // set the flags and buttons options... 
                        flags.isAdd = false;
                        flags.isReply = false;
                        flags.isEdit = false;

                        let ticketIndex = this.state.tickets.findIndex( t => t.TicketNum == ticket.TicketNum);
                        let tickets = [...this.state.tickets];
                        tickets[ticketIndex].TicketStatus = ticket.TicketStatus;
        
                        let buttonsOptions = {...this.state.buttonsOptions};
                        buttonsOptions.addButton.showAdd = true;
                        buttonsOptions.replyButton.showReply = true;
                        buttonsOptions.saveButton.showSave = false;
                        buttonsOptions.cancelButton.showCancel = false;
        
                        this.setState({ ticket, flags, buttonsOptions, 
                                        showButtons: true, replies, reply, tickets });

                        console.log('Reply log successful');

                    })
                    .catch(error => {
                        console.log(error);

                        let reply = {
                            Details: '',
                            RepliedBy: '',
                            tsReplyDT: '',
                            FileAttachment: 'X'
                        }
                        
                        // set the flags and buttons options... 
                        flags.isAdd = false;
                        flags.isReply = false;
                        flags.isEdit = false;
        
                        let buttonsOptions = {...this.state.buttonsOptions};
                        buttonsOptions.addButton.showAdd = true;
                        buttonsOptions.replyButton.showReply = true;
                        buttonsOptions.saveButton.showSave = false;
                        buttonsOptions.cancelButton.showCancel = false;
        
                        this.setState({ ticket, flags, buttonsOptions, 
                                        showButtons: true, replies: [], reply });

                    });
                    
                })
                .catch(error => {
                    console.log(error);

                    attachment = {
                        TitleText: "",
                        FileName: "",
                        FileSize: "",
                        UploadDate: new Date().toString(),
                        DownloadURL: ""
                    }

                    reply.FileAttachment = 'X';
    
                    let reply = {
                        Details: '',
                        RepliedBy: '',
                        tsReplyDT: '',
                        FileAttachment: 'X'
                    }
                    
                    // set the flags and buttons options... 
                    flags.isAdd = false;
                    flags.isReply = false;
                    flags.isEdit = false;
    
                    let buttonsOptions = {...this.state.buttonsOptions};
                    buttonsOptions.addButton.showAdd = true;
                    buttonsOptions.replyButton.showReply = true;
                    buttonsOptions.saveButton.showSave = false;
                    buttonsOptions.cancelButton.showCancel = false;
    
                    this.setState({ ticket, flags, buttonsOptions, 
                                    showButtons: true, replies: [], reply });

                });

            

        }
        else                // isEdit === true
        {

        }
        
        this.setState({ showButtons: false });

    }

    handleCancel = () => {
        let flags = {...this.state.flags};
        let buttonsOptions = {...this.state.buttonsOptions};

        if(flags.isAdd) 
        {
            let ticket = {
                TicketNum: ''
            }

            flags.isAdd = false;
            flags.isEdit = false;
            flags.isReply = false;

            buttonsOptions.addButton.showAdd = true;
            buttonsOptions.replyButton.showReply = false;
            buttonsOptions.saveButton.showSave = false;
            buttonsOptions.cancelButton.showCancel = false;

            this.setState({ ticket, flags, buttonsOptions });

        }
        else if(flags.isReply)
        {
            this.showProcess();

            let index = this.state.selectedTicketIndex;
            let replies = [];
            let reply = {
                Details: '',
                FileAttachment: 'X',
                RepliedBy: '',
                tsReplyDT: new Date()
            };

            let ticket = {
                AttendedBy: '',
                ClientName: '',
                ClosedBy: '',
                ClosingDT: '',
                ComplCat: '',
                ContractName: '',
                Details: '',
                Duration: 0,
                FileAttach: "",
                OpeningDT: "",
                ProjectName: '',
                ReportedBy: '',
                ReportedOn: '',
                Subject: '',
                TicketStatus: '',
                tsOpeningDT: '',
                userID: '',
                TicketNum: '',
                Replies: []
            }
        
            this.setState({ ticket, reply });

            let tickets = [...this.state.tickets];
            let projectsList = [];
            let contractsList = [];

            ticket = {...tickets[index]};
            flags.isAdd = false;
            flags.isEdit = false;
            flags.isReply = false;

            buttonsOptions.addButton.showAdd = true;
            buttonsOptions.replyButton.showReply = true;
            buttonsOptions.saveButton.showSave = false;
            buttonsOptions.cancelButton.showCancel = false;

            this.setState({ flags, buttonsOptions });

            getTicketReplies(ticket.TicketNum)
                .then(result => {
                    replies = [...result.Result];

                    return getProjectsOfClient(ticket.ClientName);
                })
                .then(result => {

                    result.Result.map(r => {
                        projectsList.push({Name: r.name});
                    })
                    
                    return getContractsForProject(ticket.ProjectName)
                })
                .then(result => {

                    result.Result.map(r => {
                        contractsList.push({Name: r.name});
                    });
                    

                    this.setState({ projectsList, contractsList, 
                                    ticket, replies,
                                    selectedTicketIndex: index });
                    this.hideProcess();
                })
                .catch(error => {
                    console.log(error);
                    this.setState({ projectsList, contractsList });
                    this.hideProcess();
                });    
        }
        else
        {

        }
    }

    handleOnReplyChange = (name, value) => {
        // let { name, value } = event.currentTarget;
        // console.log('Change: ', name, value);
        // console.log("Change: ", )

        if(name === 'TicketStatus')
        {
            let ticket = {...this.state.ticket};
            let oldStatus = ticket.TicketStatus;
            ticket.TicketStatus = value;
            let reply = {...this.state.reply};
            reply['Details'] = 'Ticket Status changed from ' + oldStatus + ' to ' + value; 

            this.setState({ reply, ticket });
        }
        else
        {
            let reply = {...this.state.reply};
            reply[name] = value;

            this.setState({ reply });
        }

    }

    handleTicketRowClick = (index) => {
        this.showProcess();

        let replies = [];
        let reply = {
            Details: '',
            FileAttachment: 'X',
            RepliedBy: '',
            tsReplyDT: new Date()
        };

        let ticket = {
            AttendedBy: '',
            ClientName: '',
            ClosedBy: '',
            ClosingDT: '',
            ComplCat: '',
            ContractName: '',
            Details: '',
            Duration: 0,
            FileAttach: "",
            OpeningDT: "",
            ProjectName: '',
            ReportedBy: '',
            ReportedOn: '',
            Subject: '',
            TicketStatus: '',
            tsOpeningDT: '',
            userID: '',
            TicketNum: '',
            Replies: []
        }
        
        this.setState({ ticket, reply });

        let tickets = [...this.state.tickets];
        let projectsList = [];
        let contractsList = [];

        ticket = {...tickets[index]};

        getTicketReplies(ticket.TicketNum)
            .then(result => {
                replies = [...result.Result];
                
                // myArray.sort(function compare(a, b) {
                //     var dateA = new Date(a.date);
                //     var dateB = new Date(b.date);
                //     return dateA - dateB;
                //   });

                replies = replies.sort(function compare(a, b) {
                    let arrA = a.replyId.split(' ');
                    let arrB = b.replyId.split(' ');

                    let arrAD = arrA[0].split('.');
                    let arrAT = arrA[1].split(':');

                    let arrBD = arrB[0].split('.');
                    let arrBT = arrB[1].split(':');

                    var dateA = new Date(parseInt(arrAD[2]), parseInt(arrAD[1]), parseInt(arrAD[0]), 
                                         parseInt(arrAT[2]), parseInt(arrAT[1]), parseInt(arrAT[0]));
                    var dateB = new Date(parseInt(arrBD[2]), parseInt(arrBD[1]), parseInt(arrBD[0]), 
                                         parseInt(arrBT[2]), parseInt(arrBT[1]), parseInt(arrBT[0]));
                        
                    return dateA - dateB;
                  });

                return getProjectsOfClient(ticket.ClientName);
            })
            .then(result => {

                result.Result.map(r => {
                    projectsList.push({Name: r.name});
                })
                
                return getContractsForProject(ticket.ProjectName)
            })
            .then(result => {

                result.Result.map(r => {
                    contractsList.push({Name: r.name});
                });

                let buttonsOptions = {...this.state.buttonsOptions};
                buttonsOptions.replyButton.showReply = true;
                

                this.setState({ projectsList, contractsList, 
                                ticket, replies, buttonsOptions,
                                selectedTicketIndex: index });
                this.hideProcess();
            })
            .catch(error => {
                console.log(error);
                this.setState({ projectsList, contractsList });
                this.hideProcess();
            });
        
    } 

    componentDidMount = () => {
        this.showProcess();

        let tickets = [];

        getTicketsList()
            .then(result => {
                tickets = [...result.Result];

                this.setState({ tickets });
                
                return getClientsNames();

            })
            .then(result => {
                let clientsList = [];

                result.Result.map(r => {
                    clientsList.push({Name: r});
                });

                this.setState({ clientsList });
              
                return getComplCat();
            })
            .then(result => {
                let compleCatList = [];

                result.Result.map(r => {
                    compleCatList.push({Name: r});
                });

                this.setState({ compleCatList });
                this.hideProcess();                
            })
            .catch(error => {
                console.log(error);
                this.hideProcess();
            })

        getClientsNames()
            .then(result => {
                let clientsList = [];

                result.Result.map(c => {
                    clientsList.push({Name: c});
                });
                this.setState({ clientsList });

            })
            .catch(error => {
                console.log(error);
                this.hideProcess();
            })
    }

    handleClientChange = (event) => {
        this.showProcess();

        let { value } = event.currentTarget;

        getProjectsOfClient(value)
            .then(result => {
                let projectsList = [];

                result.Result.map(r => {
                    projectsList.push({Name: r.name});
                });

                let ticket = {...this.state.ticket};
                ticket.ClientName = value;

                this.setState({ projectsList, ticket });
                this.hideProcess();
            })
            .catch(error => {
                console.log(error);
                this.hideProcess();
            });
    }

    handleProjectChange = (event) => {
        this.showProcess();

        let { value } = event.currentTarget;

        getContractsForProject(value)
            .then(result => {
                let contractsList = [];

                result.Result.map(r => {
                    contractsList.push({Name: r.name});
                });

                let ticket = {...this.state.ticket};
                ticket.ProjectName = value;

                this.setState({ contractsList, ticket });
                this.hideProcess();
            })
            .catch(error => {
                console.log(error);
                this.hideProcess();
            });
    }

    handleOnChange = (event) => {
        const { name, value } = event.currentTarget;

        let ticket = {...this.state.ticket};
        ticket[name] = value;

        this.setState({ ticket });
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
    }

    render() {
        return (
            <React.Fragment>
                <TitlePageHeader title="Customer Care Tickets" bgColor="white" color="gray" />
                <div className="row" style={{paddingLeft: "25px", paddingRight: "25px"}}>
                    <div className="col-md-7" style={columnStyle}>
                        <TicketsList 
                            tickets={this.state.tickets} 
                            onTicketClick={this.handleTicketRowClick} />
                    </div>
                    <div className="col-md-5" style={columnStyle}>
                        <div className={"row" + ((this.state.showButtons) ? "" : " hidden")} 
                             style={{paddingLeft: "15px", paddingRight: "15px", marginBottom: "15px"}}>
                            <ToolsBar buttonsOptions={this.state.buttonsOptions} />
                        </div>
                        <div className={"row" + ((!this.state.showButtons) ? "" : " hidden")} 
                             style={{paddingLeft: "15px", paddingRight: "15px", marginBottom: "15px"}}>
                            <img src={processing} 
                                width="40vw" 
                                alt="processing" 
                                style={{marginTop: "2vh"}} />
                        </div>
                        <div className="row" style={{padding: "0", overflow: "auto", height: "58vh"}}>
                            <div className="col-md-12">
                                {(this.state.flags.isAdd) ? 
                                    <TicketForm 
                                        ticket={this.state.ticket}
                                        clientsList={this.state.clientsList}
                                        onClientChange={this.handleClientChange}
                                        projectsList={this.state.projectsList}
                                        onProjectChange={this.handleProjectChange}
                                        contractsList={this.state.contractsList} 
                                        compleCatList={this.state.compleCatList}
                                        flags={this.state.flags} 
                                        openedBy={this.state.uprofile.displayName}
                                        onChange={this.handleOnChange} />
                                    : ((this.state.ticket.TicketNum) ? 
                                        <TicketDetails ticket={this.state.ticket} 
                                            replies={this.state.replies} 
                                            reply={this.state.reply} 
                                            flags={this.state.flags}
                                            onChange={this.handleOnReplyChange}
                                            onFileSelect={this.handleOnFileSelect} />
                                        : "")
                                }
                            </div>
                        </div>
                        
                    </div>
                </div>
            </React.Fragment>
        );
    }

    showProcess = () => {
        this.setState({ showButtons: false });
    }

    hideProcess = () => {
        this.setState({ showButtons: true });
    }
}

export default Tickets;

const columnStyle = {
    border: "solid",
    borderWidth: "1px",
    borderColor: "lightgray",
    borderRadius: "25px",
    height: "68vh",
    overflow: 'auto'
}

Number.prototype.pad = function (size, c) {
    var s = String(this);
    while (s.length < (size || 2)) { s = c + s; }
    return s;
}

String.prototype.formatDate = function (format, separator) {
    let sDt = this;
    let aDt = (sDt.split('-').length > 1) ? sDt.split('-') : sDt.split('/');
    let fOpt = (sDt.split('-').length > 1) ? 1 : 2;
    let f = format.split(separator);

    let nDD=(fOpt === 1) ? (aDt[2].split(' '))[0] : aDt[1], 
        nMM=(fOpt === 1) ? aDt[1] : aDt[0], 
        nYYYY=(fOpt === 1) ? aDt[0] : (aDt[2].split(' '))[0],
        nDt = "";

    switch(f[0])
    {
        case 'dd':
            nDt = nDD + separator;
            break;

        case 'MM':
            nDt = nMM + separator;
            break;

        case 'mm':
            nDt = nMM + separator;
            break;

        case 'yyyy':
            nDt = nYYYY + separator;
            break;

    }

    switch(f[1])
    {
        case 'dd':
            nDt += nDD + separator;
            break;

        case 'MM':
            nDt += nMM + separator;
            break;

        case 'mm':
            nDt += nMM + separator;
            break;

        case 'yyyy':
            nDt += nYYYY + separator;
            break;

    }

    switch(f[2])
    {
        case 'dd':
            nDt += nDD;
            break;

        case 'MM':
            nDt += nMM;
            break;

        case 'mm':
            nDt += nMM;
            break;

        case 'yyyy':
            nDt += nYYYY;
            break;

    }
      
    return nDt;
}
