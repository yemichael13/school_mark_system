import React, {useState} from "react";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import TeacherDashboard from "./teacher/TeacherDashboard";
import MarkEntry from "./teacher/MarkEntry";
import StudOverview from "./teacher/StudOverview";
import AdminDashboard from "./admin/AdminDashboard";
import ManageStudents from "./admin/ManageStudents";
import ManageSubjecs from "./admin/ManageSubjects";
import ManageTeachers from "./admin/ManageTeachers";


const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/AdminDashboard" element={<AdminDashboard />} />
          <Route path="/TeacherDashboard" element={<TeacherDashboard />} />
          <Route path="/MarkEntry" element={<MarkEntry />} />
          <Route path="/StudOverview" element={<StudOverview />} />
          <Route path="/ManageStudents" element={<ManageStudents />} />
          <Route path="/ManageSubjects" element={<ManageSubjecs />} />
          <Route path="/ManageTeachers" element={<ManageTeachers />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App;