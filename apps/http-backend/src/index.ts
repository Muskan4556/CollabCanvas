import "dotenv/config";
import express from "express";
import authRoute from "./routes/authRoute";
import roomRoute from "./routes/roomRoute";

const app = express();
app.use(express.json());

const PORT_NO = 4000;

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/room", roomRoute);

app.listen(PORT_NO);
