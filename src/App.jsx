import React, {useState} from "react";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import TeacherDashboard from "./teacher/TeacherDashboard";
import MarkEntry from "./teacher/MarkEntry";
import StudOverview from "./teacher/StudOverview";
import Navbar from "./components/Navbar";


const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/TeacherDashboard" element={<TeacherDashboard />} />
          <Route path="/MarkEntry" element={<MarkEntry />} />
          <Route path="/StudOverview" element={<StudOverview />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App;