// src/app/support/SupportClient.jsx
"use client"; // Mark this file as a client component

import React from 'react';
import dynamic from 'next/dynamic';
import { useInView } from 'react-intersection-observer';

const FAQ = dynamic(() => import('@/components/UI/userFeedback/faq'), { ssr: false });
const FeedbackForm = dynamic(() => import('@/components/UI/userFeedback/feedback'), { ssr: false });

const SupportClient = () => {
    const { ref: faqRef, inView: faqInView } = useInView({
        triggerOnce: false,
        threshold: 0.1,
    });
    const { ref: formRef, inView: formInView } = useInView({
        triggerOnce: false,
        threshold: 0.1,
    });

    return (
        <div className="min-h-screen py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <section ref={faqRef} className="mb-12">
                    <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
                        Frequently Asked Questions
                    </h1>
                    {faqInView && <FAQ />}
                </section>

                <section ref={formRef} className="mb-12">
                    <h2 className="text-3xl font-semibold text-center mb-8 text-gray-700">
                        Feedback & Support
                    </h2>
                    <p className="text-center text-gray-600 mb-8">
                        We value your feedback. Please let us know how we can improve.
                    </p>
                    {formInView && <FeedbackForm />}
                </section>

                <section className="text-center text-gray-500 py-8">
                    <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
                </section>
            </div>
        </div>
    );
};

export default SupportClient;