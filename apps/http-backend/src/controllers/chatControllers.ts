import { prismaClient } from "@repo/db/client";
import { Request, Response } from "express";

export const getChatByRoomId = async (req: Request, res: Response) => {
  const roomId = Number(req.params.roomId);

  try {
    const messages = await prismaClient.chat.findMany({
      where: { roomId: roomId },
      orderBy: {
        id: "desc",
      },
      take: 50,
    });

    return res.status(200).json({
      messages,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error!!!",
    });
  }
};
