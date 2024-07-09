import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LogIn from './Pages/LogIn';
import Register from './Pages/Resister';
import Dashboard from './Pages/Dashboard';
import axios from 'axios';
import {Toaster} from 'react-hot-toast'
import 'bootstrap/dist/css/bootstrap.min.css';


axios.defaults.baseURL = 'http://localhost:5000'; 
axios.defaults.withCredentials = true;

const App = () => {
  return (
    <>
    <Toaster position='top-right' toastOptions={{duration:2000}} />
    <Router>
      <Routes>
        <Route path="/Login" element={<LogIn />} />
        <Route path="/" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
    </>
  );
};

export default App;
