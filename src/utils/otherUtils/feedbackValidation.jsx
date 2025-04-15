//src/utils/feedbackValidation.jsx

// src/utils/contactUtils.jsx
import { supabaseClient } from '@/lib/supabaseClient';
import { z } from 'zod';

// Feedback form validation schema using Zod

export const feedbackSchema = z.object({
    name: z
        .string()
        .trim()
        .max(50, { message: 'Name should be less than 50 characters' })
        .optional(),

    email: z
        .string()
        .email({ message: 'Please enter a valid email address' })
        .optional()
        .superRefine((val, ctx) => {
            // Ensure ctx.parent is defined before accessing it
            if (ctx.parent && ctx.parent.wantContribution && (!val || val.trim() === '')) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Email is required for contributors',
                    path: ['email']
                });
            }
        }),

    feedbackType: z
        .enum(['general', 'bug', 'feature'], {
            errorMap: () => ({ message: 'Please select a valid feedback type' })
        })
        .default('general'),

    message: z
        .string()
        .trim()
        .min(10, { message: 'Please provide at least 10 characters of feedback' })
        .max(1000, { message: 'Feedback should be less than 1000 characters' }),

    wantContribution: z
        .boolean()
        .default(false),

    skills: z
        .string()
        .optional()
        .superRefine((val, ctx) => {
            // Ensure ctx.parent is defined before accessing it
            if (ctx.parent && ctx.parent.wantContribution && (!val || val.trim() === '')) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Please share your skills for contribution',
                    path: ['skills']
                });
            }
        })
});

// Feedback form initial values
export const initialValues = {
    name: '',
    email: '',
    feedbackType: 'general',
    message: '',
    wantContribution: false,
    skills: ''
};

// Helper function to get friendly error messages
export const getFriendlyErrorMessage = (error) => {
    // Map error codes to more user-friendly messages
    const errorMap = {
        'email.invalid': "Hmm, that email doesn't look quite right. Mind checking it?",
        'message.min': "We'd love to hear more details. Could you share a bit more?",
        'message.required': "We'd really appreciate your thoughts. Mind sharing them?",
        'feedbackType.required': "Please let us know what type of feedback you're sharing.",
    };

    const errorKey = error.type ? `${error.path}.${error.type}` : error.path;
    return errorMap[errorKey] || error.message;
};

// Submit handler utilities
//eslint-disable-next-line

export const handleFormSubmission = async (values) => {
    try {
        // Get the current user (if logged in)
        const { data: { user } } = await supabaseClient.auth.getUser();

        // Prepare feedback data for database
        const feedbackData = {
            user_id: user?.id || null, // Use user ID if available, otherwise null
            name: values.name || 'Anonymous', // Ensure name is not null
            email: values.email || 'no-email@example.com', // Ensure email is not null
            feedback_type: values.feedbackType, // Match the column name in the schema
            message: values.message.substring(0, 200), // Ensure message is within 200 characters
            want_contribution: values.wantContribution, // Match the column name in the schema
            skills: values.skills || null // Ensure skills is not null
        };

        // Insert feedback into the database
        const { data, error } = await supabaseClient
            .from('feedback')
            .insert([feedbackData])
            .select();

        if (error) {
            console.error('Error saving feedback:', error);
            throw error;
        }

        return { success: true, data };

    } catch (error) {
        console.error('Error in feedback submission:', error);
        return { success: false, error: error.message || "Failed to submit feedback" };
    }
};


// Payment Validation Logic
// src/utils/feedbackValidation.jsx

export const validateCardNumber = (cardNumber) => {
    // Remove spaces and check if it's numeric and 16 digits
    const cleaned = cardNumber.replace(/\s/g, '');
    return /^\d{16}$/.test(cleaned);
};

export const validateCVC = (cvc) => {
    // Check if CVC is 3 or 4 digits
    return /^\d{3,4}$/.test(cvc);
};

export const validatePin = (pin) => {
    // Check if PIN is 4 digits
    return /^\d{4}$/.test(pin);
};

export const validateAmount = (amount) => {
    // Check if amount is a positive number
    const numAmount = Number(amount);
    return !isNaN(numAmount) && numAmount > 0;
};

export const validateExpiryDate = (expiryDate) => {
    if (!expiryDate) return false;

    // Get current date
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    // Parse expiry date (format: YYYY-MM)
    const [year, month] = expiryDate.split('-').map(num => parseInt(num, 10));

    // Check if date is valid and not expired
    return (year > currentYear || (year === currentYear && month >= currentMonth));
};

export const validatePaymentForm = (formData) => {
  //  console.log("Validating payment form data:", formData);
    const errors = {};

    if (!formData.fullName || formData.fullName.trim() === '') {
        errors.fullName = "Full name is required";
    }

    if (!formData.email || formData.email.trim() === '') {
        errors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = "Please enter a valid email address";
    }

    if (!validateCardNumber(formData.cardNumber)) {
        errors.cardNumber = "Please enter a valid 16-digit card number";
    }

    if (!validateCVC(formData.cvc)) {
        errors.cvc = "Please enter a valid 3 or 4 digit CVC";
    }

    if (!validatePin(formData.pin)) {
        errors.pin = "Please enter a valid 4-digit PIN";
    }

    if (!validateAmount(formData.amount)) {
        errors.amount = "Please enter a valid amount";
    }

    if (!validateExpiryDate(formData.expiryDate)) {
        errors.expiryDate = "Please enter a valid expiry date (must be in the future)";
    }

    const isValid = Object.keys(errors).length === 0;
//    console.log("Validation result:", isValid ? "Valid" : "Invalid", errors);

    return {
        isValid,
        errors
    };
};