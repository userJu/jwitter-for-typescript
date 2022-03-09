import React, { useState } from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import { authService } from "../firebase";
import AuthForm from "../components/AuthForm";

interface IForm {
  email: string;
}

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
          const token = credential?.accessToken;
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
    <div>
      <AuthForm />
      <div>
        <button onClick={onSocialClick} name="Google">
          Continue with Google
        </button>
        <button onClick={onSocialClick} name="Github">
          Continue with Github
        </button>
      </div>
    </div>
  );
}

export default Auth;
