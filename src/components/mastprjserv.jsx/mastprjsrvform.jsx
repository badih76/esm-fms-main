import React, {Component} from 'react';
import Input from '../../common/input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// import '../../css/mastcc-inqcat.css';
import processing from '../../images/processing.gif';


class MastPrjServForm extends Component {
    state = {
        fields: {
            Description: '',
            Manning: 0,
            Value: 0
        }
    };

    render() {
        const { onChange, onSubmit, onCancel, data, flags, errors, showProcess, showButtons } = this.props;

        return (
            <React.Fragment>
                <form style={{marginTop: "10px"}} >
                    <Input 
                        name="Description" 
                        label="Service Description:" 
                        type="text" 
                        onChange={onChange} 
                        value={data.Description}
                        flgDisabled={flags.isAdd ? "" : "disabled"}
                        error={errors.Description ? errors.Description : ""} 
                        />
                    
                    <Input 
                        name="Manning" 
                        label="Manning:" 
                        onChange={onChange} 
                        value={data.Manning} 
                        flgDisabled={flags.isAdd || flags.isEdit ? "" : "disabled"}
                        error={errors.Manning ? errors.Manning : ""}  
                        />

                    <Input 
                        name="Value" 
                        label="Value:" 
                        onChange={onChange} 
                        value={data.Value} 
                        flgDisabled={flags.isAdd || flags.isEdit ? "" : "disabled"}
                        error={errors.Value ? errors.Value : ""}  
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

export default MastPrjServForm;