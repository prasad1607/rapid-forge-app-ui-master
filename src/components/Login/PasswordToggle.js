import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import './PasswordToggle.css';

const PasswordToggle = ({ showPassword, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="password-toggle"
  >
    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
  </button>
);

export default PasswordToggle;
