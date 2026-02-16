const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// ONLY MESSAGE ROUTES
app.use("/", require("./routes/message"));

const PORT = 5002;
app.listen(PORT, () => {
  console.log("Message Service running on port " + PORT);
});
