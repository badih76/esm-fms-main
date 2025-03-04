import React, { Component } from 'react';
import { NavDropdown, MenuItem, NavItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../css/menuitems.css';

class MenuItemElement extends Component {
    state = {
        subDir: '/fms'
    }

    render() {
        const { menuitem } = this.props;

        if(menuitem.menuDropdown.length === 0)
        {
            return (
                <NavItem eventKey={menuitem.menuOptionId}>
                    <Link to={this.state.subDir + menuitem.path} >
                        <button type="text" 
                            className="myNavItem">
                            {menuitem.menuOptionTitle}
                        </button>
                    </Link>
                </NavItem>
            );
        }
        else
        {
            return (
                <NavDropdown eventKey={menuitem.menuOptionId} 
                    title={menuitem.menuOptionTitle} 
                    id="basic-nav-dropdown" >
                    {menuitem.menuDropdown.map(dd => {
                        return (
                                <MenuItem 
                                    key={dd.ddItemId} 
                                    eventKey={dd.ddItemId} style={{padding: "0", margin: "0"}}>
                                        <Link to={this.state.subDir + dd.path} 
                                            className="myNavButton"
                                            >
                                            <button className='myNavInnerButton'>
                                                {dd.ddItemTitle}
                                            </button>
                                        </Link>
                                </MenuItem>
                                )
                    })}
                </NavDropdown>
            );
        }
    }
};

export default MenuItemElement;