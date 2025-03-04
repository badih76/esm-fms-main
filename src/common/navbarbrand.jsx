import React from 'react';
import { Navbar } from 'react-bootstrap';

import Logo from '../images/esmlogo.jpg';

const NavBarBrandItem = (props) => {
    const { brandName } = props;
    return (
        <Navbar.Brand style={{paddingLeft: 0}}>
            <a href="/" style={{width: "100%"}}>
                <img src={Logo}
                    style={{margin: "-0.5em"}}
                    alt="Experts Service Management" 
                    height="200%" />
                {/* <span style={{fontSize: '0.75em', fontWeight: 'bold'}}>Experts Service<br /> Management</span> */}
            </a>
        </Navbar.Brand>
    );
};

export const NavBarAppTitle = (props) => {
    const { brandName } = props;
    return (
        <Navbar.Brand>
            <label style={{fontSize: "1vw", color: "blue"}}>Facility Management System Ver. 2.0</label>
        </Navbar.Brand>
    );
};

export default NavBarBrandItem;