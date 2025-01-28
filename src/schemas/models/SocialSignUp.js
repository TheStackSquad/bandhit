// src/schemas/models/socialSignUp.js
import mongoose from 'mongoose';

const SocialSignUpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  socialAccounts: {
    google: {
      id: String,
      email: String,
    },
    facebook: {
      id: String,
      email: String,
    },
    linkedin: {
      id: String,
      email: String,
    },
    twitter: {
      id: String,
      email: String,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Create model or retrieve existing
const SocialSignUp = mongoose.models.SocialSignUp || mongoose.model('SocialSignUp', SocialSignUpSchema);

export default SocialSignUp;
