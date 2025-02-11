//src/reduxStore/actions/socketActions.jsx

export const connectSocket = () => ({
  type: 'SOCKET_CONNECT', // Changed to match middleware
});

export const disconnectSocket = () => ({
  type: 'SOCKET_DISCONNECT',
});

export const sendEvent = (eventData) => ({
  type: 'SUBMIT_FORM', // Changed to match middleware
  payload: eventData,
});