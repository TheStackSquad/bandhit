// src/components/UI/eventLayout/eventsMetrics.jsx

// src/components/UI/eventLayout/eventsMetrics.jsx
import React, { useMemo, useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { Clock, TicketIcon, ThumbsUp, Calendar } from 'lucide-react';
import MetricsUtils from '@/utils/eventUtils/metricUtils';
import MetricModal from '@/components/modal/metricModal';
import { toast } from 'react-toastify';
import DateUtils from '@/components/utilsDir/dateUtils';

const EventMetricsCard = React.memo(({ event, onEditEvent }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const viewDetailsRef = useRef(null);

    const handleViewDetails = useCallback(() => {
        setIsModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        viewDetailsRef.current?.focus();
    }, []);

    const handleEditClick = useCallback(() => {
        if (onEditEvent) {
            onEditEvent(event);
            toast.info(`Editing event: ${event.event_name}`);
        } else {
            console.warn("onEditEvent prop not passed to EventMetricsCard");
            toast.warn("Edit functionality not available for this event.");
        }
    }, [event, onEditEvent]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isModalOpen) {
                handleCloseModal();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isModalOpen, handleCloseModal]);

    return (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl">
            {/* Cover Image */}
            <div className="relative w-full h-48">
                {event.cover_image ? (
                    <Image
                        src={event.cover_image}
                        alt={event.event_name}
                        fill
                        className="object-cover"
                        priority={false}
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="bg-gray-200 w-full h-full flex items-center justify-center text-gray-500">
                        No Image
                    </div>
                )}
            </div>

            {/* Event Details */}
            <div className="p-4 space-y-3">
                <h2 className="text-xl font-bold text-gray-800 truncate">
                    {event.event_name}
                </h2>

                {/* Static Metric Grid */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2 bg-blue-50 p-2 rounded-md">
                        <TicketIcon className="text-blue-600 w-5 h-5" />
                        <div>
                            <p className="text-xs text-gray-500">Ticket Sales</p>
                            <p className="font-semibold text-blue-800">—</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 bg-green-50 p-2 rounded-md">
                        <ThumbsUp className="w-5 h-5 text-green-600" />
                        <div>
                            <p className="text-xs text-gray-500">Likes</p>
                            <p className="font-semibold text-green-800">—</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 bg-yellow-50 p-2 rounded-md">
                        <Calendar className="text-yellow-600 w-5 h-5" />
                        <div>
                            <p className="text-xs text-gray-500">Date</p>
                            <p className="font-semibold text-yellow-800">
                                {DateUtils.formatDate(event.date)}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 bg-purple-50 p-2 rounded-md">
                        <Clock className="text-purple-600 w-5 h-5" />
                        <div>
                            <p className="text-xs text-gray-500">Days Left</p>
                            <p className="font-semibold text-purple-800">
                                {DateUtils.calculateDaysUntilEvent(event.date)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="flex justify-between mt-3">
                    <button
                        onClick={handleEditClick}
                        className="w-full mr-2 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Edit Event
                    </button>
                    <button
                        ref={viewDetailsRef}
                        onClick={handleViewDetails}
                        className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        aria-haspopup="dialog"
                        aria-expanded={isModalOpen}
                    >
                        View Details
                    </button>
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <MetricModal
                        event={event}
                        onClose={handleCloseModal}
                        dateUtils={DateUtils}
                    />
                )}
            </div>
        </div>
    );
});

EventMetricsCard.displayName = 'EventMetricsCard'; // Fix: Add display name for React.memo component

const EventMetricsDashboard = React.memo(({ onEditEvent }) => {
    const getUserIdFromLocalStorage = useCallback(() => {
        try {
            const persistedAuth = localStorage.getItem('persist:auth');
            if (!persistedAuth) return null;
            const parsedAuth = JSON.parse(persistedAuth);
            if (!parsedAuth.user) return null;
            return JSON.parse(parsedAuth.user)._id;
        } catch (err) {
            console.error('Failed to parse user ID:', err);
            return null;
        }
    }, []);

    const getSessionId = useCallback(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('sessionId') || 'default_session_id';
        }
        return 'server_session_id';
    }, []);

    const selectUserEvents = useMemo(() => {
        return MetricsUtils.createUserEventsSelector();
    }, []);

    const userId = useSelector((state) => {
        const localStorageUserId = getUserIdFromLocalStorage();
        return localStorageUserId || state.auth.user?.id;
    });

    const sessionId = useMemo(() => getSessionId(), [getSessionId]);

    const userEvents = useSelector((state) => {
        return selectUserEvents(state, userId);
    });

    const processedEvents = useMemo(() => {
        return [...userEvents].sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [userEvents]);

    const renderEventCards = useCallback(() => {
        return processedEvents.map((event) => (
            <EventMetricsCard
                key={event.id}
                event={event}
                onEditEvent={onEditEvent}
                userId={userId}
                sessionId={sessionId}
            />
        ));
    }, [processedEvents, onEditEvent, userId, sessionId]);

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">My Event Metrics</h1>
            {processedEvents.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                    No events found. Create your first event!
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {renderEventCards()}
                </div>
            )}
        </div>
    );
});

EventMetricsDashboard.displayName = 'EventMetricsDashboard'; // Fix: Add display name for React.memo component

export default React.memo(EventMetricsDashboard);
