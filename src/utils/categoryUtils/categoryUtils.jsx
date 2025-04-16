import { newsletterValidationSchema } from '@/schemas/validationSchema/newsletterValidation';
import { showError } from '@/lib/alertManager';

export const handleNewsletterSignup = async (email) => {
    // Validate email format
    try {
        await newsletterValidationSchema.validate({ email });
    } catch (err) {
        showError(err.message);
        throw new Error(err.message);
    }

    // Check for existing email
    const checkResponse = await fetch('/api/category', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });

    if (!checkResponse.ok) {
        throw new Error('Failed to verify email');
    }

    const { exists } = await checkResponse.json();
    if (exists) {
        throw new Error('This email is already subscribed');
    }

    // Proceed with signup
    const response = await fetch('/api/category/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Subscription failed');
    }

    return await response.json();
};
