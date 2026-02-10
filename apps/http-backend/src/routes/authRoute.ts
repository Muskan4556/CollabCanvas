import express, { Router } from "express";
import { loginUser, signupUser } from "../controllers/authControllers";

const router: Router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);

export default router;
  