//src/components/ui/userFeedback/feedback.jsx

'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MessageSquare, Bug, Lightbulb, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { ButtonVariants, ItemVariants, useAnimateOnScroll } from '@/components/motion/animations';
import { feedbackSchema, initialValues, handleFormSubmission } from '@/utils/otherUtils/feedbackValidation';
import { useCharacterCount, formatCharacterCount } from '@/utils/otherUtils/useCharacterCount';



const FeedbackForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const animationProps = useAnimateOnScroll();

    const { register, handleSubmit, formState: { errors }, watch, control, reset } = useForm({
        resolver: zodResolver(feedbackSchema),
        defaultValues: initialValues
    });

    const wantContribution = watch('wantContribution');
    const feedbackType = watch('feedbackType');

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const result = await handleFormSubmission(data);
            //    console.log('whats in the data:', result);

            if (result.success) {
                setIsSubmitted(true);
                reset();
                // Reset form after showing success message for a moment
                setTimeout(() => {
                    setIsSubmitted(false);
                }, 5000);
            } else {
                setSubmitError(result.error || "Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Feedback submission error:", error);
            setSubmitError("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getFeedbackIcon = () => {
        switch (feedbackType) {
            case 'bug':
                return <Bug className="text-red-500" size={20} />;
            case 'feature':
                return <Lightbulb className="text-yellow-500" size={20} />;
            default:
                return <MessageSquare className="text-blue-500" size={20} />;
        }
    };

    const MAX_MESSAGE_LENGTH = 300;
    const SKILLS_MESSAGE_LENGTH = 200;

    // Watch the message field for character counting
    const messageValue = useWatch({
        control,
        name: 'message',
        defaultValue: ''
    });

    // Watch the skills field for character counting
    const skillsValue = useWatch({
        control,
        name: 'skills',
        defaultValue: ''
    });
    // Only destructure what you actually use
    const {
        count: messageCount,
        colorClass: messageColorClass
    } = useCharacterCount(
        messageValue,
        MAX_MESSAGE_LENGTH
    );

    // Only destructure what you actually use
    const {
        count: skillsCount,
        colorClass: skillsColorClass
    } = useCharacterCount(
        skillsValue,
        SKILLS_MESSAGE_LENGTH
    );

    return (
        <div className="w-full max-w-3xl mx-auto my-8 rounded-lg p-6 shadow-md dark:shadow-lg border border-gray-200 dark:border-gray-700" {...animationProps}>
            <motion.div
                variants={ItemVariants}
                className=" rounded-lg shadow-[0_4px_14px_0_rgba(0,0,0,0.08)] p-6 md:p-8"
            >
                <h2 className="font-jetbrains text-2xl md:text-3xl text-gray-800 dark:text-gray-200 mb-4">Share Your Feedback</h2>
                <p className="font-spaceGrotesk text-gray-600 dark:text-gray-200 mb-6">
                    We&apos;d love to hear your thoughts on bandhit. Your feedback helps us improve and grow.
                    Whether you have suggestions, found a bug, or want to contribute, we&apos;re all ears!
                </p>

                {isSubmitted ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-green-50 border border-green-200 rounded-lg p-6 text-center"
                    >
                        <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
                        <h3 className="font-jetbrains text-xl text-green-700 mb-2">Thank You!</h3>
                        <p className="font-spaceGrotesk text-green-600  dark:text-gray-200">
                            Your feedback has been submitted successfully. We appreciate your contribution to making the_introspection better!
                        </p>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block font-jetbrains text-sm text-gray-700 dark:text-gray-200 mb-1">
                                    Your Name (Optional)
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    {...register('name')}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-600 font-spaceGrotesk bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                                    placeholder="Jane Smith"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-500 font-spaceGrotesk">{errors.name.message}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="email" className="block font-jetbrains text-sm text-gray-700 dark:text-gray-200 mb-1">
                                    Your Email {wantContribution && <span className="text-red-500">*</span>}
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    {...register('email')}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-600 font-spaceGrotesk bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                                    placeholder="jane@example.com"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-500 font-spaceGrotesk">{errors.email.message}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="feedbackType" className="block font-jetbrains text-sm text-gray-700 dark:text-gray-200 mb-1">
                                Feedback Type <span className="text-red-500">*</span>
                            </label>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <label className={`flex items-center p-3 border rounded-md cursor-pointer
                                    transition-colors
                                    ${feedbackType === 'general' ? 'bg-gray-400 border-yellow-800' : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                                    <input type="radio" value="general" {...register('feedbackType')} className="sr-only" />
                                    <MessageSquare size={18} className="text-purple-500 dark:text-yellow-400 mr-2" />
                                    <span className="font-spaceGrotesk text-black dark:text-gray-300">General Feedback</span>
                                </label>

                                <label className={`flex items-center p-3 border rounded-md cursor-pointer
                                        transition-colors 
                                        ${feedbackType === 'bug' ? 'bg-gray-400 border-yellow-800' : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                                    <input type="radio" value="bug" {...register('feedbackType')} className="sr-only" />
                                    <Bug size={18} className="text-purple-500 dark:text-yellow-400 mr-2" />
                                    <span className="font-spaceGrotesk text-black dark:text-gray-300">Bug Report</span>
                                </label>

                                <label className={`flex items-center p-3 border rounded-md cursor-pointer
                                        transition-colors
                                        ${feedbackType === 'feature' ? ' bg-gray-400 border-yellow-800' : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                                    <input type="radio" value="feature" {...register('feedbackType')} className="sr-only" />
                                    <Lightbulb size={18} className="text-purple-500 dark:text-yellow-400 mr-2" />
                                    <span className="font-spaceGrotesk text-black dark:text-gray-300">Feature Request</span>
                                </label>
                            </div>
                            {errors.feedbackType && (
                                <p className="mt-1 text-sm text-red-500 font-spaceGrotesk">{errors.feedbackType.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="message" className="block font-jetbrains text-sm text-gray-700 dark:text-gray-200 mb-1">
                                Your Feedback <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute top-3 left-3">
                                    {getFeedbackIcon()}
                                </span>
                                <textarea
                                    id="message"
                                    {...register('message')}
                                    rows={5}
                                    className={`w-full pl-10 pr-4 py-2 border ${errors.message
                                        ? 'border-red-300 dark:border-red-700'
                                        : 'border-gray-300 dark:border-gray-700'
                                        } rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 
                        dark:focus:ring-purple-600 font-spaceGrotesk bg-white dark:bg-gray-800 
                        text-gray-800 dark:text-gray-100`}
                                    placeholder="Tell us what you think..."
                                />

                                {/* Character counter */}
                                <div className={`flex justify-end mt-1 text-xs ${messageColorClass}`}>
                                    <span>
                                        {formatCharacterCount(messageCount, MAX_MESSAGE_LENGTH)}
                                    </span>
                                </div>
                            </div>
                            {errors.message && (
                                <p className="mt-1 text-sm text-red-500 font-spaceGrotesk">{errors.message.message}</p>
                            )}
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                            <label className="flex items-start cursor-pointer">
                                <input
                                    type="checkbox"
                                    {...register('wantContribution')}
                                    className="mt-1 h-4 w-4 text-purple-600 dark:text-purple-400 focus:ring-purple-500 dark:focus:ring-yellow-600 border-gray-300 dark:border-gray-700 rounded"
                                />
                                <span className="ml-2 font-spaceGrotesk text-gray-700 dark:text-gray-300">
                                    I&apos;d like to contribute to the_introspection as a developer
                                </span>
                            </label>

                            {wantContribution && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="mt-4"
                                >
                                    <label htmlFor="skills" className="block font-jetbrains text-sm text-gray-700 dark:text-gray-200 mb-1">
                                        Your Skills <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        id="skills"
                                        {...register('skills')}
                                        rows={3}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-600 font-spaceGrotesk bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                                        placeholder="Tell us about your skills and how you'd like to contribute..."
                                    />
                                    <div className={`flex justify-end mt-1 text-xs ${skillsColorClass}`}>
                                        <span>
                                            {formatCharacterCount(skillsCount, SKILLS_MESSAGE_LENGTH)}
                                        </span>
                                    </div>
                                    {errors.skills && (
                                        <p className="mt-1 text-sm text-red-500 font-spaceGrotesk">{errors.skills.message}</p>
                                    )}
                                </motion.div>
                            )}
                        </div>


                        {submitError && (
                            <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-md p-3 flex items-center">
                                <AlertCircle size={18} className="text-red-500 dark:text-red-400 mr-2" />
                                <p className="font-spaceGrotesk text-red-700 dark:text-red-300">{submitError}</p>
                            </div>
                        )}

                        <motion.button
                            type="submit"
                            disabled={isSubmitting}
                            variants={ButtonVariants}
                            initial="idle"
                            whileHover="hover"
                            whileTap="tap"
                            className="w-full sm:w-auto bg-purple-600 dark:bg-transparent dark:text-yellow-400 text-white dark:border dark:border-yellow-400 font-jetbrains py-3 px-6 rounded-md shadow-sm flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white dark:text-black"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send size={18} className="mr-2 dark:text-yellow-400" />
                                    Submit Feedback
                                </>
                            )}
                        </motion.button>
                    </form>
                )}
            </motion.div>
        </div>
    );
};

export default FeedbackForm;