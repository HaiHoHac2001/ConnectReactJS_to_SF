import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import UserDashboard from './components/UserDashboard';
import { authAPI } from './services/api';
import './index.css';

function App() {
  const [accessToken, setAccessToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get Salesforce access token on app start
  useEffect(() => {
    const getAccessToken = async () => {
      try {
        setLoading(true);
        const response = await authAPI.getToken();
        if (response.success) {
          setAccessToken(response.accessToken);
          console.log('✅ Access token obtained');
        }
      } catch (error) {
        console.error('❌ Failed to get access token:', error.message);
        setError('Failed to connect to Salesforce. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    getAccessToken();
  }, []);

  const handleLogin = async (email, password) => {
    if (!accessToken) {
      setError('No access token available. Please refresh the page.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await authAPI.login(email, password, accessToken);
      
      if (response.success) {
        setUserData(response.data);
        console.log('✅ Login successful:', response.data);
      }
    } catch (error) {
      console.error('❌ Login failed:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUserData(null);
    setError(null);
  };

  // Show loading while getting access token
  if (loading && !accessToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Connecting to Salesforce...</p>
        </div>
      </div>
    );
  }

  // Show error if failed to get access token
  if (error && !accessToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show dashboard if user is logged in
  if (userData) {
    return <UserDashboard userData={userData} onLogout={handleLogout} />;
  }

  // Show login form
  return (
    <div>
      <LoginForm onLogin={handleLogin} loading={loading} />
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
}

export default App;
