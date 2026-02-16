const express = require("express");
const amqp = require("amqplib");

const router = express.Router();

let channel;

// Connect to RabbitMQ
async function connectQueue() {
  const connection = await amqp.connect("amqp://localhost");
  channel = await connection.createChannel();
  await channel.assertQueue("chat_queue");
  console.log("Connected to RabbitMQ");
}

connectQueue();

// Send Message → Publish to Queue
router.post("/send", async (req, res) => {
  const messageData = req.body;

  channel.sendToQueue(
    "chat_queue",
    Buffer.from(JSON.stringify(messageData))
  );

  res.json({ message: "Message queued successfully" });
});

module.exports = router;
