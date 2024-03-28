import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import error from "./middlewares/error.middleware.js";
import cors from "cors"
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth.route.js";
// import userRouter from "./routes/user.route.js";

dotenv.config();
const app = express();

app.use(express.json());
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

// app.use("api/user", userRouter);
app.use("/api/auth", authRouter);

app.listen(3000, () => {
  console.log("server is running");
});


app.use(error);
