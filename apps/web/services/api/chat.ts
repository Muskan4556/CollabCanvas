import axios from "axios";

export type ChatMessage = {
  id: string;
  text: string;
};

type ChatMessageDto = {
  id: number;
  roomId: number;
  message: string;
  userId: string;
};

export const getChatByRoomId = async (roomId: number) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!baseUrl) throw new Error("NEXT_PUBLIC_BACKEND_URL");
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token not found");

    const response = await axios.get(`${baseUrl}/api/v1/chats/${roomId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const messages = (response.data.messages ?? []) as ChatMessageDto[];
    return messages.map((m) => ({
      id: String(m.id),
      text: m.message,
    }));
  } catch (error) {
    console.error("Error fetching chat by room id:", error);
    throw error;
  }
};
