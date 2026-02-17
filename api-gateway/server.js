const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const authMiddleware = require("./middleware/auth");

const app = express();

/* AUTH ROUTES (NO TOKEN REQUIRED) */
app.use(
  "/api/auth",
  createProxyMiddleware({
    target: "http://localhost:5001",
    changeOrigin: true
  })
);

/* MESSAGE ROUTES (TOKEN REQUIRED) */
app.use(
  "/api/message",
  authMiddleware,
  createProxyMiddleware({
    target: "http://localhost:5002",
    changeOrigin: true
  })
);

app.listen(5000, () => {
  console.log("API Gateway running on port 5000");
});
