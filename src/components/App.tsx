import { useEffect, useState } from "react";
import AppRouter from "./Router";
import { onAuthStateChanged } from "firebase/auth";
import { authService } from "../firebase";

interface IUserObj {
  uid?: string;
  displayName?: string;
}

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState<IUserObj>();

  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserObj({ uid: user.uid, displayName: user.displayName! });
      } else {
        setIsLoggedIn(false);
        setUserObj({ uid: undefined, displayName: undefined });
      }
      setInit(true);
    });
  }, []);
  const refreshUser = () => {
    const user = authService.currentUser;
    if (user !== null) {
      setUserObj({
        uid: user.uid,
        displayName: user.displayName || "",
      });
    }
  };

  return (
    <>
      {init ? (
        <AppRouter
          refreshUser={refreshUser}
          isLoggedIn={isLoggedIn}
          userObj={userObj!}
        />
      ) : (
        "Initializing..."
      )}
    </>
  );
}

export default App;
