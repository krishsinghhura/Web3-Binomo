const WebSocket = require("ws");
const { TRADERMADE_API_KEY, TRADERMADE_WS_URL } = require("../config/config");

const handleWebSocketConnection = (ws) => {
  console.log("Client connected");

  let traderMadeWs = null;

  ws.on("message", (message) => {
    try {
      const request = JSON.parse(message);

      if (request.symbols && Array.isArray(request.symbols) && request.symbols.length > 0) {
        const symbols = request.symbols.join(","); // Convert array to comma-separated string
        console.log(`Client requested symbols: ${symbols}`);

        // Close previous TraderMade connection if it exists
        if (traderMadeWs) {
          traderMadeWs.close();
          traderMadeWs = null;
        }

        // Open new WebSocket connection to TraderMade
        traderMadeWs = new WebSocket(TRADERMADE_WS_URL);

        traderMadeWs.onopen = () => {
          console.log("Connected to TraderMade WebSocket");

          const subscriptionMessage = {
            userKey: TRADERMADE_API_KEY,
            symbol: symbols, // Ensure multiple symbols are sent correctly
          };

          console.log("Sending subscription:", subscriptionMessage);
          traderMadeWs.send(JSON.stringify(subscriptionMessage));
        };

        traderMadeWs.onmessage = (message) => {
          if (typeof message.data !== "string") return; // Ensure message is a string

          try {
            const data = JSON.parse(message.data);
            console.log("Received from TraderMade:", data);

            // Ensure we only send back requested symbols
            if (data.symbol && request.symbols.includes(data.symbol)) {
              ws.send(JSON.stringify(data));
            } else {
              console.log(`Ignored symbol: ${data.symbol}, not in requested list`);
            }
          } catch (error) {
            console.warn("Received non-JSON message from TraderMade:", message.data);
          }
        };

        traderMadeWs.onerror = (error) => {
          console.error("TraderMade WebSocket Error:", error);
        };

        traderMadeWs.onclose = () => {
          console.log("TraderMade WebSocket closed");
        };
      } else {
        console.warn("Invalid request format from client:", message);
      }
    } catch (error) {
      console.error("Error parsing client message:", error);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    if (traderMadeWs) {
      traderMadeWs.close();
      traderMadeWs = null;
    }
  });
};

module.exports = { handleWebSocketConnection };
  