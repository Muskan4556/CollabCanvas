import { Router } from "express";
import { getChatByRoomId } from "../controllers/chatControllers";

const router: Router = Router();

router.get("/:roomId", getChatByRoomId);

export default router;
