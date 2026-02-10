import { Router } from "express";
import { createRoom } from "../controllers/roomController";
import { verifyToken } from "../middlewares/auth";

// const router: Router = express.Router();
const router: Router = Router();

router.post("/create", verifyToken, createRoom);

export default router;
