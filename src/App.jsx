import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './contexts/AuthContext';
import { GOOGLE_CONFIG } from './config/google-config';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <GoogleOAuthProvider clientId={GOOGLE_CONFIG.clientId}>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AuthProvider>
        </GoogleOAuthProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;
