// src/utils/contactUtils.jsx
import axios from 'axios';

export const submitContactForm = async (formData) => {
  try {
    const response = await axios.post('/api/contact', formData);
    return response.data;
  } catch (error) {
    throw error.response?.data || 'An error occurred';
  }
};
