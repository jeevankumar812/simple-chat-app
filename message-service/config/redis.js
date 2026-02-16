const redis = require("redis");

const client = redis.createClient();

client.on("connect", () => {
  console.log("Redis Connected (Message Service)");
});

client.on("error", (err) => {
  console.log("Redis Error", err);
});

client.connect();

module.exports = client;
