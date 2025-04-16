// src/schemas/validationSchema/newsletterValidation.jsx
import * as Yup from 'yup';

export const newsletterValidationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required')
        .matches(
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            'Email must be a valid format (e.g., user@example.com)'
        ),
});