import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoute from "./routes/authRoute";
import roomRoute from "./routes/roomRoute";
import chatRoute from "./routes/chatRoute";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

const PORT_NO = 4000;

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/room", roomRoute);
app.use("/api/v1/chats", chatRoute);

app.listen(PORT_NO);
