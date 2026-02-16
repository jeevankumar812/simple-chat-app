const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use(
  "/api/auth",
  createProxyMiddleware({
    target: "http://localhost:5001",
    changeOrigin: true,
    pathRewrite: {
      "^/api/auth": "/api/auth"
    }
  })
);

app.use(
  "/api/message",
  createProxyMiddleware({
    target: "http://localhost:5002",
    changeOrigin: true,
    pathRewrite: {
      "^/api/message": "/api/message"
    }
  })
);

app.listen(5000, () => {
  console.log("API Gateway running on port 5000");
});
