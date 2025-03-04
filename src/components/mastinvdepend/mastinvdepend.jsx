import React, { Component } from 'react';
import { Nav, NavItem } from 'react-bootstrap';
import { Switch, Route } from 'react-router-dom';
import MastInvCateg from './mastinv-invcat';
import InfoMessageDiv from '../../common/infomessagediv';
import MastInvTemplates from './mastinv-itemtemp';
import { TitlePageHeader } from '../titleheader/titleheader';

// const selected = {
//     fontWeight: "bold",
//     backgroundColor: "lightblue"
// }

class MastInvDepend extends Component {
    state = {
        selectedTab: "",
        uprofile: {},
        subDir: '/fms'
    }

    handleSelect(k) {
        this.setState({ selectedTab: k });

        if(k === "1") {
            this.props.history.push(this.state.subDir + "/mastinvdepend/invcategories");
        }
        else if(k === "2") {
            this.props.history.push(this.state.subDir + "/mastinvdepend/invtemplates");
        } 
        else if(k === "3") {
            this.props.history.push(this.state.subDir + "/mastinvdepend/invunits");
        } 
        
    };

    constructor(props) {
        super(props);

        const token = sessionStorage['token'];
        const uprofile = JSON.parse(sessionStorage.getItem('uprofile'));

        if(!token || !this.props.menuVisible)
        {
            props.history.push(this.state.subDir + '/');
            return ;
        }
        else
        {
            this.state.uprofile = uprofile;
        }
    };

    render() {
        
        return (
            <React.Fragment>
                <TitlePageHeader title="Inventory Master Settings" bgColor='white' color="gray" />
                <Nav bsStyle="tabs" activeKey={this.state.selectedTab} onSelect={k => this.handleSelect(k)}>
                    <NavItem eventKey="1" >
                        Inventory Categories
                    </NavItem>
                    <NavItem eventKey="2" >
                        Items Templates
                    </NavItem>
                    {/* <NavItem eventKey="3" >
                        Units
                    </NavItem> */}
                </Nav>

                <Switch>
                    <Route path={this.state.subDir + "/mastinvdepend/invcategories"} component={MastInvCateg} />
                    <Route path={this.state.subDir + "/mastinvdepend/invtemplates"} component={MastInvTemplates} />
                    <Route path={this.state.subDir + "/mastinvdepend"} exact render={(props) => <InfoMessageDiv message="Please, select your option from the above tabs." {...props} />} />
                </Switch>
            </React.Fragment>
        );
    }

};

export default MastInvDepend;