// src/schemas/validationSchema/userSchema.js
import * as Yup from 'yup'; // Consistently use the same case

const phoneRegExp = /^[0-9]{10}$/;

export const signUpSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name is too long')
    .required('Name is required'),
  
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[^\w]/, 'Password must contain at least one symbol')
    .required('Password is required'),
  
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
  
  phoneNumber: Yup.string()
    .matches(phoneRegExp, 'Phone number must be 10 digits')
    .required('Phone number is required'),
  
  isAdult: Yup.boolean()
    .oneOf([true], 'You must be 18 or older')
    .required('Age confirmation is required'),
  
  city: Yup.string()
    .required('City is required'),
  
  referralSource: Yup.string()
    .oneOf(['newsletter', 'friend', 'internet', 'youtube', 'ads'], 'Please select how you heard about us')
    .required('Please select how you heard about us')
});

// Social signup validation
export const socialSignUpSchema = Yup.object({ // Use 'Yup' consistently here
  email: Yup.string().required('Email is required').email('Invalid email format'),
  socialProvider: Yup.string()
    .required('Social provider is required')
    .oneOf(['google', 'facebook', 'linkedin', 'twitter'], 'Invalid social provider'),
  socialId: Yup.string().required('Social ID is required'),
});

export const emailSchema = Yup.string()
  .email('Invalid email address')
  .required('Email is required');
