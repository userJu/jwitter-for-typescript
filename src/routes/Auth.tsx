import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import { authService } from "../firebase";

interface IForm {
  email: string;
}

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newAccount) {
      await createUserWithEmailAndPassword(authService, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
        })
        .catch((error) => {
          setError(error.message);
        });
    } else {
      await signInWithEmailAndPassword(authService, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
        })
        .catch((error) => {
          setError(error.message);
        });
    }
  };

  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    console.log(e.currentTarget.name);
    const {
      currentTarget: { name, value },
    } = e;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const toogleAccount = () => {
    setNewAccount((prev) => !prev);
  };

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
      <form onSubmit={onSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          onChange={onChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          onChange={onChange}
        />
        <input
          type="submit"
          value={newAccount ? "Create Account" : "Log in"}
          required
        />
      </form>
      {error}
      <hr />
      <span onClick={toogleAccount}>
        {newAccount ? "Sign in" : "Create Account"}
      </span>
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
