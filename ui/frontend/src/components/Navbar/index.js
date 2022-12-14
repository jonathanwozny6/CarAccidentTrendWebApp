import React from "react";
import { Nav, NavLink, NavMenu } 
    from "./NavbarElements";
  
const Navbar = () => {
  return (
    <>
      <Nav>
        <NavMenu>
          <NavLink to="/" activeStyle>
            Home
          </NavLink>
          <NavLink to="/Query1" activeStyle>
            Query1
          </NavLink>
          <NavLink to="/Query2" activeStyle>
            Query2
          </NavLink>
          <NavLink to="/Query3" activeStyle>
          Query3
          </NavLink>
          <NavLink to="/Query4" activeStyle>
            Query4
          </NavLink>
          <NavLink to="/Query5" activeStyle>
            Query5
          </NavLink>
        </NavMenu>
      </Nav>
    </>
  );
};
  
export default Navbar;