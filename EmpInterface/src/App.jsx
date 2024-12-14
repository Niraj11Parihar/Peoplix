import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FirstRegistrationPage from './features/registration-1';
import LoginPage from './features/login';
import AdminPanel from './components/Admin/AdminPanel';
import EmployeeTable from './components/emp/EmpDashboard';
import Profile from './components/AdminComponents/Profile';
import SecondRegistrationPage from './features/registration-2';

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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
