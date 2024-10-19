// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import PostJob from './pages/PostJob';
import Navbar from './components/Navbar';
import './style.css'; 
import Logout from './pages/Logout';
import Jobs from './pages/Jobs';
import { AuthProvider } from './context/AuthContext.jsx';
import Dashboard from './pages/Dashboard.jsx';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="post-job" element={<PostJob />} />
            <Route path="jobs" element={<Jobs />} />
          </Route>
          <Route path="/" element={<Logout />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
