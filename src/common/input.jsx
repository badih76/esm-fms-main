import React from 'react';
import '../css/inputcomponents.css';

export const ilInput = ({ name, type, label, value, onChange, flgDisabled, error }) => {
    return (
        <div className="form-group row fieldContainer">
            <label htmlFor={name} className="col-sm-2 col-form-label inputLabel">
                {label}
            </label>
            <div className="col-sm-10">
                <input
                    value={value}
                    onChange={onChange}
                    id={name}
                    name={name}
                    type={type}
                    className="form-control"
                    disabled={flgDisabled}
                />
                {error && <div className="alert alert-danger">{error}</div>}
            </div>
        </div>
    );
};

const Input = ({ name, type, label, value, onChange, flgDisabled, error }) => {
    return (
        <div className="form-group row fieldContainer">
            <label htmlFor={name} className="col-form-label inputLabel">
                {label}
            </label>
            <input
                value={value}
                onChange={onChange}
                id={name}
                name={name}
                type={type}
                checked={type == 'checkbox' ? value : ''}
                className="form-control"
                disabled={flgDisabled}
            />
            {error && <div className="alert alert-danger">{error}</div>}
        </div>
    );
};

export const ilTextArea = ({ name, label, value, onChange, rows, flgDisabled, error }) => {
    return (
        <div className="form-group row fieldContainer">
            <label htmlFor={name} className="col-sm-2 col-form-label textareaLabel">
                {label}
            </label>
            <div className="col-sm-10">
                <textarea
                    value={value}
                    onChange={onChange}
                    id={name}
                    name={name}
                    rows={rows}
                    className="form-control"
                    disabled={flgDisabled}
                ></textarea>
                {error && <div className="alert alert-danger">{error}</div>}
            </div>
        </div>
    );
};

export const TextArea = ({ name, label, value, onChange, rows, flgDisabled, error }) => {
    return (
        <div className="form-group row fieldContainer">
            <label htmlFor={name} className="col-form-label textareaLabel">
                {label}
            </label>
            <textarea
                value={value}
                onChange={onChange}
                id={name}
                name={name}
                rows={rows}
                className="form-control"
                disabled={flgDisabled}
            ></textarea>
            {error && <div className="alert alert-danger">{error}</div>}
        </div>
    );
};

export const TextAreaEnh = ({ name, label, value, onChange, onInput, flgDisabled, error }) => {
    return (
        <div className="form-group row fieldContainer">
            <label htmlFor={name} className="col-form-label textareaLabel">
                {label}
            </label>
            <div style={{height: "100px", overflow: "scroll"}}
                onInput={(e) => { 
                    let name = e.currentTarget.name;
                    let value = e.currentTarget.innerText;

                    onInput(value); 
                }} //{onChange}
                onBlur={(e) => { 
                    let value = e.currentTarget.innerHTML;
                    let name = e.currentTarget.name;

                    onChange(name, value);
                }}
                id={name}
                name={name}
                className="form-control"
                contenteditable="true" //{flgDisabled}
                dangerouslySetInnerHTML={{__html: value }}
            />
            {error && <div className="alert alert-danger">{error}</div>}
        </div>
    );
};

export const DropDownList = ({ name, label, values, onChange, flgDisabled, error, defValue }) => {
    
    let options;
    
    if(!values) 
    {
        options = ``;
    }
    else
    {
        options = (
            values.map(v => { 
                return <option 
                        key={v.Name} 
                        value={v.Name} 
                        selected={v.Name === defValue ? "selected" : ""}>
                            {v.Name}
                        </option>})
        );
    }

    return (
        <div className="form-group row fieldContainer">
            <label htmlFor={name} className="col-form-label selectLabel">
                {label}
            </label>
            <select name={name} id={name} disabled={flgDisabled}
                className="form-control" onChange={onChange}>
                <option value=""></option>
                {options}
            </select>
            {error && <div className="alert alert-danger">{error}</div>}
        </div>
    );
};

export const ilDropDownList = ({ name, label, values, onChange, flgDisabled, error, defValue }) => {
    return (
        <div className="form-group row fieldContainer">
            <label htmlFor={name} className="col-sm-2 col-form-label selectLabel">
                {label}
            </label>
            <div className="col-sm-10">
                <select name={name} id={name} disabled={flgDisabled}
                    className="form-control" onChange={onChange}>
                    {
                        values.map(v => { return <option key={v} selected={v === defValue ? "selected" : ""}>{v}</option>})
                    }
                </select>
                {error && <div className="alert alert-danger">{error}</div>}
            </div>
        </div>
    );
};


export default Input;