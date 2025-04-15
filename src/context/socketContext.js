// src/context/socketContext.js


import { createContext, useContext, useEffect } from 'react';
import { connectSocket, getSocket } from '@/utils/otherUtils/socketClient';
import { useDispatch } from 'react-redux';
import { CREATE_EVENT_SUCCESS } from '@/reduxStore/constants/actionTypes';

const SocketContext = createContext(null);

export const SocketProvider = ({ children, token }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const socket = connectSocket(token);

        if (socket) {
            socket.on('newEvent', (eventData) => {
                //                console.log('New Event Received:', eventData);
                dispatch({ type: CREATE_EVENT_SUCCESS, payload: eventData });
            });

            return () => {
                socket.off('newEvent');
            };
        }
    }, [token, dispatch]);

    return (
        <SocketContext.Provider value={socket}>  {/* 🔹 Provide socket instance */}
            {children}
        </SocketContext.Provider>
    );
};

// 🔹 Custom Hook to Access WebSocket
export const useSocket = () => useContext(SocketContext);

// 🔹 Export WebSocket instance directly
export const socket = getSocket();

