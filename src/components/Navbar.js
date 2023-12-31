import React from "react";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import logo from "../images/dfb-logo-transparent.png";

const Navbar = (props) => {
  return (
    <nav>
      <div className="logo">
        <Link to="/">
          <img style={{ width: 100 }} src={logo} alt="Logo" />
        </Link>
      </div>
      <ul className="nav-links">
        <li style={{ display: props.dashboard }}>
          <Link to="/loggedin">Dashboard</Link>
        </li>
        <li style={{ display: props.login }}>
          <Link to="/login">Login</Link>
        </li>
        <li style={{ display: props.signup }}>
          <Link to="/signup">Sign Up</Link>
        </li>
        <li style={{ display: props.logout }}>
          <LogoutButton />
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
