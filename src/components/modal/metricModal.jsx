// src/components/modal/metricModal.jsx

// src/components/modal/metricModal.jsx
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useGetEventMetricQuery } from '@/reduxStore/api/eventMetricsApi';

const MetricModal = ({ event, onClose, dateUtils }) => {
    const modalRef = useRef(null);
    const closeButtonRef = useRef(null);

    // Fetch metrics for this specific event
    const { data: eventMetric, isLoading } = useGetEventMetricQuery(event.id);

    // Extract values with fallbacks
    const totalLikes = eventMetric?.metrics?.totalLikes || 0;
    const totalTicketsSold = eventMetric?.metrics?.totalTicketsSold || 0;
    const totalRevenue = eventMetric?.metrics?.totalRevenue || 0;

    // Focus trap and accessibility
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }

            // Trap focus within modal
            if (e.key === 'Tab') {
                if (!modalRef.current) return;

                const focusableElements = modalRef.current.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );

                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey && document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        };

        // Focus the close button when modal opens
        closeButtonRef.current?.focus();

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    if (!event) return null;

    return (
        <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="fixed inset-0 z-50 overflow-y-auto"
        >
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                aria-hidden="true"
            />

            {/* Modal container */}
            <div className="flex items-center justify-center min-h-screen p-4 sm:p-0">
                <div className="relative bg-white rounded-xl overflow-hidden shadow-xl transform transition-all w-full max-w-2xl max-h-[90vh] flex flex-col">
                    {/* Modal Header */}
                    <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-10">
                        <h2
                            id="modal-title"
                            className="text-xl font-bold text-gray-800"
                        >
                            {event.event_name}
                        </h2>
                        <button
                            ref={closeButtonRef}
                            onClick={onClose}
                            className="p-1 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label="Close modal"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Modal Content */}
                    <div className="p-6 space-y-6 overflow-y-auto">
                        {/* Cover Image */}
                        <div className="relative w-full h-64 rounded-lg overflow-hidden">
                            {event.cover_image ? (
                                <Image
                                    src={event.cover_image}
                                    alt={`Cover for ${event.event_name}`}
                                    fill // This makes the image cover its parent (same as absolute with inset-0)
                                    className="object-cover w-full h-full"
                                />

                            ) : (
                                <div className="bg-gray-200 w-full h-full flex items-center justify-center text-gray-500">
                                    No Image
                                </div>
                            )}
                        </div>

                        {/* Detailed Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Event Info Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800">Event Information</h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-500">Date</p>
                                        <p className="font-medium">
                                            {dateUtils.formatDate(event.date)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Time</p>
                                        <p className="font-medium">{event.time || 'Not specified'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Venue</p>
                                        <p className="font-medium">{event.venue || 'Not specified'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Price</p>
                                        <p className="font-medium">{event.price ? `$${event.price}` : 'Free'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Metrics Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800">Event Metrics</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-500">Ticket Sales</p>
                                        <p className="text-2xl font-bold text-blue-800">
                                            {isLoading ? '...' : totalTicketsSold}
                                        </p>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-500">Likes</p>
                                        <p className="text-2xl font-bold text-green-800">
                                            {isLoading ? '...' : totalLikes}
                                        </p>
                                    </div>
                                    <div className="bg-yellow-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-500">Capacity</p>
                                        <p className="text-2xl font-bold text-yellow-800">{event.capacity || '0'}</p>
                                    </div>
                                    <div className="bg-purple-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-500">Days Left</p>
                                        <p className="text-2xl font-bold text-purple-800">
                                            {dateUtils.calculateDaysUntilEvent(event.date)}
                                        </p>
                                    </div>
                                </div>

                                {/* Revenue Information (if applicable) */}
                                {totalRevenue > 0 && (
                                    <div className="bg-indigo-50 p-4 rounded-lg mt-4">
                                        <p className="text-sm text-gray-500">Total Revenue</p>
                                        <p className="text-2xl font-bold text-indigo-800">
                                            ${totalRevenue.toFixed(2)}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description (if available) */}
                        {event.description && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                                <p className="text-gray-600">{event.description}</p>
                            </div>
                        )}
                    </div>

                    {/* Modal Footer */}
                    <div className="sticky bottom-0 bg-white p-4 border-t flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MetricModal;