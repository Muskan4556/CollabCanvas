import { useEffect, useState } from "react";

export const useSocket = () => {
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_WEBSOCKET_URL;
    if (!url) {
      console.error(
        "Missing NEXT_PUBLIC_WEBSOCKET_URL. Check apps/web/.env and restart dev server.",
      );
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      // Don't even try to connect; ws-backend will close without a token.
      setLoading(false);
      setSocket(null);
      return;
    }

    const wsUrl = `${url}/?token=${encodeURIComponent(token)}`;
    const ws = new WebSocket(wsUrl);
    ws.onopen = () => {
      setLoading(false);
      setSocket(ws);
    };

    ws.onerror = () => {
      setLoading(false);
    };

    ws.onclose = (event) => {
      // Helpful for debugging why the server closed the connection.
      console.warn("WebSocket closed", {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean,
      });
      setSocket(null);
      setLoading(false);
    };

    return () => {
      ws.onopen = null;
      ws.onerror = null;
      ws.onclose = null;
      if (
        ws.readyState === WebSocket.CONNECTING ||
        ws.readyState === WebSocket.OPEN
      ) {
        ws.close();
      }
    };
  }, []);

  return {
    loading,
    socket,
  };
};