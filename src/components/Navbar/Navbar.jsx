import React, { useEffect, useRef, useState } from "react";
import "./Navbar.css";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import { auth } from "../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const Navbar = () => {
  const [navbar, setNavbar] = useState(false);
  const [user, setUser] = useState(null);
  const navRef = useRef();

  const changeBackground = () => {
    if (window.scrollY > 3) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeBackground);
    return () => {
      window.removeEventListener("scroll", changeBackground);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth).catch((error) => {
      console.error("Error during sign out:", error);
    });
  };

  const menuItems = () => {
    return (
      <ul>
        <li>
          {" "}
          {user ? (
            <Link to={`/high`}>Destaques</Link>
          ) : (
            <button>Destaques</button>
          )}
        </li>
        <li>
          {" "}
          {user ? (
            <Link to={`/you/${user.uid}`}>Recomendações para Você</Link>
          ) : (
            <button>Recomendações para Você</button>
          )}
        </li>
        <li>
          {" "}
          {user ? <Link to={`/movies`}>Filmes</Link> : <button>Filmes</button>}
        </li>
        <li>
          {" "}
          {user ? (
            <Link to={`/popular`}>Popular</Link>
          ) : (
            <button>Popular</button>
          )}
        </li>
        <li>
          {" "}
          {user ? (
            <Link to={`/favorites/${user.uid}`}>Meus Favoritos</Link>
          ) : (
            <button>Meus Favoritos</button>
          )}
        </li>
        <li>
          {user ? (
            <Link to={`/watched/${user.uid}`}>Filmes Assistidos</Link>
          ) : (
            <button>Filmes Assistidos</button>
          )}
        </li>
      </ul>
    );
  };

  return (
    <div ref={navRef} className={navbar ? "navbar active" : "navbar"}>
      <div className="navbar-left">
        <Link className="logo-link" to="/">
          <img src={logo} alt="Logo" />
        </Link>
        <div className="menu">
          <span class="material-icons">menu</span>
          <div className="menu-dropdown">{menuItems()}</div>
        </div>
        {menuItems()}
      </div>
      <div className="navbar-right">
        <button>
          <span className="material-icons">search</span>
        </button>
        <input className="search" type="text" placeholder="Pesquise algo..." />
        <p className="user">
          {user ? `${user.displayName || user.email}` : "Carregando..."}
        </p>
        <div className="navbar-profile">
          <span className="material-icons">account_circle</span>
          <span className="material-icons">arrow_drop_down</span>
          <div className="dropdown">
            <p onClick={handleLogout}>
              Desconectar-se de{" "}
              {user ? `${user.displayName || user.email}` : "Carregando..."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
