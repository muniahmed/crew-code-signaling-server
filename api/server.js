const WebSocket = require("ws");
const http = require("http");

const server = http.createServer((req, res) => {
  // Health check endpoint
  if (req.url === "/health" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Health check OK");
  } else {
    // Default response for other routes
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Signaling server is running");
  }
});

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("A new client connected");

  ws.on("message", (message) => {
    try {
      const parsedMessage = JSON.parse(message);
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(parsedMessage));
        }
      });
    } catch (e) {
      console.error("Invalid message format:", message);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
