import React from "react";
import "./Home.css";
import Navbar from "../../components/Navbar/Navbar";
import logo from "../../assets/logo.png";
import info_icon from "../../assets/info_icon.png";
import TitleCards from "../../components/TitleCards/TitleCards";
import Footer from "../../components/Footer/Footer";
import git_icon from "../../assets/github-brands-solid.svg";
import pix_icon from "../../assets/pix-brands-solid.svg";

const Home = () => {
  return (
    <div className="home">
      <Navbar />
      <div className="hero">
        <img src="login-background.jpeg" alt="" className="banner-img" />
        <div className="hero-caption">
          <img src={logo} alt="" className="caption-img" />
          <p>
            Stream Star é um site de streaming de filmes e séries que oferece
            uma vasta biblioteca de conteúdo audiovisual para os amantes de
            cinema e TV. Com uma interface intuitiva e fácil de usar, o Stream
            Star permite aos usuários explorar e assistir a uma ampla variedade
            de filmes, desde os mais recentes lançamentos até clássicos
            atemporais, além de séries de TV populares e exclusivas.
          </p>
          <div className="hero-btns">
            <button className="btn">
            <img src={git_icon}/>
              Github
            </button>
            <button className="btn dark-btn">
              <img src={pix_icon}/>
              Apoiar
            </button>
          </div>
          <TitleCards />
        </div>
      </div>
      <div className="more-cards">
        <TitleCards id="carousel-2" title={"Filmes"} category={"popular"} />
        <TitleCards
          id="carousel-3"
          title={"Populares"}
          category={"top_rated"}
        />
        <TitleCards
          id="carousel-4"
          title={"Meus Favoritos"}
          category={"favorites"}
        />
        <TitleCards
          id="carousel-5"
          title={"Filmes Já Assistidos"}
          category={"watched"}
        />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
