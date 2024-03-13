import throttle from "lodash.throttle";
import { useEffect, useRef } from "react";
import useWebSocket from "react-use-websocket";
import { Cursor } from "./components/Cursor";
import { Users } from "./types";

const WS_URL = "ws://127.0.0.1:8000";

interface HomeProps {
  username: string;
}

const renderCursors = (users: Users) => {
  return Object.keys(users).map((uuid) => {
    const user = users[uuid];
    return <Cursor key={uuid} point={[user.presence.x, user.presence.y]} />;
  });
};

const renderUsersList = (users: Users) => {
  return (
    <ul>
      {Object.keys(users).map((uuid) => {
        const user = users[uuid];
        return <li key={uuid}>{JSON.stringify(user)}</li>;
      })}
    </ul>
  );
};

export const Home = ({ username }: HomeProps) => {
  const { sendJsonMessage, lastJsonMessage } = useWebSocket(WS_URL, {
    queryParams: { username },
  });

  const THROTTLE = 50; // 50ms
  const sendJsonMessageThrottled = useRef(throttle(sendJsonMessage, THROTTLE));

  useEffect(() => {
    // ask the server to send state
    sendJsonMessage({ x: 0, y: 0 });
    window.addEventListener("mousemove", (e) => {
      sendJsonMessageThrottled.current({ x: e.clientX, y: e.clientY });
    });

    return () => {
      window.removeEventListener("mousemove", () => {});
    };
  }, []);

  if (lastJsonMessage) {
    return (
      <>
        {renderCursors(lastJsonMessage as Users)}
        {renderUsersList(lastJsonMessage as Users)}
      </>
    );
  }
  return <h1>Welcome, {username}</h1>;
};
