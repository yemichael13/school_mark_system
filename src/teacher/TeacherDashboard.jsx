import React, {useState} from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import DotGrid from "../assets/DotGrid";
import back from "../assets/back.png"
import "./TeacherDashboard.css"

const TeacherDashboard = () => {
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
                <div className="back">
                    <Link to="/">
                        
                        <button><img src={back} alt="back" /></button>
                    </Link>
                </div>
                <h1>Hello teacher!</h1>
                <h3>What do you want to do today?</h3>
                <div className="teacherNav">
                    
                    <Link to=""><button className="btn1">Students Overview</button></Link>
                    <Link to=""><button className="btn2">Mark Entry & Calculation</button></Link>
                    <Link to=""><button className="btn3">Profile</button></Link>
                </div>
            </section>
        </div>
    )
}

export default TeacherDashboard;