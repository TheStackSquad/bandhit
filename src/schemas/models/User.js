// src/schemas/models/User.js
import mongoose from 'mongoose';
import { emailSchema } from "@/schemas/validationSchema/userSchema";


const isEmail = (email) => emailSchema.isValidSync(email);

const socialAccountSchema = new mongoose.Schema({
  provider: {
    type: String,
    required: true,
    enum: ['google', 'facebook', 'twitter', 'linkedin']
  },
  providerId: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    validate: [isEmail, 'Invalid email address']
  },
  lastUsed: {
    type: Date,
    default: Date.now
  },
  accessToken: {
    type: String,
    select: false // Won't be included in query results by default
  },
  refreshToken: {
    type: String,
    select: false
  },
  profile: {
    type: Map,
    of: String // Stores additional profile data from provider
  }
}, { _id: false }); // Prevents creation of _id for subdocuments

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name is too long'],
    index: true // Add index for faster name searches
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [isEmail, 'Invalid email address'],
    index: true // Add index for faster email searches
  },
  password: {
    type: String,
    required: function() {
      // Only required if signing up with email
      return this.socialProvider === 'email';
    },
    minlength: [8, 'Password must be at least 8 characters'],
    select: false // Won't be included in query results by default
  },
  phoneNumber: {
    type: String,
    required: function() {
      // Only required for email signup
      return this.socialProvider === 'email';
    },
    validate: {
      validator: function(v) {
        return /^[0-9]{10}$/.test(v);
      },
      message: 'Please enter a valid 10-digit phone number'
    }
  },
  isAdult: {
    type: Boolean,
    required: [true, 'Age verification is required'],
    default: false
  },
  city: {
    type: String,
    required: function() {
      // Only required for email signup
      return this.socialProvider === 'email';
    },
    trim: true
  },
  referralSource: {
    type: String,
    required: function() {
      // Only required for email signup
      return this.socialProvider === 'email';
    },
    enum: {
      values: ['newsletter', 'friend', 'internet', 'youtube', 'ads'],
      message: '{VALUE} is not a valid referral source'
    }
  },
  socialProvider: {
    type: String,
    enum: {
      values: ['email', 'google', 'facebook', 'twitter', 'linkedin'],
      message: '{VALUE} is not a supported provider'
    },
    default: 'email',
    index: true // Add index for faster provider searches
  },
  socialAccounts: [socialAccountSchema],
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active',
    index: true
  },
  lastLoginAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true // Add index for date-based queries
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt
  toJSON: { 
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes
userSchema.index({ email: 1, socialProvider: 1 });
userSchema.index({ 'socialAccounts.provider': 1, 'socialAccounts.providerId': 1 });

// Pre-save middleware
userSchema.pre('save', function(next) {
  // Update lastLoginAt when a social account is added/updated
  if (this.isModified('socialAccounts')) {
    this.lastLoginAt = new Date();
  }
  next();
});

// Instance methods
userSchema.methods.toSafeObject = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

userSchema.methods.hasSocialProvider = function(provider) {
  return this.socialAccounts.some(account => account.provider === provider);
};

// Static methods
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.findBySocialAccount = function(provider, providerId) {
  return this.findOne({
    'socialAccounts': {
      $elemMatch: {
        provider,
        providerId
      }
    }
  });
};

// Ensure model isn't registered twice
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;