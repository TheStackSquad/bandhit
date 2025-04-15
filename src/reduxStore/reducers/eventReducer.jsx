//src/reduxStore/reducers/eventReducer.jsx

import { createSlice } from '@reduxjs/toolkit';
import { eventApi } from '@/reduxStore/api/eventsApi';


const initialState = {
  events: [],
};

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    setEvents: (state, action) => {
      const newEvents = action.payload;

      // Enhanced event merging logic
      const updatedEvents = newEvents.map(newEvent => {
        const existingEventIndex = state.events.findIndex(e => e.id === newEvent.id);

        if (existingEventIndex !== -1) {
          // Update existing event, preserving other properties if not provided
          return {
            ...state.events[existingEventIndex],
            ...newEvent
          };
        }

        // Add new event
        return newEvent;
      });

      // Remove duplicates and merge
      const finalEvents = [
        ...state.events.filter(existingEvent =>
          !updatedEvents.some(newEvent => newEvent.id === existingEvent.id)
        ),
        ...updatedEvents
      ];

      state.events = finalEvents;
    },

    // Add a specific update event reducer
    updateEvent: (state, action) => {
      const updatedEvent = action.payload;
      const eventIndex = state.events.findIndex(event => event.id === updatedEvent.id);

      if (eventIndex !== -1) {
        // Merge existing event with updated fields
        state.events[eventIndex] = {
          ...state.events[eventIndex],
          ...updatedEvent
        };
      } else {
        // If event not found, add it
        state.events.push(updatedEvent);
      }
    },

    // Add a method to remove an event
    removeEvent: (state, action) => {
      const eventIdToRemove = action.payload;
      state.events = state.events.filter(event => event.id !== eventIdToRemove);
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        eventApi.endpoints.getEvents.matchFulfilled,
        (state, { payload }) => {
    //      console.log('✅ Storing fetched events in Redux:', payload);
          state.events = payload;
        }
      )
      // Add matchers for create and update events
      .addMatcher(
        eventApi.endpoints.createEvent.matchFulfilled,
        (state, { payload }) => {
          const existingEventIndex = state.events.findIndex(e => e.id === payload.id);

          if (existingEventIndex === -1) {
            state.events.push(payload);
          }
        }
      )
      .addMatcher(
        eventApi.endpoints.updateEvent.matchFulfilled,
        (state, { payload }) => {
          const eventIndex = state.events.findIndex(event => event.id === payload.id);

          if (eventIndex !== -1) {
            state.events[eventIndex] = {
              ...state.events[eventIndex],
              ...payload
            };
          } else {
            state.events.push(payload);
          }
        }
      );
  }
});

export const { setEvents, updateEvent, removeEvent } = eventSlice.actions;
export default eventSlice.reducer;