// src/components/welcomeLayout/footer.jsx
'use client';

import { useState } from 'react';
import { FaInstagram, FaTwitter, FaFacebook, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(true);

  const handleNewsletterSignup = () => {
    if (validateEmail(email)) {
      // Submit email logic (e.g., API call)
    //  console.log('Email submitted:', email);
      setIsModalOpen(false); // Close modal after submission
      setEmail(''); // Reset email input
    } else {
      setIsValid(false); // Show validation error
    }
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Attendees Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Attendees</h3>
            <ul className="space-y-2">
              <li><a href="/events" className="hover:text-gray-400">Find Tickets</a></li>
              <li><a href="/categories" className="hover:text-gray-400">Event Categories</a></li>
              <li><a href="/support" className="hover:text-gray-400">FAQ</a></li>
              <li><a href="/contact" className="hover:text-gray-400">Contact Us</a></li>
            </ul>
          </div>

          {/* Vendors/Entertainers Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Vendors & Entertainers</h3>
            <ul className="space-y-2">
              <li><a href="/create_profile" className="hover:text-gray-400">Create Profile</a></li>
              <li><a href="/pricing" className="hover:text-gray-400">Pricing Plans</a></li>
              <li><a href="/dashboard" className="hover:text-gray-400">Dashboard</a></li>
              <li><a href="/support" className="hover:text-gray-400">Support</a></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li>Email: support@bandhit.com</li>
              <li>Phone: +1 (123) 456-7890</li>
              <li>Address: 123 Event St, City, Country</li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h3 className="text-lg font-bold mb-4">Newsletter</h3>
            <p className="mb-4">Subscribe for event updates and deals.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Subscribe
            </button>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="flex justify-center space-x-6 mb-8">
          <a href="https://instagram.com" className="hover:text-gray-400">
            <FaInstagram size={24} />
          </a>
          <a href="https://twitter.com" className="hover:text-gray-400">
            <FaTwitter size={24} />
          </a>
          <a href="https://facebook.com" className="hover:text-gray-400">
            <FaFacebook size={24} />
          </a>
          <a href="https://linkedin.com" className="hover:text-gray-400">
            <FaLinkedin size={24} />
          </a>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-400">
          &copy; {new Date().getFullYear()} Bandhit. All rights reserved.
        </div>
      </div>

      {/* Newsletter Signup Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg text-gray-800 w-11/12 max-w-md">
            <h3 className="text-xl font-bold mb-4">Subscribe to Our Newsletter</h3>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setIsValid(true); // Reset validation on input change
              }}
              className={`w-full px-4 py-2 mb-4 border rounded-lg ${
                !isValid ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {!isValid && (
              <p className="text-red-500 text-sm mb-4">Please enter a valid email address.</p>
            )}
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleNewsletterSignup}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;