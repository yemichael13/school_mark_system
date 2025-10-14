import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./Login";
import TeacherDashboard from "./teacher/TeacherDashboard";
import MarkEntry from "./teacher/MarkEntry";
import StudOverview from "./teacher/StudOverview";
import AdminDashboard from "./admin/AdminDashboard";
import ManageStudents from "./admin/ManageStudents";
import ManageSubjecs from "./admin/ManageSubjects";
import ManageTeachers from "./admin/ManageTeachers";
import { AuthProvider, useAuth } from "./AuthContext";


function RequireAuth({ children, role }){
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/AdminDashboard" element={<RequireAuth role="admin"><AdminDashboard /></RequireAuth>} />
            <Route path="/TeacherDashboard" element={<RequireAuth role="teacher"><TeacherDashboard /></RequireAuth>} />
            <Route path="/MarkEntry" element={<RequireAuth role="teacher"><MarkEntry /></RequireAuth>} />
            <Route path="/StudOverview" element={<RequireAuth role="teacher"><StudOverview /></RequireAuth>} />
            <Route path="/ManageStudents" element={<RequireAuth role="admin"><ManageStudents /></RequireAuth>} />
            <Route path="/ManageSubjects" element={<RequireAuth role="admin"><ManageSubjecs /></RequireAuth>} />
            <Route path="/ManageTeachers" element={<RequireAuth role="admin"><ManageTeachers /></RequireAuth>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App;