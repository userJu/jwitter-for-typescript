import { useState } from "react";
import AppRouter from "./Router";
import { authService } from "../firebase";

function App() {
  console.log(authService.currentUser);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return <AppRouter isLoggedIn={isLoggedIn} />;
}

export default App;
