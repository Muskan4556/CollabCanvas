"use client";

import { useSocket } from "@/hooks/useSocket";
import { ChangeEvent, useEffect, useState } from "react";
import { Button } from "./ui/button";
import type { ChatMessage } from "@/services/api/chat";

type Props = {
  id: number;
  messages: ChatMessage[];
};

export default function ChatRoomClient({ id, messages }: Props) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(messages);
  const [currentMessage, setCurrentMessage] = useState("");
  const { loading, socket } = useSocket();

  const handleMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentMessage(e.target.value);
  };

  const handleSendMessage = () => {
    console.log("Sending message:", currentMessage);
    socket?.send(
      JSON.stringify({
        type: "chat",
        roomId: id,
        message: currentMessage,
      }),
    );
    setCurrentMessage("");
  };

  useEffect(() => {
    if (socket && !loading) {
      // now we start listening to the socket

      socket.send(
        JSON.stringify({
          type: "join_room",
          roomId: id,
        }),
      );

      // onmessage - Triggered when the server sends a message to the client.
      socket.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        if (parsedData.type === "chat") {
          const text = String(parsedData.message ?? "");
          const newMsg: ChatMessage = {
            id: `${Date.now()}-${Math.random()}`,
            text,
          };
          setChatMessages((prev) => [...prev, newMsg]);
        }
      };
    }
  }, [socket, loading, id]);

  return (
    <>
      <div className="m-4">
        {chatMessages.map((message) => {
          return <div key={message.id}>{message.text}</div>;
        })}
      </div>
      <input
        type="text"
        value={currentMessage}
        onChange={handleMessageChange}
        className="m-2 border-2 border-gray-300 rounded-md p-2"
        placeholder="Enter your message"
      />
      <Button className="cursor-pointe" onClick={handleSendMessage}>
        Send
      </Button>
    </>
  );
}
