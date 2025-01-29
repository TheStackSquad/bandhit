//src/reduxStore/actions/eventActions.jsx

import {
    SET_EVENTS
} from '@/reduxStore/constants/actionTypes';

export const setEvents = (events) => ({
    type: SET_EVENTS,
    payload: events,
  });
  