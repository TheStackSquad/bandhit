//src/utils/session.js

// utils/session.js
export const getOrCreateSessionId = () => {
    if (typeof window === 'undefined') return '';

    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
};

// utils/[localStorageEvents].js
export const getEventsFromLocalStorage = () => {
    if (typeof window === 'undefined') return [];

    const persistData = localStorage.getItem('persist:events');
    if (!persistData) return [];

    try {
        const parsed = JSON.parse(persistData);
        const events = JSON.parse(parsed.events);
        return Array.isArray(events) ? events : [];
    } catch (error) {
        console.error('Error parsing events from localStorage:', error);
        return [];
    }
};