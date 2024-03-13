export interface Presence {
  x: number;
  y: number;
}

export interface User {
  username: string;
  presence: Presence;
}

export interface Users {
  [key: string]: User;
}
