// src/API/signup.js
import axios from "axios";

export const signUp = async (values) => {
  const response = await axios.post("/api/signup", values);
//  console.log('Incoming data Regular Form:', response);
  return response.data;
};

// Social signup

export const socialSignUp = async (socialData) => {
 // console.log('Social Signup Request:', socialData);
  
  try {
    const response = await axios.post("/api/signup/socials", socialData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
   // console.log('Social Signup Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Social Signup Error:', error.response?.data || error.message);
    throw error;
  }
};