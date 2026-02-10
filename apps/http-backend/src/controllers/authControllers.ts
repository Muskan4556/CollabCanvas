import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { JWT_SECRET_KEY } from "@repo/backend-common/config";
import { CreateUserSchema, LoginUserSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";

export const signupUser = async (req: Request, res: Response) => {
  try {
    const parsedData = CreateUserSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({
        message: "Invalid input data",
      });
    }

    const { username, password, name } = parsedData.data;
    console.log(process.env.DATABASE_URL);

    // db call

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prismaClient.user.create({
      data: {
        email: username,
        password: hashedPassword,
        name: name,
      },
    });
    const token = jwt.sign({ userId: user.id }, JWT_SECRET_KEY as string, {
      expiresIn: "7d",
    });

    return res.status(201).json({
      message: "User created successfully",
      userId: user.id,
      token,
    });
  } catch (err: any) {
    if (err.code === "P2002") {
      return res.status(409).json({
        message: "User already exists",
      });
    }
    return res.status(500).json({
      message: "Internal server error!!!",
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const parsedData = LoginUserSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({
        message: "Incorrect inputs",
      });
    }

    const { username, password } = parsedData.data;
    const user = await prismaClient.user.findUnique({
      where: { email: username },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
      },
      JWT_SECRET_KEY as string,
      { expiresIn: "7d" },
    );

    return res.status(200).json({
      token,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error!!!",
    });
  }
};
