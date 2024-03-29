import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import error from "./middlewares/error.middleware.js";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server as socketio } from "socket.io";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import ChatMessage from "./model/chat.model.js";
import path from "path";

dotenv.config();
const app = express();
const server = http.createServer(app);
const __dirname = path.resolve();
const io = new socketio(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(cors());
//connecting to DB

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

// run when a client connects
io.on("connection", (socket) => {
  console.log("socket connected");
  // socket.emit("message", "Welcome to Chat app");
  socket.on("sendMessage", async (message) => {
    try {
      const responseMessage = ChatMessage({
        user: message.userId,
        message: message.message,
        groupId: message.groupId,
      });

      await responseMessage.save();
      io.emit("message", message);
    } catch (error) {
      console.log(error.message);
    }
  });
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

server.listen(3000, () => {
  console.log("server is running");
});
app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.use(error);
