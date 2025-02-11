// src/reduxStore/reducers/socketReducers.jsx
import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
  name: "socket",
  initialState: {
    isConnected: false,
    error: null,
    lastUpdate: null,
  },
  reducers: {
    socketConnected: (state) => {
      state.isConnected = true;
      state.error = null;
    },
    socketDisconnected: (state) => {
      state.isConnected = false;
    },
    socketError: (state, action) => {
      state.error = action.payload;
      state.isConnected = false;
    },
    dataUpdated: (state, action) => {
      state.lastUpdate = action.payload;
    },
  },
});

// ✅ Correct Export of Actions
export const { socketConnected, socketDisconnected, socketError, dataUpdated } =
  socketSlice.actions;

// ✅ Correct Export of Reducer
export default socketSlice.reducer;
