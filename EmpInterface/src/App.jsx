import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FirstRegistrationPage from './features/registration-1';
import LoginPage from './features/login';
import AdminPanel from './components/Admin/AdminPanel';
import Profile from './components/AdminComponents/Profile';
import SecondRegistrationPage from './features/registration-2';
import EmployeeTable from './components/AdminComponents/EmpDashboard';
import AttendanceTodo from './components/AdminComponents/TakeAttendance';
import Employee from './components/emp/Employee';
import EmployeeProfile from './components/emp/EmpComponents/EmpProfile';
import ProjectManagement from './components/AdminComponents/ProjectAssignment';
// import AttendanceSheet from './components/AdminComponents/AttendanceSheet';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Routes>
          <Route path="/registration" element={<FirstRegistrationPage />} />
          <Route path="/registration-2" element={<SecondRegistrationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path='/' element={<AdminPanel/>} />
          <Route path="/profile" element={<Profile />} />
          <Route path='/EmpDashboard' element={<EmployeeTable/>} />
          <Route path='/Attendance' element={<AttendanceTodo/>} />
          <Route path='/Employee' element={<Employee/>} />
          <Route path='/EmpProfile' element={<EmployeeProfile/>} />
          <Route path='/ProjectManagement' element={<ProjectManagement/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
