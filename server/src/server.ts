import http from "http";
import { setupWebSocketServer } from "./websocket";

const server = http.createServer();
const port = 8000;

setupWebSocketServer(server);

server.listen(port, () => {
  console.log(`WebSocket server is running on port ${port}`);
});
