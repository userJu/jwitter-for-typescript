import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService, db } from "../firebase";
import { useForm } from "react-hook-form";
import { updateProfile } from "firebase/auth";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
`;
const ProfileForm = styled.form`
  border-bottom: 1px solid rgba(255, 255, 255, 0.9);
  padding-bottom: 30px;
  width: 100%;
  display: flex;
  flex-direction: column;
`;
const FormInput = styled.input`
  width: 100%;
  padding: 10px 20px;
  border-radius: 20px;
  border: 1px solid black;
  text-align: center;
  background-color: white;
  color: black;
`;
const FormBtn = styled.input`
  cursor: pointer;
  width: 100%;
  padding: 7px 20px;
  text-align: center;
  color: white;
  border-radius: 20px;
  background-color: #04aaff;
  cursor: pointer;
`;
const LogoutBtn = styled.span`
  margin-top: 20px;
  width: 100%;
  padding: 7px 20px;
  text-align: center;
  color: white;
  border-radius: 20px;
  background-color: tomato;
  cursor: pointer;
`;

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

  const onChange = () => {
    if (watch("newName") !== newDisplayName) {
      setNewDisplayName(watch("newName"));
    }
  };

  const onSubmit = async ({ newName }: any) => {
    if (userObj.displayName !== newName) {
      await updateProfile(authService.currentUser!, {
        displayName: newName,
      });
      refreshUser();
    }
  };

  return (
    <Container>
      <ProfileForm onSubmit={handleSubmit(onSubmit)} onChange={onChange}>
        <FormInput
          type="text"
          {...register("newName")}
          placeholder="Display name"
          value={newDisplayName}
          autoFocus
        />
        <FormBtn
          type="submit"
          value="Update Profile"
          style={{
            marginTop: 10,
          }}
        />
      </ProfileForm>
      <LogoutBtn onClick={onLogOutClick}>Log Out</LogoutBtn>
    </Container>
  );
}

export default Profile;
