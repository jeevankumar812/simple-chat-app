const express = require("express");
const amqp = require("amqplib");
const mongoose = require("mongoose");
const redisClient = require("../config/redis");
const Message = require("../models/Message");

const router = express.Router();

let channel;

/* ---------------- CONNECT RABBITMQ ---------------- */

async function connectQueue() {
  const connection = await amqp.connect("amqp://localhost");
  channel = await connection.createChannel();
  await channel.assertQueue("chat_queue");
  console.log("Connected to RabbitMQ");
}

connectQueue();

/* ---------------- SEND MESSAGE ---------------- */

router.post("/send", async (req, res) => {
  const messageData = req.body;

  channel.sendToQueue(
    "chat_queue",
    Buffer.from(JSON.stringify(messageData))
  );

  res.json({ message: "Message queued successfully" });
});

/* ---------------- FETCH CHAT (WITH REDIS CACHE) ---------------- */

router.get("/:u1/:u2", async (req, res) => {
  const { u1, u2 } = req.params;

  const cacheKey = `chat:${u1}:${u2}`;

  // 1️⃣ Check Redis
  const cachedData = await redisClient.get(cacheKey);
  if (cachedData) {
    console.log("Serving from Redis Cache");
    return res.json(JSON.parse(cachedData));
  }

  // 2️⃣ Fetch from MongoDB
  const messages = await Message.find({
    $or: [
      { sender: u1, receiver: u2 },
      { sender: u2, receiver: u1 }
    ]
  }).sort({ createdAt: 1 });

  // 3️⃣ Store in Redis
  await redisClient.set(cacheKey, JSON.stringify(messages), {
    EX: 60   // Cache expires in 60 seconds
  });

  console.log("Serving from MongoDB and cached in Redis");

  res.json(messages);
});

module.exports = router;
