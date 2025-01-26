"use client";

import { useState } from 'react';
import { CreditCard } from 'lucide-react';
import Image from 'next/image';
import { useFormik } from 'formik';
import paymentSchema from '@/schemas/validationSchema/paymentSchema';

export default function PaymentUI() {
  const [paymentMethod, setPaymentMethod] = useState('card');

  const formik = useFormik({
    initialValues: {
      email: '',
      cardNumber: '',
      cardHolder: '',
      expiryDate: '',
      cvv: '',
    },
    validationSchema: paymentSchema,
    validateOnChange: true,
    //eslint-disable-next-line
    onSubmit: (values) => {
      // Handle form submission
 //     console.log('Form Submitted', values);
    },
  });

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    formik.setFieldValue('paymentMethod', method);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Payment Details</h1>

          {/* Payment Method Selector */}
          <div className="flex gap-4 mb-8">
            {['card', 'paypal', 'googlepay'].map((method) => (
              <button
                key={method}
                onClick={() => handlePaymentMethodChange(method)}
                className={`flex-1 p-4 rounded-lg border-2 transition-all
                  ${paymentMethod === method 
                    ? 'border-blue-600 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <div className="flex justify-center items-center h-8">
                  {method === 'card' && <CreditCard className="w-8 h-8" />}
                  {method === 'paypal' && (
                    <Image
                      src="/paypal-logo.png"
                      alt="PayPal"
                      width={80}
                      height={32}
                      className="object-contain"
                    />
                  )}
                  {method === 'googlepay' && (
                    <Image
                      src="/googlepay-logo.png"
                      alt="Google Pay"
                      width={80}
                      height={32}
                      className="object-contain"
                    />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Payment Form */}
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Common Fields */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                className={`w-full px-4 py-2 border ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                placeholder="your@email.com"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
              )}
            </div>

            {/* Card-specific Fields */}
            {paymentMethod === 'card' && (
              <>
                {/* Card Number */}
                <div>
                  <label
                    htmlFor="cardNumber"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Card Number
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={formik.values.cardNumber}
                    onChange={formik.handleChange}
                    maxLength="19"
                    className={`w-full px-4 py-2 border ${formik.touched.cardNumber && formik.errors.cardNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                    placeholder="1234 5678 9012 3456"
                  />
                  {formik.touched.cardNumber && formik.errors.cardNumber && (
                    <p className="text-red-500 text-sm mt-1">{formik.errors.cardNumber}</p>
                  )}
                </div>

                {/* Other Card Fields */}
                {/* Similar updates for cardHolder, expiryDate, cvv */}
              </>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-lg bg-blue-600 text-white text-lg font-medium"
              disabled={!formik.isValid}
            >
              {`Pay ₦${45.00}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
