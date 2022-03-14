import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { authService } from "../firebase";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
`;
const Form = styled.form`
  width: 100%;
  justify-content: space-between;
`;

const AuthInput = styled.input`
  padding: 10px;
  margin-bottom: 10px;
  font-size: 12px;
  color: black;

  border-radius: 20px;
  margin: 5px;
  border: none;
  text-align: center;
  width: 150px;
  background: white;
  cursor: pointer;
`;

const AuthSubmit = styled.input`
  padding: 10px;
  border-radius: 30px;
  background-color: rgba(255, 255, 255, 1);
  margin-bottom: 10px;
  font-size: 12px;
  color: black;
  text-align: center;
  background: #04aaff;
  color: white;
  margin-top: 10;
  cursor: pointer;
`;

const AuthError = styled.span`
  color: tomato;
  text-align: center;
  font-weight: 500;
  font-size: 12px;
`;

const AuthSwitch = styled.span`
  color: #04aaff;
  cursor: pointer;
  margin-top: 10px;
  margin-bottom: 50px;
  display: block;
  font-size: 12px;
  text-decoration: underline;
`;

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
    <Container>
      <Form onSubmit={onSubmit}>
        <AuthInput
          name="email"
          type="email"
          placeholder="Email"
          required
          onChange={onChange}
        />
        <AuthInput
          name="password"
          type="password"
          placeholder="Password"
          required
          onChange={onChange}
        />
        <AuthSubmit
          type="submit"
          value={newAccount ? "Create Account" : "Log in"}
          required
        />
      </Form>
      {error && <AuthError>{error}</AuthError>}
      <hr style={{ width: "100%" }} />
      <AuthSwitch onClick={toogleAccount}>
        {newAccount ? "Sign in" : "Create Account"}
      </AuthSwitch>
    </Container>
  );
};
export default AuthForm;
