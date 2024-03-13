import http from "http";
import url from "url";
import { v4 as uuidv4 } from "uuid";
import { Server as WebSocketServer } from "ws";
import { Connections, Users } from "./types";

const connections: Connections = {};
const users: Users = {};

export function setupWebSocketServer(server: http.Server) {
  const wsServer = new WebSocketServer({ server });

  wsServer.on("connection", (connection, request) => {
    const { username } = url.parse(request.url ?? "", true).query;
    const uuid = uuidv4();
    connections[uuid] = connection;

    users[uuid] = {
      username: username as string,
      presence: { x: 0, y: 0 },
    };

    connection.on("message", (message: string) => handleMessage(message, uuid));
    connection.on("close", () => handleClose(uuid));
  });
}

const broadcast = () => {
  Object.keys(connections).forEach((uuid) => {
    const connection = connections[uuid];
    const message = JSON.stringify(users);
    connection.send(message);
  });
};

const handleMessage = (bytes: string, uuid: string) => {
  let message;
  try {
    message = JSON.parse(bytes);
  } catch (error) {
    connections[uuid].send(JSON.stringify({ error: "Invalid message format" }));
    return;
  }

  const user = users[uuid];
  if (!user) {
    connections[uuid].send(JSON.stringify({ error: "User not found" }));
    return;
  }

  if (typeof message.x !== "number" || typeof message.y !== "number") {
    connections[uuid].send(
      JSON.stringify({ error: "Invalid message structure" })
    );
    return;
  }

  user.presence = message;

  broadcast();

  console.log(
    `${user.username} updated their presence to ${message.x}, ${message.y}`
  );
};

const handleClose = (uuid: string) => {
  const username = users[uuid].username;
  console.log(`${username} disconnected`);

  for (const connection of Object.values(connections)) {
    connection.send(JSON.stringify({ message: `User gone: ${username}` }));
  }

  delete connections[uuid];
  delete users[uuid];

  broadcast();
};
