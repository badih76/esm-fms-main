import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


class PopupWindow extends Component {
    state = {
        visibleStyle: {
            border: "solid lightgray 1px",
            borderRadius: "25px",
            padding: "5vh",
            width: "90%",
            height: "90%",
            background: "white",
            position: "fixed",
            top: '5%',
            left: '5%',
            display: "flex",
            flexDirection: 'column',
            visibility: 'visible',
            // overflow: 'auto',
            transition: "height 1s linear",
            boxShadow: "inset 0 0 5px black"
        },
        hiddenStyle: {
            border: "solid lightgray 1px",
            borderRadius: "25px",
            padding: "5vh",
            width: "90%",
            height: "90%",
            background: "white",
            position: "fixed",
            display: "flex",
            flexDirection: 'column',
            visibility: 'hidden',
            // overflow: 'auto',
        },
        backshade: {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            visibility: "hidden",
            background: "rgba(0, 0, 0, 0.5)"
        },
        closeButton: {
            position: "absolute", 
            top: "5vh", 
            left: "95%", 
            display: "inline", 
            color: 'red', 
            fontSize: '2vw', 
            cursor: "pointer"
        },
        visible: false,
        contents: null
    }

    displayPopWin = () => {        
        this.props.onClickPopup()
            .then(result => {                
                let backshade = {...this.state.backshade};
                backshade.visibility = "visible";
        
                this.setState({ visible: true, backshade, contents: this.props.children });
            })
            .catch(error => {
                console.log(error);
            });

    }
    
    closePopWin = () => {
        let backshade = {...this.state.backshade};
        backshade.visibility = "hidden";

        this.setState({ visible: false, backshade });
    }

    constructor (props) {
        super(props);
        // this.props.onClickPopup();

    }

    componentDidMount = (props) => {
        if(!this.props.displaystyle) return;
        
        let visibleStyle = {...this.state.visibleStyle};

        let displaystyle = {...this.props.displaystyle};

        for (var element in displaystyle) {
            visibleStyle[element] = displaystyle[element];
        };
        this.setState({ visibleStyle });
        
        console.log(visibleStyle);

    } 

    render() {
        const { buttonstyle, showbutton } = this.props;        
        return (
            <React.Fragment>
                <button onClick={this.displayPopWin} className={"btn btn-primary"}>
                    {showbutton}
                </button>
                <div style={this.state.backshade} onClick={this.closePopWin}></div>
                <div style={this.state.visible === true 
                                ? this.state.visibleStyle 
                                : this.state.hiddenStyle} 
                    id="popWindow">
                    <div style={{width: "100%", flex: 9 }}>
                        {this.state.contents}
                    </div>
                    {/* <div style={{flex: 1, position: "absolute", top: "5vh", left: "90%"}}> */}
                        <span style={this.state.closeButton} 
                                onClick={this.closePopWin}><FontAwesomeIcon icon='window-close' /></span>
                    {/* </div> */}
                </div>
            </React.Fragment>
      );
   }
}

export default PopupWindow;

const popwin = {
    border: "solid black 1px",
    borderRadius: "25px",
    padding: "25px",
    width: "20vw",
    height: "30vh",
    background: "lightgray",
    position: "absolute",
    display: "none"
  }