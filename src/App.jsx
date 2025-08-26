import React, {useState} from "react";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import TeacherDashboard from "./teacher/TeacherDashboard";
import Navbar from "./components/Navbar";


const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/TeacherDashboard" element={<TeacherDashboard />} />
          
        </Routes>
      </div>
    </Router>
  )
}

export default App;