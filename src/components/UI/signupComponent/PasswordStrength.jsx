//src/components/UI/signupComponents/passwordStrength.jsx

'use client';
import React, { useState, useEffect } from 'react';

const PasswordStrength = ({ password }) => {
  const [strength, setStrength] = useState('');
  
  const checkStrength = (password) => {
    if (password.length > 8) {
      setStrength('Strong');
    } else if (password.length > 4) {
      setStrength('Medium');
    } else {
      setStrength('Weak');
    }
  };

  useEffect(() => {
    checkStrength(password);
  }, [password]);

  return (
    <div className="mt-2">
  <p className="text-sm text-gray-700">
    Password Strength: {" "}
    <span
      className={`font-semibold ${
        strength === 'Strong'
          ? 'text-green-500'
          : strength === 'Medium'
          ? 'text-yellow-500'
          : 'text-red-500'
      }`}
    >
      {strength}
    </span>
  </p>
</div>

  );
};

export default PasswordStrength;
