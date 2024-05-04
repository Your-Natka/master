import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Server } from "socket.io";

import contactsRouter from "./routes/contactsRouter.js";
import authRouter from "./routes/authRouter.js";
dotenv.config();

const app = express();

const { NODE_MONGOOSE, PORT } = process.env;

mongoose.set("strictQuery", true);
mongoose
  .connect(NODE_MONGOOSE)
  .then(() => {
    console.log("Database connection successful.");
    console.log(`port: ${PORT}`);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/users", authRouter);
app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

const port = +process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running. Use our API on port: ${port}`);
});
const server = app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});

// SOCKET.IO ============================
const io = new Server(server);

const nodeNameSpace = io.of("/nodeNameSpace");

nodeNameSpace.on("connection", (socket) => {
  socket.on("join", (data) => {
    socket.join(data.room);

    const msg = `${data.nick ? "" : "New user "}joined ${data.room} room`;

    nodeNameSpace.in(data.room).emit("message", { msg, nick: data.nick });
  });

  socket.on("message", (data) => {
    nodeNameSpace
      .in(data.room)
      .emit("message", { msg: data.msg, nick: data.nick });
  });
});
