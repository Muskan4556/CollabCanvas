import axios from "axios";

export const getRoomBySlug = async (slug: string) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!baseUrl) throw new Error("NEXT_PUBLIC_BACKEND_URL");
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token not found");

    const response = await axios.get(`${baseUrl}/api/v1/room/${slug}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.roomId as number;
  } catch (error) {
    console.error("Error fetching room by slug:", error);
    throw error;
  }
};
