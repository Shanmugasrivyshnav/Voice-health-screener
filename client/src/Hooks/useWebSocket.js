import { useCallback, useRef, useState } from "react";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:5000/ws";

export function useWebSocket(onEvent) {
  const [connected, setConnected] = useState(false);
  const wsRef = useRef(null);

  const connect = useCallback(() => {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        setConnected(true);
        wsRef.current = ws;
        resolve(ws);
      };

      ws.onmessage = (msg) => {
        try {
          const payload = JSON.parse(msg.data);
          onEvent?.(payload);
        } catch (err) {
          console.error("Failed to parse WS message", err);
        }
      };

      ws.onerror = (err) => {
        console.error("WebSocket error", err);
        reject(err);
      };

      ws.onclose = () => {
        setConnected(false);
        wsRef.current = null;
      };
    });
  }, [onEvent]);

  const send = useCallback((event, data = {}) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          event,
          ...data,
        }),
      );
    } else {
      console.warn("Tried to send while socket is not open:", event);
    }
  }, []);

  const disconnect = useCallback(() => {
    wsRef.current?.close();
    wsRef.current = null;
    setConnected(false);
  }, []);

  return {
    connect,
    send,
    disconnect,
    connected,
  };
}
