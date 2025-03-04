import React, { Component } from 'react';
import { Nav, NavItem } from 'react-bootstrap';
import { Switch, Route } from 'react-router-dom';
import MastCCInqCat from './mastcc-inqcat';
import TitleHeader, { TitlePageHeader } from '../titleheader/titleheader';
import InfoMessageDiv from '../../common/infomessagediv';

class MastCustCare extends Component {
    state = { 
        uprofile: {},
        subDir: '/fms'
    }

    handleSelect(k) {
        console.log(k);
        this.props.history.push(this.state.subDir + "/mastcustcare/inquirecat");
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
                <TitlePageHeader title="Customer Care Master Settings" bgColor='white' color="gray" />
                <Nav bsStyle="tabs" activeKey="1" onSelect={k => this.handleSelect(k)}>
                    <NavItem eventKey="1">
                        Inquiries Categories
                    </NavItem>
                                 
                </Nav>

                <Switch>
                    <Route path={this.state.subDir + "/mastcustcare/inquirecat"} component={MastCCInqCat} />
                    <Route path={this.state.subDir + "/mastcustcare"} exact render={(props) => <InfoMessageDiv message="Please, select your option from the above tabs." {...props} />} />
                </Switch>
            </React.Fragment>
        );
    }
};

export default MastCustCare;