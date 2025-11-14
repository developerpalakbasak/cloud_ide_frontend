// src/utils/socket.js
import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_BACKEND_SOCKET_URL, {
  withCredentials: true,
  autoConnect: false, // prevent auto connection
});


export default socket;
