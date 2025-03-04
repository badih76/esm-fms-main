import React, { Component } from 'react';
import Input, { DropDownList } from '../../common/input';

import { getProjectsList, getClientsList } from '../../appcode/contractdefinition';

class ClientAttachForm extends Component {
    state = {
        errors: {},
        clients: []
    }

    componentDidMount = () => {
        this.setState({ formProcess: true });

        getClientsList()
         .then(result => {
               let clients = [];
               clients.push({Name: 'All'});

               result.Result.map(r => {
                  clients.push({Name: r});
               });

               this.setState({ clients });
               this.setState({ formProcess: false });
         });
    }

    checkTitleText = (tt) => {
        if(tt === "" || tt === undefined) {
            return (<div className="row col-md-2" style={{
                        textAlign: "center",
                        verticalAlign: "middle",
                        lineHeight: "90px",
                        fontWeight: "bold",
                        fontSize: "1.25em",
                        color: "red"
                    }}>
                        {'\u2717'}
                    </div>)
        } else {
            let found = this.props.attachments.find(e => e.TitleText === tt);
            if(found) {
                return (<div className="row col-md-2" style={{
                    textAlign: "center",
                    verticalAlign: "middle",
                    lineHeight: "90px",
                    fontWeight: "bold",
                    fontSize: "1.25em",
                    color: "red"
                }}>
                    {'\u2717'}
                </div>)
            } else {
                return (<div className="row col-md-2" style={{
                    textAlign: "center",
                    verticalAlign: "middle",
                    lineHeight: "90px",
                    fontWeight: "bold",
                    fontSize: "1.25em",
                    color: "green"
                }}>
                    {'\u2713'}
                </div>)
            }
        }
    }

    checkFilename = (fn) => {
        if(fn === "" || fn === undefined) {
            return (<div className="row col-md-2" style={{
                        textAlign: "center",
                        verticalAlign: "middle",
                        lineHeight: "90px",
                        fontWeight: "bold",
                        fontSize: "1.25em",
                        color: "red"
                    }}>
                        {'\u2717'}
                    </div>)
        } else {
            let found = this.props.attachments.find(e => e.FileName === fn);
            if(found) {
                return (<div className="row col-md-2" style={{
                    textAlign: "center",
                    verticalAlign: "middle",
                    lineHeight: "90px",
                    fontWeight: "bold",
                    fontSize: "1.25em",
                    color: "red"
                }}>
                    {'\u2717'}
                </div>)
            } else {
                return (<div className="row col-md-2" style={{
                    textAlign: "center",
                    verticalAlign: "middle",
                    lineHeight: "90px",
                    fontWeight: "bold",
                    fontSize: "1.25em",
                    color: "green"
                }}>
                    {'\u2713'}
                </div>)
            }
        }
    }

    render() {
        const { TitleText, FileName, FileSize, DownloadURL, UploadDate, client } = this.props.attachment;
        const { flags, onTitleChange } = this.props;
        const { clients, errors } = this.state;

      return (
        <React.Fragment>
            <div className="row">
                <div className="col-md-12" style={{padding: "0"}}>
                    <div className="row" style={{padding: "10px"}}>
                        <div className="col-md-12">
                            <DropDownList name='clientName' 
                                label='Clients'  
                                values={clients} 
                                onChange={this.props.onClientSelect} 
                                flgDisabled={false} 
                                defValue={client}
                                error={errors.ClientName ? errors.ClientName : ""} 
                            />
                        </div>
                    </div>
                    <div className="row" style={{padding: "10px"}}>
                        <div className="col-md-10">
                            <Input name="TitleText" 
                                label="Title Text" 
                                value={TitleText}
                                onChange={onTitleChange}
                                flgDisabled={!flags.isAdd && !flags.isEdit}
                            />

                        </div>
                        {this.checkTitleText(TitleText)}
                    </div>
                    <div className="row" style={{padding: "10px"}}>
                        <div className="col-md-10">
                            <Input name="FileSelect" 
                                type="file"
                                label="Select File" 
                                onChange={this.props.onFileSelect}
                                flgDisabled={!flags.isAdd && !flags.isEdit}
                            />
                        </div>
                        {this.checkFilename(FileName)}
                    </div>
                    <div className="row" style={{padding: "10px"}}>
                        <div className="col-md-12">
                            <Input
                                type="text"
                                name="UploadDate" 
                                label="Upload Date" 
                                value={UploadDate}
                                flgDisabled={true}
                            />
                        </div>
                    </div>
                    <div className="row" style={{padding: "10px"}}> 
                        <div className="col-md-12">
                            <Input name="FileName" 
                                label="File Name" 
                                value={FileName}
                                flgDisabled={true}
                            />
                        </div>
                    </div>
                    <div className="row" style={{padding: "10px"}}>
                        <div className="col-md-12">
                            <Input name="FileSize" 
                                label="File Size" 
                                value={FileSize}
                                flgDisabled={true}
                            />
                        </div>
                    </div>
                    <div className="row" style={{padding: "10px"}}>
                        <div className="col-md-12">
                            <Input name="DownloadURL" 
                                label="Download URL" 
                                value={DownloadURL}
                                flgDisabled={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
      );
   }
}


export default ClientAttachForm;
