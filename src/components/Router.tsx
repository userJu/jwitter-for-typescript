import React, { useState } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";

interface AppRouterProps {
  isLoggedIn: boolean;
}

const AppRouter = ({ isLoggedIn }: AppRouterProps) => {
  console.log(isLoggedIn);
  return (
    <HashRouter>
      <Routes>
        {isLoggedIn ? (
          <Route path="/" element={<Home />} />
        ) : (
          <Route path="/" element={<Auth />} />
        )}
      </Routes>
    </HashRouter>
  );
};
export default AppRouter;
