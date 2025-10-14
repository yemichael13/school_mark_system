import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DotGrid from "../assets/DotGrid";
import { Link, useNavigate } from "react-router-dom";
import logout from "../assets/logout.png";
import { useAuth } from "../AuthContext";
import "./AdminDashboard.css";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

   return(
    <div className="adminDashboard">
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
        <section className="adminContainer">
            <h1>HELLO ADMIN!</h1>
            <h3>What do you want to do today?</h3>
            <div className="adminNav">
                <Link to="/ManageStudents"><button className="btn1">Manage Students</button></Link>
                <Link to="/ManageTeachers"><button className="btn2">Manage Teachers</button></Link>
                <Link to="/ManageSubjects"><button className="btn3">Manage Subjects</button></Link>
                <button className="btn4" onClick={handleLogout}><img src={logout} alt="logout" />Logout</button>
            </div>
        </section>
        <Footer />
    </div>
   )
}

export default AdminDashboard;