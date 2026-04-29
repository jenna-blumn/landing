"use client";

import { createContext, useContext } from "react";

export interface SocketContextValue {
  socket: SocketIOClient.Socket | null;
  openChatRoom: () => Promise<void>;
}

export const SocketContext = createContext<SocketContextValue | null>(null);

export function useSocketContext() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocketContext must be used within SocketProvider");
  }
  return context;
}
