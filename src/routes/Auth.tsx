import React, { useState } from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import { authService } from "../firebase";
import AuthForm from "../components/AuthForm";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faGoogle,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";

const Container = styled.div`
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: center;
  align-items: center;
`;
const AuthBtns = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 320px;
  button {
    cursor: pointer;
    border-radius: 20px;
    border: none;
    padding: 10px 0px;
    font-size: 12px;
    text-align: center;
    width: 150px;
    background: white;
  }
`;

function Auth() {
  const onSocialClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const {
      currentTarget: { name },
    } = event;
    console.log(name);

    if (name === "Google") {
      const provider = new GoogleAuthProvider();
      signInWithPopup(authService, provider)
        .then((result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const user = result.user;
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          const email = error.email;
          const credential = GoogleAuthProvider.credentialFromError(error);
        });
    } else if (name === "Github") {
      const provider = new GithubAuthProvider();
      signInWithPopup(authService, provider)
        .then((result) => {
          const credential = GithubAuthProvider.credentialFromResult(result);
          const token = credential?.accessToken;
          const user = result.user;
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          const email = error.email;
          const credential = GithubAuthProvider.credentialFromError(error);
        });
    }
  };

  return (
    <Container>
      <FontAwesomeIcon
        icon={faTwitter}
        color={"#04AAFF"}
        size="3x"
        style={{ marginBottom: 30 }}
      />
      <AuthForm />
      <AuthBtns>
        <button onClick={onSocialClick} name="Google">
          Continue with Google
          <FontAwesomeIcon icon={faGoogle} />
        </button>
        <button onClick={onSocialClick} name="Github">
          Continue with Github
          <FontAwesomeIcon icon={faGithub} />
        </button>
      </AuthBtns>
    </Container>
  );
}

export default Auth;
