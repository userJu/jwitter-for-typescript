import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService, db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { getAuth, updateProfile } from "firebase/auth";

interface IProfileProps {
  userObj: { uid?: string; displayName?: string };
  refreshUser: () => void;
}

function Profile({ userObj, refreshUser }: IProfileProps) {
  const navigate = useNavigate();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const { register, handleSubmit, watch } = useForm();
  const onLogOutClick = () => {
    authService.signOut();
    navigate("/");
    refreshUser();
  };
  const getMyNweets = async () => {
    const q = query(
      collection(db, "tweets"),
      where("creatorId", "==", userObj.uid)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.data());
    });
  };

  const onChange = () => {
    if (watch("newName") !== newDisplayName) {
      setNewDisplayName(watch("newName"));
    }
  };

  const onSubmit = async ({ newName }: any) => {
    console.log(newName);
    if (userObj.displayName !== newName) {
      await updateProfile(authService.currentUser!, {
        displayName: newName,
      });
      refreshUser();
    }
  };

  useEffect(() => {
    getMyNweets();
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} onChange={onChange}>
        <input
          type="text"
          {...register("newName")}
          placeholder="Display name"
          value={newDisplayName}
        />
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
}

export default Profile;
