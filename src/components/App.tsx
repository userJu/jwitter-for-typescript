import { useEffect, useState } from "react";
import AppRouter from "./Router";
import { onAuthStateChanged } from "firebase/auth";
import { authService } from "../firebase";

interface IUserObj {
  uid: string;
}

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState<IUserObj>();

  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserObj({ uid: user.uid });
        console.log(user);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);

  return (
    <>
      {init ? (
        <AppRouter isLoggedIn={isLoggedIn} userObj={userObj!} />
      ) : (
        "Initializing..."
      )}
    </>
  );
}

export default App;
