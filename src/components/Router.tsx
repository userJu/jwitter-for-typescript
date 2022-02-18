import { HashRouter, Routes, Route } from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Profile from "../routes/Profile";
import Navigation from "./Navigation";

interface AppRouterProps {
  isLoggedIn: boolean;
  userObj: {
    uid: string;
  };
}

const AppRouter = ({ isLoggedIn, userObj }: AppRouterProps) => {
  console.log(isLoggedIn);
  return (
    <HashRouter>
      {isLoggedIn && <Navigation />}
      <Routes>
        {isLoggedIn ? (
          <>
            <Route path="/" element={<Home userObj={userObj} />} />
            <Route path="/profile" element={<Profile />} />
          </>
        ) : (
          <Route path="/" element={<Auth />} />
        )}
      </Routes>
    </HashRouter>
  );
};
export default AppRouter;
