import React, {Component} from 'react';
import Input, { TextArea } from '../../common/input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import '../../css/mastcc-inqcat.css';
import processing from '../../images/processing.gif';


class MastInvICForm extends Component {
    state = {
        fields: {
            Name: '',
            Description: ''
        }
        
    };

    render() {
        const { onChange, onSubmit, onCancel, data, flags, errors, showProcess, showButtons } = this.props;

        return (
            <React.Fragment>
                <form style={{marginTop: "10px"}} >
                    <Input 
                        name="Name" 
                        label="Category Name:" 
                        type="text" 
                        onChange={onChange} 
                        value={data.Name}
                        flgDisabled={flags.isAdd ? "" : "disabled"}
                        error={errors.Name ? errors.Name : ""} 
                        />
                    
                    <TextArea 
                        name="Description" 
                        label="Category Description:" 
                        onChange={onChange} 
                        rows={10} 
                        value={data.Description} 
                        flgDisabled={flags.isAdd || flags.isEdit ? "" : "disabled"}
                        error={errors.Description ? errors.Description : ""}  
                        />

                    <img src={processing} 
                        width="60vw" 
                        alt="processing" 
                        className={showProcess ? "" : "hidden"} 
                        style={{marginTop: "2vh"}} />

                    <div className={"btn-toolbar btnToobar" + ((flags.isAdd || flags.isEdit) && showButtons ? "" : " hidden")} >
                        <div className="btn-group btn-group-justified">
                            <button type="button"
                                className="btn btn-primary" 
                                style={{width: "50%"}}
                                onClick={() => onSubmit()} >
                                <FontAwesomeIcon icon="save" />
                            </button>
                            <button type="button" 
                                className="btn btn-danger" 
                                style={{width: "50%"}}
                                onClick={() => onCancel()}>
                                <FontAwesomeIcon icon="ban" />
                            </button>
                            
                        </div>
                    </div>
                </form>
            </React.Fragment>
        )
    }
};

export default MastInvICForm;