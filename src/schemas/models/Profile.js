// schemas/profileSchema.js
export const profileSchema = {
    name: { type: 'string', required: true },
    email: { type: 'string', required: true },
    category: { type: 'string', required: true },
    description: { type: 'string' },
    services: { type: 'array' },
    verificationStatus: { 
      type: 'string', 
      enum: ['pending', 'verified', 'rejected'] 
    },
    contactInfo: {
      phone: { type: 'string' },
      whatsapp: { type: 'string' }
    },
    portfolio: {
      images: { type: 'array' },
      featuredImage: { type: 'string' }
    }
  };