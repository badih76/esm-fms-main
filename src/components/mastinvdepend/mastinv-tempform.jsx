import React, {Component} from 'react';
import Input, { TextArea, DropDownList } from '../../common/input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import '../../css/mastcc-inqcat.css';
import processing from '../../images/processing.gif';

class MastInvTempForm extends Component {
    state = {
        fields: {
            Name: '',
            Description: ''
        },
        
    };

    EquipForm = (props) => {
        const { onChange, data, flags, errors, categories } = props;

        return (
            <React.Fragment>
                <Input 
                    name="Name" 
                    label="Template Name:" 
                    type="text" 
                    onChange={onChange} 
                    value={data.Name}
                    flgDisabled={flags.isAdd ? "" : "disabled"}
                    error={errors.Name ? errors.Name : ""} 
                    />
                
                <TextArea 
                    name="Description" 
                    label="Template Description:" 
                    onChange={onChange} 
                    rows={2} 
                    value={data.Description} 
                    flgDisabled={flags.isAdd || flags.isEdit ? "" : "disabled"}
                    error={errors.Description ? errors.Description : ""}  
                    />

                <Input 
                    name="SerialNum" 
                    label="Serial Number:" 
                    type="text" 
                    onChange={onChange} 
                    value={data.SerialNum}
                    flgDisabled={flags.isAdd || flags.isEdit ? "" : "disabled"}
                    error={errors.SerialNum ? errors.SerialNum : ""} 
                    />
                
                <Input 
                    name="PurchDate" 
                    label="Purchace Date:" 
                    type="date" 
                    onChange={onChange} 
                    value={data.PurchDate}
                    flgDisabled={flags.isAdd || flags.isEdit ? "" : "disabled"}
                    error={errors.PurchDate ? errors.PurchDate : ""} 
                    />
                
                <Input 
                    name="PurchVal" 
                    label="Purchace Value:" 
                    type="text" 
                    onChange={onChange} 
                    value={data.PurchVal}
                    flgDisabled={flags.isAdd || flags.isEdit ? "" : "disabled"}
                    error={errors.PurchVal ? errors.PurchVal : ""} 
                    />
                
                <DropDownList 
                    name="Categ1" 
                    label="Category 2:" 
                    type="text" 
                    onChange={onChange} 
                    values={categories}
                    defValue={data.Categ1}
                    flgDisabled={flags.isAdd || flags.isEdit ? "" : "disabled"}
                    error={errors.Categ1 ? errors.Categ1 : ""} 
                    />
                
                <DropDownList 
                    name="Categ2" 
                    label="Category 2:" 
                    type="text" 
                    onChange={onChange} 
                    values={categories}
                    defValue={data.Categ2}
                    flgDisabled={flags.isAdd || flags.isEdit ? "" : "disabled"}
                    error={errors.Categ2 ? errors.Categ2 : ""} 
                    />
                
            </React.Fragment>
        );
    };

    SPartForm = (props) => {
        const { onChange, data, flags, errors, categories } = props;

        return (
            <React.Fragment>
                <Input 
                    name="Name" 
                    label="Template Name:" 
                    type="text" 
                    onChange={onChange} 
                    value={data.Name}
                    flgDisabled={flags.isAdd ? "" : "disabled"}
                    error={errors.Name ? errors.Name : ""} 
                    />
                
                <TextArea 
                    name="Description" 
                    label="Template Description:" 
                    onChange={onChange} 
                    rows={2} 
                    value={data.Description} 
                    flgDisabled={flags.isAdd || flags.isEdit ? "" : "disabled"}
                    error={errors.Description ? errors.Description : ""}  
                    />

                <Input 
                    name="UPCNum" 
                    label="UPC Number:" 
                    type="text" 
                    onChange={onChange} 
                    value={data.UPCNum}
                    flgDisabled={flags.isAdd || flags.isEdit ? "" : "disabled"}
                    error={errors.UPCNum ? errors.UPCNum : ""} 
                    />
                                
                <Input 
                    name="Quantity" 
                    label="Quantity:" 
                    type="text" 
                    onChange={onChange} 
                    value={data.Quantity}
                    flgDisabled={flags.isAdd || flags.isEdit ? "" : "disabled"}
                    error={errors.Quantity ? errors.Quantity : ""} 
                    />
                
                <DropDownList 
                    name="Categ1" 
                    label="Category 2:" 
                    type="text" 
                    onChange={onChange} 
                    values={categories}
                    defValue={data.Categ1}
                    flgDisabled={flags.isAdd || flags.isEdit ? "" : "disabled"}
                    error={errors.Categ1 ? errors.Categ1 : ""} 
                    />
                
                <DropDownList 
                    name="Categ2" 
                    label="Category 2:" 
                    type="text" 
                    onChange={onChange} 
                    values={categories}
                    defValue={data.Categ2}
                    flgDisabled={flags.isAdd || flags.isEdit ? "" : "disabled"}
                    error={errors.Categ2 ? errors.Categ2 : ""} 
                    />
                
            </React.Fragment>
        );
    }

    render() {
        const { onSubmit, onCancel, data, 
                flags, showProcess, showButtons, 
                selType } = this.props;

        return (
            <React.Fragment>
                <form style={{marginTop: "10px"}} >
                    {selType === 'Equipment' ? <this.EquipForm {...this.props} /> 
                        : selType === 'Spare Part' ? <this.SPartForm {...this.props} /> : ""}

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

export default MastInvTempForm;