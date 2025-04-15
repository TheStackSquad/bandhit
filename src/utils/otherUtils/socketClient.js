// src/utils/socketClient.js
import io from 'socket.io-client';

const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000";

let socket;

export const connectSocket = (token) => {
    if (!socket) {
        socket = io(SOCKET_SERVER_URL, {
            auth: { token }, // Pass token for authentication if needed
        });

        socket.on('connect', () => {
  //          console.log('Connected to WebSocket server');
        });

        socket.on('disconnect', () => {
//            console.log('Disconnected from WebSocket server');
        });
    }
    return socket;
};

export const getSocket = () => socket;
