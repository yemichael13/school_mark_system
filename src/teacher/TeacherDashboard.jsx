import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DotGrid from "../assets/DotGrid";
import logout from "../assets/logout.png";
import { useAuth } from "../AuthContext";
import "./TeacherDashboard.css"

const TeacherDashboard = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return(
        <div className="teacherDashboard">
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
            
            <section className="teacherContainer">
                
                <h1>Hello teacher!</h1>
                <h3>What do you want to do today?</h3>
                <div className="teacherNav">
                    
                    <Link to="/StudOverview"><button className="btn1">Students Overview</button></Link>
                    <Link to="/MarkEntry"><button className="btn2">Mark Entry & Calculation</button></Link>
                    <button className="btn3" onClick={handleLogout}><img src={ logout } alt="logout" />Logout</button>
                </div>
            </section>
            <Footer />
        </div>
    )
}

export default TeacherDashboard;