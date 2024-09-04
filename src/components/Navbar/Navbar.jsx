import React, { useEffect, useRef, useState } from "react";
import "./Navbar.css";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [navbar, setNavbar] = useState(false);
  const navRef = useRef();

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

  useEffect(() =>{
    window.addEventListener('scroll', ()=>{
      if(window.screenY >= 80){
        navRef.current.classList.add('nav-dark')
      }else{
        navRef.current.classList.remove('nav-dark')
      }
    })
  }, [])
  

  return (
    <div ref={navRef} className={navbar ? "navbar active" : "navbar"}>
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
        <input class="search" type="text" placeholder="Pesquise algo..."/>

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
