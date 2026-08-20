import express from "express";
import cors from "cors";
import http from "http";

import { env } from "./src/config/env.js";
import { setupCallWebSocket } from "./src/websocket/callHandler.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Backend is working!",
  });
});

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    groqConfigured: Boolean(env.groqApiKey),
  });
});

const server = http.createServer(app);

setupCallWebSocket(server);

server.listen(env.port, () => {
  console.log(`Server running on http://localhost:${env.port}`);

  console.log(`WebSocket running on ws://localhost:${env.port}/ws`);
});

/*const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send({ message: "Backend is working!" });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});*/
