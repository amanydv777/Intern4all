import React, { useState } from 'react';
import './LoginPage.css'; // Import the CSS for this page
import * as authService from './services/authService';

const LoginPage = ({ onLoginSuccess, onSignUpClick, onForgotPasswordClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // --- Handles regular email/password login ---
  const handleRegularLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setIsLoading(true);
    setError('');

    try {
      const response = await authService.login({ email, password });
      onLoginSuccess(response.user);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
      setIsLoading(false);
    }
  };

  // --- Handles Google Login (SIMULATED) ---
  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);

    // Google OAuth flow would be implemented here
    // For now, show a message
    setError('Google login not yet configured. Please use email/password login.');
    setIsLoading(false);
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        <div className="login-logo">
          {/* Replace this with your actual SkillSync/Intern4All logo image */}
          <img src="https://assets.website-files.com/626b91c80b5557ce6782f9df/626b91c80b55570bb182fa53_SkillSync-Full-Logo-Standard-White.svg" alt="Intern4All Logo" />
        </div>
        <h2 className="login-title">Welcome to Intern4All</h2>
        <p className="login-subtitle">Sign in to continue</p>

        <button className="google-login-btn" onClick={handleGoogleLogin} disabled={isLoading}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png" alt="Google Logo" className="google-icon"/>
          Continue with Google
        </button>

        <div className="or-divider">OR</div>

        <form onSubmit={handleRegularLogin} className="login-form">
          <div className="form-group">
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {error && <p className="login-error-message">{error}</p>}

          <button type="submit" className="signin-btn" disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="login-links">
          <a href="#" onClick={(e) => {e.preventDefault(); onForgotPasswordClick && onForgotPasswordClick();}} className="forgot-password-link">Forgot password?</a>
          <span> • </span>
          <a href="#" onClick={(e) => {e.preventDefault(); onSignUpClick();}} className="signup-link">Need an account? Sign up</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;