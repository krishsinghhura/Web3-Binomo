const { WebSocketServer } = require("ws");
const express = require("express");

const PORT = 3001;
const app = express();

const server = app.listen(PORT, () => {
  console.log(`WebSocket Server running on ws://localhost:${PORT}`);
});

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("Client connected");

  // Connect to TraderMade WebSocket
  const traderMadeWs = new WebSocket(
    "wss://marketdata.tradermade.com/feedadv"
  );

  traderMadeWs.onopen = () => {
    console.log("Connected to TraderMade WebSocket");
    traderMadeWs.send(
      JSON.stringify({
        userKey: "wsCBGalemRbgd9Owzc7g",
        symbol: "EURUSD,GBPUSD,BTCUSD",
      })
    );
  };

  traderMadeWs.onmessage = (message) => {
    try {
      // Check if message is valid JSON
      const data = JSON.parse(message.data);
      console.log("Received Data:", data);

      // Send only valid data to frontend
      ws.send(JSON.stringify(data));
    } catch (error) {
      console.warn("Non-JSON message received:", message.data);
    }
  };

  traderMadeWs.onerror = (error) => {
    console.error("WebSocket Error:", error);
  };

  traderMadeWs.onclose = () => {
    console.log("TraderMade WebSocket closed");
  };

  ws.on("close", () => {
    console.log("Client disconnected");
    traderMadeWs.close();
  });
});
