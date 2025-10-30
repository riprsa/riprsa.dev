import { type ReactNode } from "react";
import { WebSocketProvider } from "@/contexts/WebSocketProvider";

export function AppProvider({ children }: { children: ReactNode }) {
  return <WebSocketProvider>{children}</WebSocketProvider>;
}


