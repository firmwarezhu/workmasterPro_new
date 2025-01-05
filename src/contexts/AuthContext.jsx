import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { GOOGLE_CONFIG } from '../config/google-config';
import googleDriveService from '../services/googleDriveService';
import { initializeGoogleApi, loadGoogleScript } from '../utils/googleApi';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('Starting auth initialization...');
        
        // Load Google Identity Services script
        await loadGoogleScript();
        console.log('Google Identity script loaded');

        // Load Google API script
        await initializeGoogleApi();
        console.log('Google API script loaded');

        // Initialize Google Identity Services
        console.log('Initializing Google Identity Services...');
        window.google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CONFIG.clientId,
          scope: GOOGLE_CONFIG.scopes.join(' '),
          callback: handleCredentialResponse,
          error_callback: (error) => {
            console.error('OAuth error:', error);
          }
        });
        console.log('Google Identity Services initialized');

        // Check for existing token
        const token = localStorage.getItem('workmaster_token');
        if (token) {
          try {
            console.log('Found existing token, validating...');
            
            // Verify token by making a userinfo request
            const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }).then(res => {
              if (!res.ok) throw new Error('Token invalid');
              return res.json();
            });

            const initializeDriveService = async () => {
              try {
                console.log('Token valid, initializing Drive service...');
                const success = await googleDriveService.initialize(token);
                if (success) {
                  console.log('Successfully initialized Drive service');
                }
              } catch (error) {
                console.error('Failed to initialize Drive service:', error);
              }
            };
            await initializeDriveService();
            setCurrentUser({ token, email: userInfo.email });
            console.log('Successfully initialized with existing token');
          } catch (error) {
            console.log('Token validation failed, redirecting to login');
            localStorage.removeItem('workmaster_token');
            navigate('/login');
          }
        } else {
          console.log('No token found, redirecting to login');
          navigate('/login');
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        localStorage.removeItem('workmaster_token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [navigate]);

  const handleCredentialResponse = async (tokenResponse) => {
    try {
      console.log('Received token response:', tokenResponse);
      const accessToken = tokenResponse.access_token;
      
      // Store the access token
      localStorage.setItem('workmaster_token', accessToken);

      const initializeDriveService = async () => {
        try {
          console.log('Initializing Drive service...');
          const success = await googleDriveService.initialize(accessToken);
          if (success) {
            console.log('Successfully initialized Drive service');
          }
        } catch (error) {
          console.error('Failed to initialize Drive service:', error);
        }
      };
      await initializeDriveService();
      
      // Get user info
      const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }).then(res => res.json());
      
      setCurrentUser({ token: accessToken, email: userInfo.email });
      console.log('Login successful, navigating to dashboard...');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      localStorage.removeItem('workmaster_token');
      throw error;
    }
  };

  const login = () => {
    try {
      console.log('Attempting to show Google login prompt...');
      if (!window.google?.accounts?.oauth2) {
        console.error('Google OAuth2 not initialized');
        return;
      }
      window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CONFIG.clientId,
        scope: GOOGLE_CONFIG.scopes.join(' '),
        callback: handleCredentialResponse
      }).requestAccessToken();
    } catch (error) {
      console.error('Failed to show login prompt:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('workmaster_token');
    setCurrentUser(null);
    navigate('/login');
  };

  const value = {
    currentUser,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
