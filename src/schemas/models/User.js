// src/schemas/models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name is too long']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  isAdult: {
    type: Boolean,
    required: [true, 'Age verification is required']
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  referralSource: {
    type: String,
    required: [true, 'Referral source is required'],
    enum: ['newsletter', 'friend', 'internet', 'youtube', 'ads']
  },
  socialProvider: {
    type: String,
    enum: ['email', 'google', 'facebook', 'twitter', 'instagram', 'linkedin', 'threads'],
    default: 'email'
  },
  socialAccounts: [{
    provider: String,
    providerId: String,
    email: String,
    lastUsed: Date
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.User || mongoose.model('User', userSchema);