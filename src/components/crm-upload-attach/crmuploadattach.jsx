import React, { Component } from 'react';
import ToolsBar from '../../common/toolsbar';
import { TitlePageHeader } from '../titleheader/titleheader';
import _ from 'lodash';

import { getAttachmentsList, getClientAttachmentsList, uploadAttachment, deleteAttachment } from '../../appcode/crmuploadattachments';

import processing from '../../images/processing.gif';
import AttachList from './attachlist';
import AttachForm from './attachform';
import ClientAttachForm from './clientAttachForm';

class CRMUploadAttach extends Component {
    state = {
        uprofile: {},
        attachment: {
            client: "",
            TitleText: "",
            FileName: "",
            FileSize: "",
            UploadDate: new Date().toString(),
            DownloadURL: ""
        },
        attachments: [],
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
            deleteButton: {
                showDelete: false,
                onDelete: () => this.handleDelete()
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

    handleDelete = () => {
        let attachment = {...this.state.attachment};

        deleteAttachment(attachment)
            .then(result => {
                // remove the attachment from the attachments list...
                let attachments = [...this.state.attachments];

                attachments.splice(attachments.findIndex(e => {
                    return attachment.FileName === e.FileName;
                }), 1);

                // clear attachment fields... 
                attachment = {
                    TitleText: "",
                    FileName: "",
                    FileSize: "",
                    UploadDate: new Date().toString(),
                    DownloadURL: "",
                }

                this.setState({ attachment, attachments });
            })
            .catch(err => {
                console.log("Error: ", err.message);
                alert("Error occured while deleting the attachment.\nPlease, inform the system administrator!");
            })
    }

    handleAdd = () => {

        let flags = {...this.state.flags};
        flags.isAdd = true;
        flags.isEdit = false;
        flags.isReply = false;
        
        let attachment = {
            FileName: "",
            FileSize: "",
            DownloadURL: "",
            UploadDate: "",
            TitleText: ""
        }

        let buttonsOptions = {...this.state.buttonsOptions};
        buttonsOptions.addButton.showAdd = false;
        buttonsOptions.saveButton.showSave = true;
        buttonsOptions.cancelButton.showCancel = true;
        buttonsOptions.deleteButton.showDelete = false;

        this.setState({ attachment, flags, buttonsOptions });
    }

    validateFields = () => {
        let errors = {};
  
        if(this.state.attachment.client == "" || this.state.attachment.client == undefined)
        {
            alert("Client name can't be empty!");
            return false;
        }
        
        if(this.state.attachment.TitleText === "" || this.state.attachment.TitleText === undefined)
        {
            alert("Title Text can't be empty!");
            return false;
        }
        
        if(this.state.attachment.FileName == "" || this.state.attachment.FileName == undefined)
        {
            alert("Please, select a file to upload!");
            return false;
        }

        return true;
        // if(!result.error) return null;
  
        // for(let item of result.error.details)
        //     errors[item.path[0]] = item.message;
  
        // if(Object.keys(errors).length === 0) return null;
        // return errors;
    };

    handleSubmit = () => {
        if(!this.validateFields()) return;

        this.setState({ showButtons: false });

        let flags = {...this.state.flags};
        let attachment = {...this.state.attachment};
        
        // if isAdd === true
        if(flags.isAdd)
        {
            uploadAttachment(attachment, this.state.file)
                .then(result => {
                    attachment = {...result.Result}; 
                    
                    let attachments = [...this.state.attachments];
                    attachments.push(attachment);   

                    flags.isAdd = false;
                    flags.isReply = false;
                    flags.isEdit = false;
    
                    let buttonsOptions = {...this.state.buttonsOptions};
                    buttonsOptions.addButton.showAdd = true;
                    buttonsOptions.saveButton.showSave = false;
                    buttonsOptions.cancelButton.showCancel = false;
    
                    this.setState({ attachment, attachments, flags, 
                                    buttonsOptions, showButtons: true });
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

                    flags.isAdd = false;
                    flags.isReply = false;
                    flags.isEdit = false;
    
                    let buttonsOptions = {...this.state.buttonsOptions};
                    buttonsOptions.addButton.showAdd = true;
                    buttonsOptions.saveButton.showSave = false;
                    buttonsOptions.cancelButton.showCancel = false;
    
                    this.setState({ attachment, flags, buttonsOptions, 
                                    showButtons: true });

                });
        }        

    }

    handleCancel = () => {
        let flags = {...this.state.flags};
        flags.isAdd = false;
        flags.isEdit = true;
        flags.isReply = false;
        
        let attachment = {
            FileName: "",
            FileSize: "",
            DownloadURL: "",
            UploadDate: "",
            TitleText: ""
        }

        let buttonsOptions = {...this.state.buttonsOptions};
        buttonsOptions.addButton.showAdd = true;
        buttonsOptions.saveButton.showSave = false;
        buttonsOptions.cancelButton.showCancel = false;
        buttonsOptions.deleteButton.showDelete = false;

        this.setState({ attachment, flags, buttonsOptions });
    }

    handleOnFileSelect = (event) => {
        let { value } = event.currentTarget;
        
        let attachment = {...this.state.attachment};
        let file = event.currentTarget.files[0];

        attachment.FileName = value.name;
        attachment.FileName = file.name;
        attachment.FileSize = file.size;

        this.setState({ attachment, file });
    }

    handleOnClientSelect = (event) => {
        let { value } = event.currentTarget;

        let attachment = {...this.state.attachment}
        attachment.client = value;

        attachment = {
            client: value,
            TitleText: "",
            FileName: "",
            FileSize: "",
            UploadDate: new Date().toString(),
            DownloadURL: ""
        }

        let attachments = [];

        if(value == "") {
            getAttachmentsList()
            .then(result => {
                attachments = result.Result;
                
                this.setState({ attachments });
                this.hideProcess();
            })
            .catch(error => {
                console.log(error);
                this.hideProcess();
            })
        } else {
            getClientAttachmentsList(value)
            .then(result => {
                attachments = result.Result;
                
                this.setState({ attachments });
                this.hideProcess();
            })
            .catch(error => {
                console.log(error);
                this.hideProcess();
            })
        }    

        this.setState({ attachment, attachments });
    }

    handleOnTitleChange = (event) => {
        let { value } = event.currentTarget;

        let attachment = {...this.state.attachment}
        attachment.TitleText = value;

        this.setState({ attachment });
    }

    handleAttachmentRowClick = (index) => {
        // this.showProcess();

        let attachment = {
            TitleText: "",
            FileName: "",
            FileSize: "",
            UploadDate: new Date().toString(),
            DownloadURL: ""
        }
    
        let attachments = [...this.state.attachments];
        let buttonsOptions = {...this.state.buttonsOptions};

        attachment = {...attachments[index]};
        buttonsOptions.deleteButton.showDelete = true;

        this.setState({ attachment });
    } 

    componentDidMount = () => {
        this.showProcess();

        let attachments = [];

        getAttachmentsList()
            .then(result => {
                attachments = result.Result;
                
                this.setState({ attachments });
                this.hideProcess();
            })
            .catch(error => {
                console.log(error);
                this.hideProcess();
            })
            
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
                <TitlePageHeader title="Client Protal - Upload Attachments" bgColor="white" color="gray" />
                <div className="row" style={{paddingLeft: "25px", paddingRight: "25px"}}>
                    <div className="col-md-5" style={columnStyle}>
                        <AttachList 
                            attachments={this.state.attachments} 
                            onAttachClick={this.handleAttachmentRowClick} />
                    </div>
                    <div className="col-md-4" style={columnStyle}>
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
                                { 
                                    <ClientAttachForm
                                        attachment={this.state.attachment}
                                        flags={this.state.flags} 
                                        onFileSelect={this.handleOnFileSelect}
                                        onTitleChange={this.handleOnTitleChange}
                                        onClientSelect={this.handleOnClientSelect}
                                        onChange={null}
                                        attachments={this.state.attachments} />
                                 
                                }
                            </div>
                        </div>
                        
                    </div>
                    <div className="col-md-3" style={columnStyle}>
                        {(this.state.attachment.TitleText != "" && this.state.attachment.TitleText !== undefined) ? 
                            <div>
                                <div>{this.state.attachment.TitleText}</div>
                                <div><a href={this.state.attachment.DownloadURL} target="_blank" >Open</a></div>

                            </div> : null}
                    </div>
                </div>
            </React.Fragment>
        );
    }

    // ((this.state.ticket.TicketNum) ? 
    //                                     <TicketDetails ticket={this.state.ticket} 
    //                                         replies={this.state.replies} 
    //                                         reply={this.state.reply} 
    //                                         flags={this.state.flags}
    //                                         onChange={this.handleOnReplyChange} />
    //                                     : "")

    showProcess = () => {
        this.setState({ showButtons: false });
    }

    hideProcess = () => {
        this.setState({ showButtons: true });
    }
}

export default CRMUploadAttach;

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
