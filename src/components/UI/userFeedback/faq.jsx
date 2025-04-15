//src/components/UI/userFeedback/faq.jsx

'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { accordionVariants, ItemVariants, useAnimateOnScroll } from '@/components/motion/animations';
import faqData from '@/components/data/faqData'; // Import FAQ data

const FAQItem = ({ question, answer, isOpen, toggleOpen }) => {
    return (
        <motion.div
            variants={ItemVariants}
            className="mb-4 rounded-lg overflow-hidden bg-white shadow-[0_6px_15px_-3px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_25px_-5px_rgba(0,0,0,0.2)] transition-shadow duration-300"
        >
            <button
                onClick={toggleOpen}
                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-purple-300"
            >
                <h3 className="font-jetbrains text-lg text-gray-800">{question}</h3>
                <span className="text-purple-600">
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={accordionVariants}
                        className="px-6 py-4"
                    >
                        <p className="font-spaceGrotesk text-gray-600">{answer}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const FAQ = () => {
    const [openId, setOpenId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const animationProps = useAnimateOnScroll();

    const toggleQuestion = (id) => {
        setOpenId(openId === id ? null : id);
    };

    const categories = useMemo(() => {
        return ['all', ...new Set(faqData.map((faq) => faq.category))];
    }, []);

    const filteredFaqs = useMemo(() => {
        return faqData.filter((faq) => {
            const matchesSearch =
                faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, activeCategory]);

    return (
        <div className="w-full max-w-3xl mx-auto my-8 px-4" {...animationProps}> {/* Added px-4 for responsiveness */}
            <div className="mb-8">
                <h2 className="font-jetbrains text-2xl md:text-3xl text-gray-800 mb-4">
                    Frequently Asked Questions
                </h2>
             <p className="font-spaceGrotesk text-gray-600 mb-6">
    Find answers to common questions about events and tickets. If you don&apos;t see your
    question here, feel free to contact us.
</p>

                <div className="relative mb-6">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={18} className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search questions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 font-spaceGrotesk bg-white text-gray-800"
                    />
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-4 py-1 rounded-full text-sm font-jetbrains capitalize transition-colors ${activeCategory === category
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                    visible: { transition: { staggerChildren: 0.1 } },
                }}
            >
                {filteredFaqs.length > 0 ? (
                    filteredFaqs.map((faq) => (
                        <FAQItem
                            key={faq.id}
                            question={faq.question}
                            answer={faq.answer}
                            isOpen={openId === faq.id}
                            toggleOpen={() => toggleQuestion(faq.id)}
                        />
                    ))
                ) : (
                    <motion.p
                        variants={ItemVariants}
                        className="text-center font-spaceGrotesk py-8 text-gray-500"
                    >
                        No questions match your search. Try a different query or category.
                    </motion.p>
                )}
            </motion.div>
        </div>
    );
};

export default FAQ;