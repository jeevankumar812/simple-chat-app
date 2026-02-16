const amqp = require("amqplib");
const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/chatapp");

const Message = mongoose.model(
  "Message",
  new mongoose.Schema({
    sender: String,
    receiver: String,
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  })
);

async function startWorker() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue("chat_queue");

  console.log("Worker listening for messages...");

  channel.consume("chat_queue", async (msg) => {
    const data = JSON.parse(msg.content.toString());

    const newMessage = new Message(data);
    await newMessage.save();

    console.log("Message saved to DB");

    channel.ack(msg);
  });
}

startWorker();
