// src/reduxStore/middleware/socketMiddleware.js
import { io } from 'socket.io-client';
import {
  socketConnected,
  socketDisconnected,
  socketError,
  dataUpdated
} from '@/reduxStore/reducers/socketReducers';

const socketMiddleware = () => {
  let socket = null;

  return (store) => (next) => (action) => {
    switch (action.type) {
      case 'SOCKET_CONNECT': {
        if (socket?.connected) return;

        socket = io('http://localhost:3001', {
          path: '/api/socket/io',
          transports: ['websocket'],
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 3000,
        });

        socket.on('connect', () => {
          store.dispatch(socketConnected());
        //  console.log('Socket.IO Connected ✅');
        });

        socket.on('disconnect', () => {
          store.dispatch(socketDisconnected());
        //  console.log('Socket.IO Disconnected ❌');
        });

        socket.on('connect_error', (error) => {
          store.dispatch(socketError(error.message));
          console.error('Connection Error:', error);
        });

        socket.on('dataUpdated', (data) => {
          store.dispatch(dataUpdated(data));
        });

        break;
      }

      case 'SUBMIT_FORM': {
        if (socket?.connected) {
          socket.emit('formSubmitted', action.payload);
          // Optimistically update local state if needed
          store.dispatch(dataUpdated(action.payload));
        }
        break;
      }

      case 'SOCKET_DISCONNECT': {
        if (socket) {
          socket.disconnect();
          socket = null;
        }
        break;
      }
    }

    return next(action);
  };
};

export default socketMiddleware;