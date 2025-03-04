import React, {Component} from 'react';
import Input, { TextArea } from '../../common/input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import '../../css/mastcc-inqcat.css';
import processing from '../../images/processing.gif';


class MastCCICForm extends Component {
    state = {
        fields: {
            categname: '',
            categdesc: ''
        }
        
    };

    render() {
        const { onChange, onSubmit, onCancel, data, flags, errors, showProcess, showButtons } = this.props;

        return (
            <React.Fragment>
                <form style={{marginTop: "10px"}} >
                    <Input 
                        name="categname" 
                        label="Category Name:" 
                        type="text" 
                        onChange={onChange} 
                        value={data.categname}
                        flgDisabled={flags.isAdd ? "" : "disabled"}
                        error={errors.categname ? errors.categname : ""} 
                        />
                    
                    <TextArea 
                        name="categdesc" 
                        label="Category Description:" 
                        onChange={onChange} 
                        rows={10} 
                        value={data.categdesc} 
                        flgDisabled={flags.isAdd || flags.isEdit ? "" : "disabled"}
                        error={errors.categdesc ? errors.categdesc : ""}  
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

export default MastCCICForm;