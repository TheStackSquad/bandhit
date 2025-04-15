

// src/reduxStore/middleware/socketMiddleware.js
import { CREATE_EVENT_SUCCESS } from '@/reduxStore/constants/actionTypes';
import { getSocket } from '@/utils/otherUtils/socketClient';

const socketMiddleware = (store) => (next) => (action) => {
  const socket = getSocket();

  if (socket) {
    socket.on('newEvent', (eventData) => {
      //  console.log('New event received via WebSocket:', eventData);
      store.dispatch({ type: CREATE_EVENT_SUCCESS, payload: eventData });
    });
  }

  return next(action);
};

export default socketMiddleware;
