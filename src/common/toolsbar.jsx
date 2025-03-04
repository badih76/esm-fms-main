import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, ButtonGroup } from 'react-bootstrap';

const lookupDiv = {
    width: "100%", 
    paddingBottom: "5px", 
    marginBottom: "5px", 
    borderBottom: "solid thin"
};

const lookupDivPH = {
    width: "100%", 
    paddingBottom: "5px", 
    marginBottom: "5px",
    marginTop: "5px", 
    borderBottom: "solid thin"
};

const MakeButton = (button, show, onClick, style, icon) => {

    if(button)
    {
        return (
            <ButtonGroup className={(button[show] ? "" : "hidden")}>
                <Button bsStyle={style} onClick={() => {button[onClick]()}}>
                    <FontAwesomeIcon icon={icon} />
                </Button>
            </ButtonGroup>
        )
    }
}


const ToolsBar = (props) => {
    const { addButton, editButton, deleteButton, refreshButton, replyButton,
            searchButton, saveButton, cancelButton, btnPlaceHolder, searchPlaceHolder } = props.buttonsOptions;
    const { onSearchValueChange } = props;

    return (
        <React.Fragment>
            <div className="row" >
                <div className="col-md-12" style={{paddingTop: "1vh"}}>
                    <ButtonGroup justified>
                        
                        {MakeButton(addButton, "showAdd", "onAdd", "primary", "plus")}
                        {MakeButton(editButton, "showEdit", "onEdit", "primary", "edit")}
                        {MakeButton(deleteButton, "showDelete", "onDelete", "danger", "trash-alt")}
                        {MakeButton(refreshButton, "showRefresh", "onRefresh", "primary", "sync-alt")}                        
                        {MakeButton(saveButton, "showSave", "onSave", "success", "save")}
                        {MakeButton(cancelButton, "showCancel", "onCancel", "danger", "ban")}
                        {MakeButton(replyButton, "showReply", "onReply", "primary", "reply")}
                        
                        <ButtonGroup className={(btnPlaceHolder ? "" : "hidden")}>
                            <Button bsStyle="primary" disabled="disabled" style={{height: "5vh"}}>                                
                            </Button>
                        </ButtonGroup>
                        

                    </ButtonGroup>
                </div>
            </div>

            <div style={lookupDiv} className={(searchButton.showSearch ? "" : "hidden")}>
                <div className="lookupbar">
                    <div>
                        <input type="text" id="txtCatLookup" 
                            className="form-control input-sm" width="100%"
                            onChange={onSearchValueChange} />
                        
                    </div>
                    <div>
                        <button id="btnCatLookup" className="btn btn-primary form-control input-sm" 
                            width="50%" onClick={() => searchButton.onSearch()}>
                            <FontAwesomeIcon icon="search" />
                        </button>
                    </div>
                </div>

            </div>
            <ButtonGroup justified className={(searchPlaceHolder ? "" : "hidden")} style={lookupDivPH}>
                <ButtonGroup >
                    <Button bsStyle="primary" disabled="disabled" style={{height: "5vh"}}>                                
                    </Button>
                </ButtonGroup>
            </ButtonGroup>

        </React.Fragment>
    );
}; 

export default ToolsBar;