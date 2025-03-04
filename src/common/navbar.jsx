import React, { Component } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import NavBarBrandItem, { NavBarAppTitle } from './navbarbrand';
import MenuItemElement from './menuitem';

import menuStructure from '../resources/menu.json';

class NavMenu extends Component {
    state = {
        uprofile: {},
    }

    render() {
        
        return (
            <Navbar collapseOnSelect>
                <Navbar.Header>
                    <NavBarBrandItem brandName="Experts Services Management" />
                </Navbar.Header>
                <Navbar.Toggle />
                <Navbar.Collapse>
                    <Nav>
                        {(this.props.menuBarVisible) ? 
                            menuStructure.map(mi => {return <MenuItemElement key={mi.menuOptionId} menuitem={mi} />}) 
                            : ""}                    
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            
        );
    }
};

export class NavHeader extends Component {
    
    render() {
        
        return (
            <Navbar collapseOnSelect>
                
                <Navbar.Toggle />
                
            </Navbar>
            
        );
    }
};


export default NavMenu;
