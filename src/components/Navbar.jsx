import React from "react";
import logo from "../assets/logo.png";
import "./Navbar.css";

const Navbar = () => {
  return (
    <div className="navbar">
      <img src={logo} alt="logo" />
    </div>
  );
};

export default Navbar;