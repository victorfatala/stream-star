import React, { useState } from "react";
import "./Login.css";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";

const Login = () => {
  let navigate = useNavigate();

  const [signState, setSignState] = useState("Entrar");

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/");
  };

  return (
    <div className="login">
      <img src={logo} className="login-logo" onClick={() => {}} />
      <div className="login-form">
        <h1>{signState}</h1>
        <form onSubmit={(event) => handleSubmit(event)}>
          {signState === "Cadastrar" ? (
            <input type="text" placeholder="Seu nome" />
          ) : (
            <></>
          )}
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Senha" />
          <button type="submit">{signState}</button>
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
