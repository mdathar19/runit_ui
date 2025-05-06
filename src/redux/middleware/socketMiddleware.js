// src/redux/middleware/socketMiddleware.js
import { io } from "socket.io-client";
import { getBaseUrl } from "../../Utils";
import { appendOutput, setSocketId } from "../slices/compilerSlice";

// Socket.io middleware for Redux
const socketMiddleware = () => {
  let socket = null;

  return store => next => action => {
    // Initialize socket connection if not already established
    if (!socket) {
      socket = io(getBaseUrl());
      
      // Set socket ID when connected
      socket.on("connect", () => {
        store.dispatch(setSocketId(socket.id));
      });
      
      // Handle delayed outputs from async code execution
      socket.on("delayed-output", (data) => {
        store.dispatch(appendOutput(data.output));
      });
      
      // Reconnect logic
      socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });
      
      socket.on("reconnect", () => {
        console.log("Socket reconnected with ID:", socket.id);
        store.dispatch(setSocketId(socket.id));
      });
    }
    
    // Special actions for socket management
    if (action.type === 'socket/connect' && !socket.connected) {
      socket.connect();
    }
    
    if (action.type === 'socket/disconnect') {
      if (socket.connected) {
        socket.disconnect();
      }
    }
    
    return next(action);
  };
};

export default socketMiddleware;