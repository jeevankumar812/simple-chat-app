const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// ONLY AUTH ROUTES
app.use("/", require("./routes/auth"));

const PORT = 5001;
app.listen(PORT, () => {
  console.log("User Service running on port " + PORT);
});
