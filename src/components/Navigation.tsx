import React from "react";
import { Link } from "react-router-dom";

interface INavigationProps {
  userObj: { uid?: string; displayName?: string };
}

const Navigation = ({ userObj }: INavigationProps) => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/profile">{userObj.displayName} Profile</Link>
        </li>
      </ul>
    </nav>
  );
};
export default Navigation;
