import React, { useState } from 'react';
import Header from './Header';
import InputField from './InputField';
import PasswordToggle from './PasswordToggle';
import NavigationLink from './NavigationLink';
import './LoginPage.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      setTimeout(() => {
        console.log('Login successful', formData);
        setIsSubmitting(false);
        console.log('Navigating to app dashboard');
      }, 1500);
    }
  };

  return (
    <div className="login-page">
      <Header />
      
      <div className="login-form-container">
        <NavigationLink to="/home" label="Back to Home" />
        
        <div className="login-form">
          <div className="form-header">
            <h2>Welcome back</h2>
            <p>Sign in to your account to continue</p>
          </div>
          
          <InputField
            label="Email Address"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="you@example.com"
            type="email"
          />

          <InputField
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="••••••••"
            type="password"
          >
            <PasswordToggle
              showPassword={showPassword}
              onClick={() => setShowPassword(!showPassword)}
            />
          </InputField>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`submit-button ${isSubmitting ? 'disabled' : ''}`}
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
          
          <div className="signup-link">
            <p>Don't have an account? <NavigationLink to="/signup" label="Sign up" /></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
