const { WebSocketServer } = require("ws");
const { handleWebSocketConnection } = require("../controllers/websocketController");

const setupWebSocketRoutes = (server) => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    handleWebSocketConnection(ws);
  });

  console.log("WebSocket Routes Initialized");
};

module.exports = { setupWebSocketRoutes };
