const express = require("express");
const { PORT } = require("./config/config");
const { setupWebSocketRoutes } = require("./routes/chart");

const app = express();
const server = app.listen(PORT, () => {
  console.log(`WebSocket Server running on ws://localhost:${PORT}`);
});

setupWebSocketRoutes(server);
