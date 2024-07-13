import React from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import LogIn from './Pages/LogIn';
import Register from './Pages/Resister';  // Fix typo: 'Resister' to 'Register'
import Dashboard from './Pages/Dashboard';
import ProtectedRoute from './Context/ProtectedRoute';
import AddMember from './Pages/AddMembers';
import ManageMembers from './Pages/ManageMembers';
import { Toaster } from 'react-hot-toast';


// Set the default base URL for axios
axios.defaults.baseURL = 'http://localhost:5000'; // Update with your production URL


const App = () => {
  return (
    <>
    <Toaster position='top-right' toastOptions={{duration:2000}} />
    <Routes>
      
      <Route path="/login" element={<LogIn />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/addmember" element={<ProtectedRoute><AddMember /></ProtectedRoute>} />
      <Route path="/members" element={<ProtectedRoute><ManageMembers /></ProtectedRoute>} />
    
    </Routes>
    </>
  );
};

export default App;
