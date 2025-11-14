// src/hooks/useSocket.js
"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

let socket;

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!socket) {
      socket = io("http://localhost:4000", { withCredentials: true });
    }

    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return { socket, isConnected };
}
