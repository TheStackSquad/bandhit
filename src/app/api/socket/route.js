// src/app/api/socket/route.js
import { Server } from 'socket.io';

export async function GET() {
  if (!globalThis._ioServer) {
    console.log("Starting Socket.IO server...");
    
    const io = new Server({
      cors: { origin: "*" },
      path: '/api/socket/io',
      transports: ['websocket'],
    });

    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);
      
      // Handle form submissions from dashboard
      socket.on("formSubmitted", (data) => {
        // Broadcast to all clients except sender
        socket.broadcast.emit("dataUpdated", data);
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });

    globalThis._ioServer = io;
    await io.listen(3001);
  }

  return new Response(
    JSON.stringify({ message: "Socket.IO server running" }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
