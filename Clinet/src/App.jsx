import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LogIn from './Pages/LogIn';
import Register from './Pages/Resister';
import Dashboard from './Pages/Dashboard';


import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from './Context/AuthContext';
import ProtectedRoute from './Context/ProtectedRoute';

axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.withCredentials = true;

const App = () => {
  return (
    <AuthProvider>
      <Toaster position='top-right' toastOptions={{ duration: 3000 }} />
     
        <Routes>
          <Route path="/login" element={<LogIn />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>

    </AuthProvider>
  );
};

export default App;
