// src/schemas/validationSchema/contactValidation.jsx
import * as Yup from 'yup';

const contactValidationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().matches(/^[0-9]+$/, 'Phone must be a number').nullable(),
  message: Yup.string().required('Message is required')
});

export default contactValidationSchema;