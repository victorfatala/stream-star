import React from "react";
import "./Home.css";
import Navbar from "../../components/Navbar/Navbar";
import hero_banner from "../../assets/hero_banner.jpg";
import hero_title from "../../assets/hero_title.png";
import logo from "../../assets/logo.png";
import play_icon from "../../assets/play_icon.png";
import info_icon from "../../assets/info_icon.png";
import TitleCards from "../../components/TitleCards/TitleCards";
import Footer from "../../components/Footer/Footer";

const Home = () => {
  return (
    <div className="home">
      <Navbar />
      <div className="hero">
        <img src="login-background.jpeg" alt="" className="banner-img" />
        <div className="hero-caption">
          <img src={logo} alt="" className="caption-img" />
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
            ornare, odio et commodo imperdiet, velit arcu laoreet eros, gravida
            varius libero nibh in eros. Aenean gravida mi id risus ornare, ac
            feugiat mauris lacinia.
          </p>
          <div className="hero-btns">
            <button className="btn">
              <img src={play_icon} alt="" />
              Play
            </button>
            <button className="btn dark-btn">
              <img src={info_icon} alt="" />
              More Info
            </button>
          </div>
          <TitleCards />
        </div>
      </div>
      <div className="more-cards">
        <TitleCards id="carousel-1" title={"Recomendados para você"} category={"now_playing"} />
        <TitleCards id="carousel-2" title={"Filmes"} category={"popular"} />
        <TitleCards id="carousel-3" title={"Populares"} category={"top_rated"} />
        <TitleCards id="carousel-4" title={"Meus Favoritos"} category={"favorites"} />
        <TitleCards id="carousel-5" title={"Filmes Já Assistidos"} category={"watched"} />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
