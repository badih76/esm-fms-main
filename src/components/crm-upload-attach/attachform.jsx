import React, { Component } from 'react';
import Input from '../../common/input';

class AttachForm extends Component {
    state = {

    }


    render() {
        const { TitleText, FileName, FileSize, DownloadURL, UploadDate } = this.props.attachment;

        const { flags, onTitleChange } = this.props;

      return (
        <React.Fragment>
            <div className="row">
                <div className="col-md-12" style={{padding: "0"}}>
                    <div className="row" style={{padding: "10px"}}>
                        <div className="col-md-12">
                            <Input name="TitleText" 
                                label="Title Text" 
                                value={TitleText}
                                onChange={onTitleChange}
                                flgDisabled={!flags.isAdd && !flags.isEdit}
                            />
                        </div>
                    </div>
                    <div className="row" style={{padding: "10px"}}>
                        <div className="col-md-12">
                            <Input name="FileSelect" 
                                type="file"
                                label="Select File" 
                                onChange={this.props.onFileSelect}
                                flgDisabled={!flags.isAdd && !flags.isEdit}
                            />
                        </div>
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


export default AttachForm;
