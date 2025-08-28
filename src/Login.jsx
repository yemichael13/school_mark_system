import React, {useState} from "react";
import {Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import DotGrid from "./assets/DotGrid";
import Footer from "./components/Footer";
import "./App.css";

const Login = () => {
  return (
    <div className="login">
      <div className="background">
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          <DotGrid
            dotSize={3}
            gap={10}
            baseColor="#9CA3AF"
            activeColor="#6B7280"
            proximity={100}
            shockRadius={250}
            shockStrength={5}
            resistance={750}
            returnDuration={1.5}
          />
        </div>
      </div>
      <Navbar />
      <div className="login-text">
        <h1>DEGNETU ACADEMY</h1>
        <h2>Students Mark Management System</h2>
      </div>
      <div className="login-form">
        <form>
          <h1>Login</h1>
          <input type="text" id="username" name="username" placeholder="username" />
          <br />
          <input type="password" id="password" name="password" placeholder="password" />
          <br />
          <Link to="/TeacherDashboard"><button type="submit">Login</button></Link>
          <Link to="/AdminDashboard">Admin</Link>
        </form>
      </div>
      <Footer />
    </div>
  )
}

export default Login;