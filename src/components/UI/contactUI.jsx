//src/components/UI/contactUI.jsx
'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, User, MessageCircle, Loader2 } from 'lucide-react';
import { submitContactForm } from '@/utils/contactUtils';
import { showSuccess, showError } from '@/utils/alertManager';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ContactUI = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent double submission
    
    setIsSubmitting(true);
    try {
      await submitContactForm(formData);
      showSuccess('Message sent successfully!');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('check contactUI handle submit function:', error);
      showError('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white py-16">
      <ToastContainer />
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Contact Information */}
          <div className="bg-slate-800 rounded-xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold mb-6 text-yellow-300">Contact BandHit</h2>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Mail className="text-yellow-400 w-6 h-6" />
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <a href="mailto:support@bandhit.com" className="hover:text-yellow-300">desheye@bandhit.com</a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="text-yellow-400 w-6 h-6" />
                <div>
                  <p className="text-sm text-gray-400">Phone</p>
                  <a href="tel:+1234567890" className="hover:text-yellow-300">+(234) 8167-118379</a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <MapPin className="text-yellow-400 w-6 h-6" />
                <div>
                  <p className="text-sm text-gray-400">Address</p>
                  <p>123 Kareem Adegbite Drv - Lekki Peninsula</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form 
            onSubmit={handleSubmit} 
            className="bg-slate-800 rounded-xl p-8 shadow-2xl"
          >
            <h3 className="text-2xl font-bold mb-6 text-yellow-300">Send us a Message</h3>
            <div className="space-y-6">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400" />
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 outline-none disabled:opacity-50"
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 outline-none disabled:opacity-50"
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400" />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Your Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 outline-none disabled:opacity-50"
                />
              </div>
              <div className="relative">
                <MessageCircle className="absolute left-3 top-3 text-yellow-400" />
                <textarea
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  rows={4}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 outline-none disabled:opacity-50"
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-yellow-400 text-black py-3 rounded-lg hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUI;