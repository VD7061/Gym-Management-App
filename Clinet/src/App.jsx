// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LogIn from './Pages/LogIn';
import Register from './Pages/Resister';
import Dashboard from './Pages/Dashboard';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import 'bootstrap/dist/css/bootstrap.min.css';

axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.withCredentials = true;

const isAuthenticated = true; 

const App = () => {
  return (
    <>
      <Toaster position='top-right' toastOptions={{ duration: 3000 }} />
      <Router>
        <Routes>
          <Route path="/login" element={<LogIn />} />
          <Route path="/" element={<Register />} />
          {isAuthenticated ? (
            <Route path="/dashboard" element={<Dashboard />} />
          ) : (
            <Navigate to="/login" replace />
          )}
        </Routes>
      </Router>
    </>
  );
};

export default App;
