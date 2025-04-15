//src/reduxStore/actions/eventActions.jsx

import { SET_EVENTS } from "@/reduxStore/constants/actionTypes";
import { socket } from "@/context/socketContext"; // ✅ Import WebSocket instance

export const setEvents = (events) => (dispatch, getState) => {
    const currentEvents = getState().event.events;
    const newEvents = Array.isArray(events) ? events : [events];

    // Enhanced event merging logic
    const updatedEvents = newEvents.map(newEvent => {
        const existingEventIndex = currentEvents.findIndex(e => e.id === newEvent.id);

        if (existingEventIndex !== -1) {
            // Update existing event
            return {
                ...currentEvents[existingEventIndex],
                ...newEvent
            };
        }

        // Add new event
        return newEvent;
    });

    // Remove duplicates and merge
    const finalEvents = [
        ...currentEvents.filter(existingEvent =>
            !updatedEvents.some(newEvent => newEvent.id === existingEvent.id)
        ),
        ...updatedEvents
    ];

    dispatch({ type: SET_EVENTS, payload: finalEvents });

    // WebSocket emission
    if (socket?.connected) {
        socket.emit("eventsUpdated", finalEvents);
    }
};