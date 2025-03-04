import React, { useState } from 'react';
import '../css/slidingswitch.css';

export const SlidingSwitch = (props) => {
    let switchState = props.value ? "switch switchOnGrad" : "switch";
    let circleState = props.value ? "circle switchOn" : "circle";

    let [switchDiv, setSwitchDiv] = useState(switchState);

    let [circleDiv, setCircleDiv] = useState(circleState, () => {
        if(circleDiv === "circle") {
            switchDiv = "circle switchOn";
        }
        else {
            switchDiv = "circle";
        }

        console.log(circleDiv);
    });
      
    const toggleSwitch = (sD, name = null) => {
        if(sD === "switch") {
            sD = "switch switchOnGrad";
            
        }
        else {
            sD = "switch";
        }

        setCircleDiv(toggleCircle(circleDiv));
        props.setState(!props.value, name);
        return sD;
    }

    const toggleCircle = (cD) => {
        if(cD === "circle") {
            cD = "circle switchOn";
        }
        else {
            cD = "circle";
        }

        return cD;
    }

    const getSwitchState = () => {
        if(props.value) {
            return  "switch switchOnGrad";
            
        }
        else {
            return "switch";
        }
    }

    const getCircleState = () => {
        if(props.value) {
            return  "circle switchOn";
        }
        else {
            return "circle";
        }
    }

    return (
        <React.Fragment>
            <div className="slidingSwitchContainer">
                <div className="slidingSwitchLabel">
                    <label htmlFor={props.name} className="col-form-label inputLabel">
                        {props.label}
                    </label>
                </div>
                <div className="slidingSwitch">
                    <div className={getSwitchState()} 
                        onClick={() => {
                            if(props.flgDisabled) return;
                            setSwitchDiv(toggleSwitch(switchDiv, props.name))
                            }}
                        id="divSwitch">
                        <div className={getCircleState()} 
                            onClick={() => {
                                if(props.flgDisabled) return;
                                setSwitchDiv(toggleSwitch(switchDiv, props.name))
                                }}
                            id='circle'>
                        </div>  
                    </div>
                </div>
                <div className="slidingSwitch"></div>
            </div>
            <div className="slidingSwitchError">
                {props.error && <div className="alert alert-danger">{props.error}</div>}
            </div>
        </React.Fragment>
    );
}

export const ThinSwitch = (props) => {
    let switchState = props.value ? "switch2 switch2OnGrad" : "switch2";
    let circleState = props.value ? "circle2 switch2On" : "circle2";

    let [switchDiv, setSwitchDiv] = useState(switchState);

    let [circleDiv, setCircleDiv] = useState(circleState, () => {
        if(circleDiv === "circle2") {
            switchDiv = "circle2 switch2On";
        }
        else {
            switchDiv = "circle2";
        }

        console.log(circleDiv);
    });
      
    const toggleSwitch = (sD, name = null) => {
        if(sD === "switch2") {
            sD = "switch2 switch2OnGrad";
        }
        else {
            sD = "switch2";
        }

        setCircleDiv(toggleCircle(circleDiv));
        props.setState(!props.value, name);
        return sD;
    }

    const toggleCircle = (cD) => {
        if(cD === "circle2") {
            cD = "circle2 switch2On";
        }
        else {
            cD = "circle2";
        }

        return cD;
    }

    const getSwitchState = () => {
        if(props.value) {
            return  "switch2 switch2OnGrad";
            
        }
        else {
            return "switch2";
        }
    }

    const getCircleState = () => {
        if(props.value) {
            return  "circle2 switch2On";
            
        }
        else {
            return "circle2";
        }
    }

    return (

        <React.Fragment>
            <div className="slidingSwitchContainer">
                <div className="slidingSwitchLabel">
                    <label htmlFor={props.name} className="col-form-label inputLabel">
                        {props.label}
                    </label>
                </div>
                <div className="slidingSwitch">
                <div className={getSwitchState()} 
                    onClick={() => {
                        if(props.flgDisabled) return;
                        setSwitchDiv(toggleSwitch(switchDiv, props.name))
                        }}
                    id="divSwitch">
                    <div className={getCircleState()} 
                        onClick={() => {
                            if(props.flgDisabled) return;
                            setSwitchDiv(toggleSwitch(switchDiv, props.name))
                            }}
                        id='circle2'>
                    </div>  
                </div>
                </div>
            </div>
            <div className="slidingSwitchError">
                {props.error && <div className="alert alert-danger">{props.error}</div>}
            </div>
        </React.Fragment>
        
    );
}
