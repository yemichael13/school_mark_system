import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import DotGrid from "./assets/DotGrid";
import Footer from "./components/Footer";
import api from "./api/client";
import { useAuth } from "./AuthContext";
import "./App.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState('admin');
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
            <form onSubmit={handleSubmit} style={{ maxWidth: 350, margin: '40px auto', padding: 24, border: '1px solid #eee', borderRadius: 8 }}>
              <h2 style={{ textAlign: 'center' }}>Login</h2>
              <label style={{ display: 'block', marginBottom: 8 }}>
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
                style={{ width: '100%', marginBottom: 12, padding: 8 }}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{ width: '100%', marginBottom: 12, padding: 8 }}
              />
              <button type="submit" style={{ width: '100%', padding: 10, background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4 }}>Login</button>
              {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
            </form>
      </div>
      <Footer />
    </div>
  )

}

export default Login;