import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import DotGrid from "./assets/DotGrid";
import Footer from "./components/Footer";
import api from "./api/client";
import { useAuth } from "./AuthContext";
import "./App.css";
import Bg_school from "./assets/Bg-school.png";


const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState('teacher');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const { user } = await login({ role, email, password });
      if (user?.role === 'admin') navigate('/AdminDashboard');
      else navigate('/TeacherDashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  }

  return (
    <div>
      <Navbar />
      <div className="login">
      <img src={Bg_school} alt="Bg_school" />
      
      <div className="login-container">
        <div className="login-text">
          
          <h1>DEGNETU ACADEMY</h1>
          <h2>Students Mark Management System</h2>
        </div>
        <div className="login-form">
            <form onSubmit={handleSubmit} >
              <h2 >Login</h2>
              <label >
                Role:
                <select value={role} onChange={e => setRole(e.target.value)} style={{ marginLeft: 8 }}>
                  <option value="admin">Admin</option>
                  <option value="teacher">Teacher</option>
                </select>
              </label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                
              />
              <button type="submit" >Login</button>
              {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
            </form>
      </div>
      </div>
      
      
        
      </div>
      <Footer />
    </div>
    
  )

}

export default Login;