import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server as socketio } from "socket.io";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import path from "path";
import saveMessage  from "./utils/socketMessage.js"; // Import the saveMessage function

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new socketio(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

// Store connected users and their corresponding rooms
const users = {};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("Socket connected");

  // Join a room
  socket.on("subscribeToGroupMessages", ({ groupId }) => {
    socket.join(groupId);
    if (!users[groupId]) {
      users[groupId] = [];
    }
    users[groupId].push(socket.id);
  });

  // Leave a room
  socket.on("unsubscribeFromGroupMessages", ({ groupId }) => {
    socket.leave(groupId);
    if (users[groupId]) {
      users[groupId] = users[groupId].filter((userId) => userId !== socket.id);
      if (users[groupId].length === 0) {
        delete users[groupId];
      }
    }
  });

  // Send message to a room
  socket.on("sendMessage", async ({ groupId, message, userId, avatar, online, username }) => {
    io.to(groupId).emit("groupMessage", { groupId, message, userId, avatar, online, username });
    // Save the message to the database
    try {
      await saveMessage({ groupId, message, userId });
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
    // Remove user from all rooms
    Object.keys(users).forEach((groupId) => {
      users[groupId] = users[groupId].filter((userId) => userId !== socket.id);
      if (users[groupId].length === 0) {
        delete users[groupId];
      }
    });
  });
});

// Routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

// Serve static files
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "/client/dist")));

// Serve index.html for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("An error occurred:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
