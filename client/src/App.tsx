import { useState } from "react";
import { Home } from "./Home";
import { Login } from "./components/Login";

function App() {
  const [username, setUsername] = useState("");
  return !username ? (
    <Login onSubmit={setUsername} />
  ) : (
    <Home username={username} />
  );
}

export default App;
