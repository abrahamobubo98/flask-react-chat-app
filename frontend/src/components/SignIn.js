import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          username,
          password
        }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        console.log("Login successful:", data);
        navigate('/dashboard', { 
          state: { 
            username: data.user.username,
            avatar: data.user.avatar 
          } 
        });
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      console.error("Error:", error);
      setError('Network error - please try again');
    }
  };

  return (
    <div className="App">
      <div className="left-section">
        <h1 className="welcome-text">Welcome to ChatBrilliant!!</h1>
      </div>
      <div className="right-section">
        <div className="login-container">
          <h1>Sign In</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}
            <button type="submit">Sign In</button>
          </form>
          <p style={{ textAlign: 'center', marginTop: '1rem' }}>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn; 