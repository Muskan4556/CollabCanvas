import { z } from "zod";

export const CreateUserSchema = z.object({
  username: z.string().min(5).max(20),
  password: z.string().min(6),
  name: z.string().min(1),
});

export const LoginUserSchema = z.object({
  username: z.string().min(5).max(20),
  password: z.string(),
});

export const CreateRoomSchema = z.object({
  name: z.string().min(5).max(20),
});
