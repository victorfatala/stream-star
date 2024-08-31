import React, { useEffect, useState } from "react";
import "./Navbar.css";
import logo from "../../assets/logo.png";
import search_icon from "../../assets/search_icon.svg";
import bell_icon from "../../assets/bell_icon.svg";
import profile_img from "../../assets/profile_img.png";
import caret_icon from "../../assets/caret_icon.svg";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [navbar, setNavbar] = useState(false);

  const changeBackground = () => {
    console.log(window.scrollY);
    if (window.scrollY > 3) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeBackground);
  }, [window.scrollY]);

  return (
    <div className={navbar ? "navbar active" : "navbar"}>
      <div className="navbar-left">
        <img src={logo} alt="" />
        <ul>
          <button>Destaques</button>
          <li>
            <button>Recomendados para você</button>
          </li>
          <li>
            <button>Filmes</button>
          </li>
          <li>
            <button>Novo e Popular</button>
          </li>
          <li>
            <button>Meus Favoritos</button>
          </li>
          <li>
            <button>Filmes já assistidos</button>
          </li>
        </ul>
      </div>
      <div className="navbar-right">
        <button>
          <span class="material-icons">search</span>
        </button>
        <p className="user">NOME DO USUARIO</p>
        <div className="navbar-profile">
          <span className="material-icons">account_circle</span>

          <span class="material-icons">arrow_drop_down</span>

          <div className="dropdown">
            <p>
              <Link to="/login">Desconectar-se de StreamStar?</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
