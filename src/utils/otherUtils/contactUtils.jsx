// src/utils/contactUtils.jsx


// src/utils/contactUtils.jsx
import { supabaseClient } from '@/lib/supabaseClient';

export const submitContactForm = async (formData, userId) => { // Accept userId

  try {
    const { data, error } = await supabaseClient
      .from('contact_messages') // Replace with your table name
      .insert([
        {
          user_id: userId, // Include userId
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          created_at: new Date().toISOString(),
        },
      ]);

    if (error) {
      console.error('Error submitting contact form:', error);
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in submitContactForm:', error);
    throw error;
  }
};

