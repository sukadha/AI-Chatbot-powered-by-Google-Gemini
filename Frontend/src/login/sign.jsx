import React, { useState } from 'react';
import './sign.css';
import Chat from '../chatbot/chat';

const Sign = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);
  
  // Form states for login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Form states for signup
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const API_URL = 'https://ai-chatbot-powered-by-google-gemini-kappa.vercel.app/api';

  // Handle login submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (!loginEmail || !loginPassword) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword
        })
      });

      const data = await response.json();

      if (data.success) {
        // Store user data in session (no token)
        sessionStorage.setItem('user', JSON.stringify(data.user));
        setLoggedInUser(data.user);
        setIsLoggedIn(true);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to connect to server. Please make sure backend is running on port 3000');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle signup submission
  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (!signupEmail || !signupPassword || !confirmPassword) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }
    
    if (signupPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    if (signupPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: signupEmail,
          password: signupPassword
        })
      });

      const data = await response.json();

      if (data.success) {
        // Auto login after signup
        const loginResponse = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: signupEmail,
            password: signupPassword
          })
        });
        
        const loginData = await loginResponse.json();
        
        if (loginData.success) {
          sessionStorage.setItem('user', JSON.stringify(loginData.user));
          setLoggedInUser(loginData.user);
          setIsLoggedIn(true);
        } else {
          setError('Account created! Please login manually.');
          setActiveTab('login');
          setLoginEmail(signupEmail);
          setLoginPassword(signupPassword);
        }
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Failed to connect to server. Please make sure backend is running on port 3000');
    } finally {
      setLoading(false);
    }
  };

  // Check for existing session on mount
  React.useEffect(() => {
    const user = sessionStorage.getItem('user');
    if (user) {
      setLoggedInUser(JSON.parse(user));
      setIsLoggedIn(true);
    }
  }, []);
  
  // If logged in, show Chat component
  if (isLoggedIn) {
    return <Chat user={loggedInUser} />;
  }

  const images = {
    login: "https://img.freepik.com/premium-vector/login-concept-illustration_114360-739.jpg",
    signup: "https://i.pinimg.com/736x/43/c0/47/43c04767dc84407724a508142c04e736.jpg"
  };

  return (
    <div className="sign-container">
      <div className="sign-wrapper">
        <div className="form-side">
          <div className="sign-card">
            <div className="tabs">
              <button 
                className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
                onClick={() => { setActiveTab('login'); setError(''); }}
              >
                Login
              </button>
              <button 
                className={`tab-btn ${activeTab === 'signup' ? 'active' : ''}`}
                onClick={() => { setActiveTab('signup'); setError(''); }}
              >
                Signup
              </button>
            </div>

            {error && (
              <div className="error-message">
                ⚠️ {error}
              </div>
            )}

            {activeTab === 'login' && (
              <div className="form-container">
                <h2 className="form-title">Welcome Back!</h2>
                <p className="form-subtitle">Please enter your details to continue</p>
                <form onSubmit={handleLogin}>
                  <div className="input-group">
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      placeholder="Enter your email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label>Password</label>
                    <input 
                      type="password" 
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>
                  <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                  </button>
                  <p className="footer-text">
                    Not a member? <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('signup'); }}>Signup now</a>
                  </p>
                </form>
              </div>
            )}

            {activeTab === 'signup' && (
              <div className="form-container">
                <h2 className="form-title">Create Account</h2>
                <p className="form-subtitle">Sign up to get started</p>
                <form onSubmit={handleSignup}>
                  <div className="input-group">
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      placeholder="Enter your email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label>Password</label>
                    <input 
                      type="password" 
                      placeholder="Create a password (min 6 characters)"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label>Confirm password</label>
                    <input 
                      type="password" 
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>
                  <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Creating account...' : 'Signup'}
                  </button>
                  <p className="footer-text">
                    Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('login'); }}>Login</a>
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>

        <div className="image-side">
          <div className="image-container">
            <img 
              src={images[activeTab]} 
              alt={`${activeTab} illustration`}
              className="side-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = activeTab === 'login' 
                  ? 'https://via.placeholder.com/600x800?text=Login+Illustration'
                  : 'https://via.placeholder.com/600x800?text=Signup+Illustration';
              }}
            />
            <div className="image-overlay">
              <h3>{activeTab === 'login' ? 'Welcome to AI Chatbot' : 'Join Our Community'}</h3>
              <p>{activeTab === 'login' ? 'Login to continue your journey' : 'Create an account to get started'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sign;