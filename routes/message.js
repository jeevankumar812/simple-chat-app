const express = require("express");
const Message = require("../models/Message");

const router = express.Router();

// Send Message
router.post("/send", async (req, res) => {
  const { senderId, receiverId, text } = req.body;

  const message = new Message({
    sender: senderId,
    receiver: receiverId,
    text
  });

  await message.save();

  res.json({ message: "Message sent" });
});

// Get Chat Between Two Users
router.get("/:user1/:user2", async (req, res) => {
  const { user1, user2 } = req.params;

  const messages = await Message.find({
    $or: [
      { sender: user1, receiver: user2 },
      { sender: user2, receiver: user1 }
    ]
  }).sort({ createdAt: 1 });

  res.json(messages);
});

module.exports = router;
