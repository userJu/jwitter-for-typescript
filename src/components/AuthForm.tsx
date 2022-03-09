import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { authService } from "../firebase";

const AuthForm = () => {
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
  return (
    <>
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
    </>
  );
};
export default AuthForm;
