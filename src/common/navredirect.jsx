import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import Dashboard from '../components/dashboard';
import MastInvDepend from '../components/mastinvdepend/mastinvdepend';
import MastCustCare from '../components/mastcustcare/mastcustcare';
import SOAForm from '../components/financials/fin-soa/fin-soa';
import JVForm from '../components/financials/fin-jv/fin-jv';
import InvCliAsst from '../components/inv-client-assets/invclientasset';
import MastPrjServices from '../components/mastprjserv.jsx/mastprjsrv';
import MainJobCards from '../components/mainjobcards/mainjobcards';
import MaintPoolReadingForm from '../components/maintpoolreading/maintpoolreading';
import ContractDef from '../components/contractdefinition/contractdefinition';
import JobPlanner from '../components/jobplanner/jobplanner';
import Login from '../components/login/login';
import Tickets from '../components/customercare/tickets';
import Reports from '../components/reports/reports';
import ContMeterReadings from '../components/contract-meter-readings/contractmeterreading';
import UserAdmin from '../components/useradmin/useradmin';
import ClientUserAdmin from '../components/clientuseradmin/clientuseradmin';
import CRMUploadAttach from '../components/crm-upload-attach/crmuploadattach';

class NavRedirect extends Component {

    state = {
        subDir: '/fms'
    }

    render() {
        const { handleSignin, handleSignout, handleTokenUpdate, handleSuccessfulSignin } = this.props.authFunc;
        const { menuVisible } = this.props;
        const { subDir } = this.state; 

        return (
            <Switch>
                <Route exact path="/" 
                    render={(props) => <Login   onSignin={handleSignin} 
                                                onSuccessfulSignin={handleSuccessfulSignin} 
                                                updateToken={handleTokenUpdate} 
                                                onSignOut={handleSignout} 
                                                {...props} /> } 
                />
                {/* <Route  render={(props) => <Login   onSignin={handleSignin} 
                                                onSuccessfulSignin={handleSuccessfulSignin} 
                                                updateToken={handleTokenUpdate} 
                                                onSignOut={handleSignout} 
                                                {...props} /> } 
                /> */}
                <Route exact path="/fms/" 
                    render={(props) => <Login   onSignin={handleSignin} 
                                                onSuccessfulSignin={handleSuccessfulSignin} 
                                                updateToken={handleTokenUpdate} 
                                                onSignOut={handleSignout} 
                                                {...props} /> } 
                />

                <Route path={subDir + "/mastusersadmin"} 
                    render={(props) => <UserAdmin menuVisible={menuVisible} {...props} />} 
                />

                <Route path={subDir + "/mastclientusersadmin"} 
                    render={(props) => <ClientUserAdmin menuVisible={menuVisible} {...props} />} 
                />

                <Route path={subDir + "/dashboard"} render={(props) => <Dashboard menuVisible={menuVisible} {...props} />} />
                
                <Route path={subDir + "/mastcustcare"} render={(props) => <MastCustCare menuVisible={menuVisible} {...props} />} />
                <Route path={subDir + "/mastinvdepend"} render={(props) => <MastInvDepend menuVisible={menuVisible} {...props} />} />
                <Route path={subDir + "/projservdef"} render={(props) => <MastPrjServices menuVisible={menuVisible} {...props} /> } />

                <Route path={subDir + "/fincsoa"} render={(props) => <SOAForm menuVisible={menuVisible} {...props} />} />
                <Route path={subDir + "/finjentry"} render={(props) => <JVForm menuVisible={menuVisible} {...props} />} />
                
                <Route path={subDir + "/invclientsassets"} render={(props) => <InvCliAsst menuVisible={menuVisible} {...props} />} />
                <Route path={subDir + "/contmetread"} render={(props) => <ContMeterReadings menuVisible={menuVisible} {...props} />} />
                <Route path={subDir + "/projcontdef"} render={(props) => <ContractDef menuVisible={menuVisible} {...props} />} />

                <Route path={subDir + "/mainjobcards"} render={(props) => <MainJobCards menuVisible={menuVisible} {...props} />} />
                <Route path={subDir + "/mainjobplanner"} render={(props) => <JobPlanner menuVisible={menuVisible} {...props} />} />
                <Route path={subDir + "/mainpoolreadings"} render={(props) =>  <MaintPoolReadingForm menuVisible={menuVisible} {...props} />} />

                <Route path={subDir + "/ccaretickets"} render={(props) => <Tickets menuVisible={menuVisible} {...props} />} />

                <Route path={subDir + "/crmuploadattach"} 
                    render={(props) => <CRMUploadAttach menuVisible={menuVisible} {...props} />} 
                />

                <Route path={subDir + "/reports"} render={(props) => <Reports menuVisible={menuVisible} {...props} />} />

            </Switch>
        );
    }
};

export default NavRedirect;