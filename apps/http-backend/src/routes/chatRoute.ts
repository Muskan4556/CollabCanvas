import { Router } from "express";
import { getChatByRoomId } from "../controllers/chatControllers";
import { verify } from "jsonwebtoken";
import { verifyToken } from "../middlewares/auth";

const router: Router = Router();

router.get("/:roomId", verifyToken, getChatByRoomId);

export default router;
