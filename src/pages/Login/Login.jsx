import React, { useState } from "react";
import "./Login.css";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { login, signup } from "../../firebase";
import streamstar_spinner from "../../assets/streamstar_spinner.gif";

const Login = () => {
  let navigate = useNavigate();

  const [signState, setSignState] = useState("Entrar");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const user_auth = async (event) => {
    event.preventDefault();
    setLoading(true);
    if (signState === "Entrar") {
      await login(email, password);
    } else {
      await signup(name, email, password);
    }
    setLoading(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/");
  };

  return (
    loading?<div className="login-spinner">
      <img src={streamstar_spinner} alt="" />
    </div>:
    <div className="login">
      <img src={logo} className="login-logo" onClick={() => {}} />
      <div className="login-form">
        <h1>{signState}</h1>
        <form onSubmit={(event) => handleSubmit(event)}>
          {signState === "Cadastrar" ? (
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              placeholder="Seu nome"
            />
          ) : (
            <></>
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="Senha"
          />
          <button onClick={user_auth} type="submit">
            {signState}
          </button>
          <div className="form-help">
            <div className="remember">
              <input type="checkbox" />
              <label>Lembre-se de mim</label>
            </div>
            <p>Precisa de ajuda?</p>
          </div>
        </form>
        <div className="form-switch">
          {signState === "Cadastrar" ? (
            <p>
              Já possui uma conta?
              <span
                onClick={() => {
                  setSignState("Entrar");
                }}
              >
                Entre agora
              </span>
            </p>
          ) : (
            <p>
              Novo no StreamStar?{" "}
              <span
                onClick={() => {
                  setSignState("Cadastrar");
                }}
              >
                Cadastre-se agora
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
