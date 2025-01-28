import mongoose from 'mongoose';

const HubSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['Vendor', 'Entertainer'], required: true },
  image: { type: String, required: true },
});

export default mongoose.models.Hub || mongoose.model('Hub', HubSchema);
