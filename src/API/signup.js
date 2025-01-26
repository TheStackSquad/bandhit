// src/API/signup.js
import axios from "axios";

export const signUp = async (values) => {
  const response = await axios.post("/api/signup", values);
//  console.log('Incoming data Regular Form:', response);
  return response.data;
};

// Social signup
export const socialSignUp = async (socialData) => {
  const response = await axios.post("/api/signup/socials", socialData);
//  console.log('Incoming data Socials Form:', response);
  return response.data;
};
