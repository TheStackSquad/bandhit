// src/schemas/models/dashboard.js
import mongoose from 'mongoose'

const EventSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  eventName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  time: {
    type: String,
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  },
  date: {
    type: Date,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  venue: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  imageUrl: {
    url: { type: String, required: true },
    publicId: { type: String },
    uploadedAt: { type: Date, default: Date.now },
  },
  ticketsSold: {
    type: Number,
    default: 0,
    min: 0
  },
  totalRevenue: {
    type: Number,
    default: 0
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Virtual to calculate potential revenue
EventSchema.virtual('potentialRevenue').get(function() {
  return this.price * this.ticketsSold
})

// Pre-save middleware for additional validations
EventSchema.pre('save', function(next) {
  if (this.date < new Date()) {
    next(new Error('Event date must be in the future'))
  }
  next()
})

export default mongoose.models.Event || mongoose.model('Event', EventSchema)