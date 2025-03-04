import React, { Component } from 'react';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import NavMenu, { NavHeader } from './common/navbar';
import NavRedirect from './common/navredirect';
// import { Switch, Route } from 'react-router-dom';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlus, faSearch, faSave, faWindowClose,
         faStop, faBan, faSyncAlt, faChartLine,
         faEdit, faTrashAlt, faReply, 
         faChevronLeft, faChevronRight, 
         faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import TitleHeader from './components/titleheader/titleheader';

library.add(faPlus, faSearch, faSave, faWindowClose,
            faStop, faBan, faSyncAlt, faChartLine,
            faEdit, faTrashAlt, faReply,
            faChevronLeft, faChevronRight,
            faAngleDoubleLeft, faAngleDoubleRight);


class App extends Component {
  state = {
    credentials: {
      useremail: '',
      password: ''
    },
    uProfile: {},
    token: '', 
    showMenuBar: false
  }

  handleShowMenuBar = () => {
    this.setState({ showMenuBar: true });
  }

  authFunctions = {
    handleSignout: () => {
      const uProfile = {};
      const token = '';
      const showMenuBar = false;
      
      this.setState({ uProfile, token, showMenuBar });
      sessionStorage.clear();
  
    },
    
    handleSignin: creds => {
      console.log(creds);
      const credentials = {...this.state.credentials};
      
      credentials.uemail = creds.uemail;
      credentials.upass = creds.upass;
  
      this.setState({ credentials, ue: creds.uemail, up: creds.upass });
    },
    
    handleSuccessfulSignin: (uprofile) => {
      let uProfile = {...this.state.uProfile};
      uProfile = uprofile;

      this.setState({ uProfile, showMenuBar: true });
    },
    
    handleTokenUpdate: (token) => {
      this.setState({ token });
    }
  
  }

  render() {

    return (
      <div className="App">
        <TitleHeader title="Facility Management System Ver. 2.0" 
          bgColor="white"
          color="blue" />
        <NavMenu menuBarVisible={this.state.showMenuBar} />
        {/* <div className="container"> */}
          {/* <div className="row">
            <div className="col-md-12"> */}
              <NavRedirect authFunc={this.authFunctions} menuVisible={this.state.showMenuBar} />
            {/* </div>
          </div> */}
        {/* </div> */}
      </div>
    );
  }
}

export default App;
