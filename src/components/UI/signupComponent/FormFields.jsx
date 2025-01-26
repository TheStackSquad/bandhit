//src/components/UI/signupComponents/FormFields.jsx

'use client';
import React, { useState } from 'react';
import { 
  User, Mail, Phone, Building, 
  Lock, EyeOff, Eye 
} from 'lucide-react';

const FormFields = ({ 
  values, 
  handleChange, 
  handleBlur, 
  errors, 
  touched 
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const renderInputField = (
    icon, 
    type, 
    id, 
    name, 
    placeholder, 
    additionalClasses = ''
  ) => (
    <div className="relative mb-4">
      {React.createElement(icon, {
        className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5"
      })}
      <input
        type={type}
        id={id}
        name={name}
        value={values[name]}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`
          w-full pl-10 p-3 border rounded-md 
          focus:outline-none focus:ring-2 
          ${errors[name] && touched[name] 
            ? 'border-red-500 focus:ring-red-500' 
            : 'focus:ring-blue-500'
          }
          ${additionalClasses}
        `}
      />
      {errors[name] && touched[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <div>
      {renderInputField(User, 'text', 'name', 'name', 'Full Name')}
      {renderInputField(Mail, 'email', 'email', 'email', 'Email Address')}
      
      <div className="flex space-x-4">
        {renderInputField(Phone, 'tel', 'phoneNumber', 'phoneNumber', 'Phone Number', 'flex-1')}
        {renderInputField(Building, 'text', 'city', 'city', 'City', 'flex-1')}
      </div>

      <div className="relative mb-4">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
        <input
          type={showPassword ? 'text' : 'password'}
          id="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Password"
          className={`
            w-full pl-10 pr-10 p-3 border rounded-md 
            focus:outline-none focus:ring-2 
            ${errors.password && touched.password 
              ? 'border-red-500 focus:ring-red-500' 
              : 'focus:ring-blue-500'
            }
          `}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
        >
          {showPassword ? <EyeOff /> : <Eye />}
        </button>
        {errors.password && touched.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
        )}
      </div>

      {renderInputField(
        Lock, 
        showPassword ? 'text' : 'password', 
        'confirmPassword', 
        'confirmPassword', 
        'Confirm Password'
      )}
    </div>
  );
};

export default FormFields;