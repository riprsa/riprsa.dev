import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  type ReactNode,
} from "react";
import { api } from "@/api";
import type { ResponseMessage, RequestMessage } from "@riprsa.dev/backend";
import { showSuccess } from "@/utils/alert_manager";

export type ConnectionStatus =
  | "connected"
  | "connecting"
  | "retry"
  | "error"
  | "disconnected";

interface WebSocketContextValue {
  dataStatus: ConnectionStatus;
}

const WebSocketContext = createContext<WebSocketContextValue | undefined>(
  undefined
);

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within WebSocketProvider");
  }
  return context;
}

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const [dataStatus, setDataStatus] =
    useState<ConnectionStatus>("disconnected");

  const dataWsRef = useRef<ReturnType<typeof api.websocket.subscribe> | null>(
    null
  );
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);

  const clearReconnectTimeout = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  };

  const scheduleReconnect = () => {
    clearReconnectTimeout();
    setDataStatus("retry");

    reconnectAttemptsRef.current += 1;
    console.log(`Data reconnect #${reconnectAttemptsRef.current}`);

    reconnectTimeoutRef.current = setTimeout(() => {
      connectDataStream();
    }, 1000);
  };

  const connectDataStream = () => {
    setDataStatus("connecting");
    clearReconnectTimeout();

    if (dataWsRef.current) {
      dataWsRef.current.close();
    }

    const ws = api.websocket.subscribe();
    dataWsRef.current = ws;

    ws.on("open", () => {
      setDataStatus("connected");
      reconnectAttemptsRef.current = 0;

      if (reconnectAttemptsRef.current === 0) {
        showSuccess("Data stream connected successfully");
      } else {
        console.log(
          `Data stream reconnected after ${reconnectAttemptsRef.current} attempts`
        );
      }
    });

    ws.on("close", () => {
      setDataStatus("disconnected");
      scheduleReconnect();
    });

    ws.on("error", (error) => {
      setDataStatus("error");
      console.error("Data stream connection error:", error);
      scheduleReconnect();
    });

    ws.on("message", (message) => {
      const data = message.data;
      console.log(data);
    });
  };

  useEffect(() => {
    connectDataStream();

    return () => {
      clearReconnectTimeout();
      if (dataWsRef.current) {
        dataWsRef.current.close();
        dataWsRef.current = null;
      }
    };
  }, []);

  return (
    <WebSocketContext.Provider
      value={{
        dataStatus,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}
