import { Request, Response } from "express";
import { CreateRoomSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";

export const createRoom = async (req: Request, res: Response) => {
  try {
    const parsedData = CreateRoomSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({
        message: "Incorrect inputs",
      });
    }
    const { name } = parsedData.data;
    // db
    const userId = req.userId;
    const room = await prismaClient.room.create({
      data: {
        slug: name,
        adminId: userId,
      },
    });

    return res.status(200).json({
      roomId: room.id,
    });
  } catch (err: any) {
    if (err.code === "P2002") {
      return res.status(409).json({
        message: "Group already exists",
      });
    }
    return res.status(500).json({ message: "Internal server error!!!" });
  }
};

export const getRoomBySlug = async (req: Request, res: Response) => {
  const { slug } = req.params;
  try {
    const room = await prismaClient.room.findUnique({
      where: { slug: slug },
    });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    return res.status(200).json({ roomId: room.id });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error!!!" });
  }
};
