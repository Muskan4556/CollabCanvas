import { Router } from "express";
import { createRoom, getRoomBySlug } from "../controllers/roomController";
import { verifyToken } from "../middlewares/auth";

// const router: Router = express.Router();
const router: Router = Router();

router.post("/create", verifyToken, createRoom);
router.get("/:slug", verifyToken, getRoomBySlug);

export default router;
