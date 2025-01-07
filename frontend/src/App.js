// Filename - App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import PrivateLayout from './components/PrivateLayout';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route 
          path="/dashboard" 
          element={
            <PrivateLayout>
              <Dashboard />
            </PrivateLayout>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
