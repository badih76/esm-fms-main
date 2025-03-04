import React, { Component } from 'react';
import { TitlePageHeader } from '../titleheader/titleheader';
import Input from '../../common/input';
import processing from '../../images/processing.gif';

import * as firebase from 'firebase/app';
import 'firebase/auth'; 
import 'firebase/firestore';

const auth = firebase.auth();
const db = firebase.firestore();

class Login extends Component {
    state = {
        credentials: {
            useremail: '',
            password: ''
        },
        user: {},
        formProcess: false,
        errorMessage: ''
    };

    handleChange = (e) => {
        const credentials = {...this.state.credentials};
        credentials[e.currentTarget.name] = e.currentTarget.value;
        this.setState({ credentials });
    };

    handleSubmit = (e) => {
        const {useremail, password} = this.state.credentials;
        const { history } = this.props;

        this.setState({ formProcess: true });

        this.props.updateToken("");
        auth.signInWithEmailAndPassword(useremail, password)
            .then(result => {
                // localStorage['token'] = result.user.refreshToken;
                sessionStorage['token'] = result.user.refreshToken;
                this.setState({ user: result.user }); 
                this.props.updateToken(result.user.refreshToken);
                const usersDb = db.collection('Users').doc('docUsers').collection('colUsers');
                return usersDb.where("UID", "==", result.user.uid).get();
            })
            .then(snapshot => {
                if(snapshot.docs.length > 0)
                {
                    this.props.onSuccessfulSignin(snapshot.docs[0].data());
                    const uprof = {uid: this.state.user.uid, ...snapshot.docs[0].data()};
                    sessionStorage.setItem('uprofile', JSON.stringify(uprof));
                    this.setState({ formProcess: false });
                    history.push('/fms/dashboard');
                }
                else {
                    console.log(snapshot);
                }
            })
            .catch(error => {
                console.log('Unsucessful', error);
                this.setState({ errorMessage: error.message, formProcess: false });
                sessionStorage.clear();
                
            });                    
    };

    constructor(props) {
        super(props);
        
        this.props.onSignOut();
    }
    
    render() {
      return (
        <React.Fragment>
            <TitlePageHeader title="Log-in to the system" bgColor="white" color="gray" />

            <div className="row">
                <div className="col-md-4"></div>
                <div className="col-md-4" style={formStyle}>
                    <Input  name="useremail" 
                            label="User Email"
                            onChange={this.handleChange} />
                    <Input  name="password" 
                            label="Password"
                            type="password"
                            onChange={this.handleChange} />
                    <hr />
                    <button className="btn btn-primary btn-sm" 
                            style={{width: "100%"}}
                            onClick={this.handleSubmit} >Log-in</button>                    

                    <img src={processing} 
                            width="40vw" 
                            alt="processing" 
                            className={this.state.formProcess ? "" : "hidden"} 
                            style={{marginTop: "2vh"}} />
                    <div className={"row " + (this.state.errorMessage !== '' ? "" : "hidden")}> 
                        <div className="col-md-12">
                            <hr />
                            <label style={errorMsgStyle}>{this.state.errorMessage}</label>
                        </div>
                    </div>
                </div>
                <div className="col-md-4"></div>
            </div>
        </React.Fragment>
      );
   }
}

export default Login;

const formStyle = {
    borderWidth: "1",
    borderStyle: "solid",
    borderColor: "lightgray",
    borderRadius: "25px",
    padding: "15px"
}

const errorMsgStyle = {
    color: "red",
    fontStyle: "italic"
}