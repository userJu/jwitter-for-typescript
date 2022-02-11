import { useNavigate } from "react-router-dom";
import { authService } from "../firebase";

function Profile() {
  const navigate = useNavigate();
  const onLogOutClick = () => {
    authService.signOut();
    navigate("/");
  };
  return (
    <>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
}

export default Profile;
