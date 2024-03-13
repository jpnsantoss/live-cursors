import { WebSocket } from "ws";

export interface Connections {
  [key: string]: WebSocket;
}

export interface User {
  username: string;
  presence: { x: number; y: number };
}

export interface Users {
  [key: string]: User;
}
