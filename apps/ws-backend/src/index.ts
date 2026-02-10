import "dotenv/config";
import { WebSocketServer } from "ws";
import type { WebSocket } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET_KEY } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";

const PORT_NO = 8080;
const wss = new WebSocketServer({ port: PORT_NO });

interface User {
  userId: string;
  rooms: number[];
  ws: WebSocket;
}

// most basic approach for backend state management

// const users = [
//   {
//     userId: 1,
//     rooms: ["room1", "room2"],
//     ws: socket
//   },
//   {
//     userId: 2,
//     rooms: ["room1", "room2", "room3"],
//      ws: socket
//   },
//   {
//     userId: 3,
//     rooms: [],
//      ws: socket
//   },
// ];

const users: User[] = [];

const checkUser = (token: string): string | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY as string) as JwtPayload;

    if (!decoded || !decoded.userId) {
      return null;
    }

    return decoded.userId;
  } catch (err: any) {
    console.log(err);
    return null;
  }
};

wss.on("connection", (ws, request) => {
  // whenever new client connect to the web server, control will reach to this line and using this ws variable we can talk to them
  // ws - Represents ONE connected client, Every browser tab = one ws

  if (!request.url) {
    ws.close(1008, "Invalid request");
    return;
  }

  // safer URL parsing, convert - http://localhost:8080/?token=23156
  const fullUrl = new URL(request.url, `http://${request.headers.host}`);

  const token = fullUrl.searchParams.get("token");

  if (!token) {
    ws.close(1008, "Token missing");
    return;
  }

  try {
    const userId = checkUser(token);

    if (!userId) {
      ws.close(1008, "Invalid or expired token");
      return;
    }

    // now authorized

    // save global users array
    users.push({
      userId,
      rooms: [],
      ws,
    });

    // event handler
    ws.on("message", async (data) => {
      // msg comes from an end client

      const parsedData = JSON.parse(data.toString()); // {type : "join-room", roomId: 1}

      if (parsedData.type === "join_room") {
        const user = users.find((x) => x.ws === ws);
        const roomId = Number(parsedData.roomId ?? parsedData.room_id);

        if (!user || Number.isNaN(roomId)) return;

        if (!user.rooms.includes(roomId)) {
          user.rooms.push(roomId);
        }
      }

      if (parsedData.type === "leave_room") {
        const user = users.find((x) => x.ws === ws);
        const roomId = Number(parsedData.roomId ?? parsedData.room_id);

        if (!user || Number.isNaN(roomId)) return;

        user.rooms = user.rooms.filter((x) => x !== roomId);
      }

      if (parsedData.type === "chat") {
        const roomId = Number(parsedData.roomId ?? parsedData.room_id);
        const message = parsedData.message;

        if (Number.isNaN(roomId) || !message) return;

        users.forEach((user) => {
          if (user.rooms.includes(roomId)) {
            user.ws.send(
              JSON.stringify({
                type: "chat",
                message,
                roomId,
              }),
            );
          }
        });

        await prismaClient.chat.create({
          data: {
            roomId,
            message,
            userId,
          },
        });
      }
    });
  } catch {
    ws.close(1008, "Invalid or expired token");
  }
});

/*

Current approach - 
  - user can join multiple rooms(slug)
  - user can send chat to multiple rooms

  - we need a backend state management for websocket

*/

/*

Let’s listen to connections.

wss.on("connection", (ws) => {
  console.log("New client connected");
});

What is ws here?
Represents ONE connected client
Every browser tab = one ws

Events you MUST know
Event	    Meaning
connection	New client joined
message	    Client sent data
close	    Client disconnected
error	    Something broke

Send & receive messages
wss.on("connection", (ws) => {
  ws.on("message", (data) => {
    console.log("Received:", data.toString());
  });

  ws.send("Welcome to the chat!");
});

Important
Messages come as Buffer
Convert using toString()


🔁 5. Multiple clients = multiple ws

If:
3 users open chat
You get 3 ws objects

wss (server)
 ├─ ws #1 (user A)
 ├─ ws #2 (user B)
 └─ ws #3 (user C)

Server must manage them.

💬 6. Receiving messages from client
ws.on("message", (data) => {
  console.log(data);
});

Important details:
data is a Buffer

Convert to string:
data.toString()

Client sent:
socket.send("hello");

Server receives:
<Buffer 68 65 6c 6c 6f>

📤 7. Sending messages to client
ws.send("Hello from server");

This sends data only to this client.
*/
