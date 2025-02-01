//src/schemas/models/Cart
import mongoose from 'mongoose';

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    eventId: {  // Changed from _id to eventId to avoid conflicts with MongoDB's _id
      type: String,
      required: true,
    },
    eventName: {  // Changed from name to eventName
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    price: {
      type: Number,  // Changed from String to Number since your incoming price is numeric
      required: true,
    },
    venue: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    }
  },
  {
    timestamps: true,
  }
);

CartSchema.index({ eventId: 1, userId: 1 }, { unique: true });

export default mongoose.models.CartItems || mongoose.model('CartItems', CartSchema);