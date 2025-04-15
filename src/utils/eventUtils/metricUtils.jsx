//src/utils/metricUtils.jsx

import { createSelector } from '@reduxjs/toolkit';

/**
 * Utility class for managing event metrics
 * Provides flexible methods for extracting and processing event-related data
 */
export class MetricsUtils {
    static getEventsFromLocalStorage() {
        try {
            const persistedData = localStorage.getItem('persist:events');
            if (!persistedData) {
         //       console.log('No events data found in localStorage');
                return [];
            }

            const parsedData = JSON.parse(persistedData);
            if (!parsedData.events) {
           //     console.log('No events key in persisted data');
                return [];
            }

            const events = JSON.parse(parsedData.events);
        //    console.log('Events extracted from localStorage:', events);
            return events;
        } catch (error) {
            console.error('Error parsing events from localStorage:', error);
            return [];
        }
    }
    static getUserEvents(state, userId) {
        // Try to get events from localStorage first
        let events = this.getEventsFromLocalStorage();

        // Fallback to Redux state if localStorage is empty
        if (events.length === 0) {
        //    console.log('Falling back to Redux state for events');
            events = state.event.events;
        }

        // Filter events by user ID
        const userEvents = events.filter(
            event => event.user_id === userId
        );

    //    console.log(`Filtered events for user ${userId}:`, userEvents);

        // Sort events chronologically (upcoming first)
        return [...userEvents].sort((a, b) =>
            new Date(a.date) - new Date(b.date)
        );
    }

    static createUserEventsSelector() {
        return createSelector(
            // Input selectors
            [(state) => {
                // Try localStorage first, then Redux state
                const localStorageEvents = MetricsUtils.getEventsFromLocalStorage();
                return localStorageEvents.length > 0 ? localStorageEvents : state.event.events;
            }, (state, userId) => userId],
            // Result selector
            (events, userId) => {
                const userEvents = events.filter(event => event.user_id === userId);
        //        console.log(`Selector: Filtered events for user ${userId}`, userEvents);
                return userEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
            }
        );
    }

    static calculateEventMetrics(event, additionalMetrics = {}) {
        // Base metrics calculation
        const baseMetrics = {
            daysUntilEvent: this.calculateDaysUntilEvent(event.date),
            formattedDate: this.formatDate(event.date),

            // Placeholder for ticket sales
            ticketSales: {
                total: 0,
                revenue: 0,
                // Provisions for future expansion
                byTicketType: {},
                salesTrend: null
            },

            // Placeholder for event engagement
            engagement: {
                likes: 0,
                views: 0,
                shares: 0
            }
        };

        // Merge with any additional metrics passed
        return {
            ...baseMetrics,
            ...additionalMetrics
        };
    }


    static calculateDaysUntilEvent(eventDate) {
        const today = new Date();
        const eventDateTime = new Date(eventDate);
        const timeDiff = eventDateTime.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return daysDiff > 0 ? daysDiff : 0;
    }

    static formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    // static extractTicketSales(state, eventId) {
    //     // TODO: Implement actual ticket sales extraction
    //     // Potential structure when implemented:
    //     // {
    //     //   total: number,
    //     //   revenue: number,
    //     //   salesByTicketType: { 
    //     //     'VIP': { count: 10, revenue: 5000 },
    //     //     'Regular': { count: 50, revenue: 2500 }
    //     //   },
    //     //   salesTrend: [
    //     //     { date: '2025-03-01', sales: 5 },
    //     //     { date: '2025-03-02', sales: 10 }
    //     //   ]
    //     // }
    //     return {
    //         total: 0,
    //         revenue: 0
    //     };
    // }

    static prepareEventMetrics(state, userId) {
        // Get user events
        const userEvents = this.getUserEvents(state, userId);

        // Calculate metrics for each event
        return userEvents.map(event => ({
            ...event,
            metrics: this.calculateEventMetrics(event, {
                ticketSales: this.extractTicketSales(state, event.id)
            })
        }));
    }
}

// Export for use in components
export default MetricsUtils;