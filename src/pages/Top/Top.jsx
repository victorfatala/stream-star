import React, { useEffect, useState } from "react";
import "./Top.css";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import MoviesContainer from "../../components/MoviesContainer/MoviesContainer";

const Top = () => {
  const [topMovies, setTopMovies] = useState([]);

  const fetchTopMovies = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/top_rated?language=pt-BR&page=1`,
        {
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmYWVlYzMzMmFjMTk4NjY0OTJhOTc2OGQ2YmRhZGUzNyIsIm5iZiI6MTcyNTk3Mjg2MC43MDQxODUsInN1YiI6IjY2ZDg1YTk2NWNkZjI3OWZmNTE4Mjk2NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.wYNRIXNrJZGiBvNbWG5My829ZeeLhh7kY5eOeON-7eQ",
          },
        }
      );
      setTopMovies(response.data.results || []);
    } catch (error) {
      console.error("Erro ao buscar filmes mais bem avaliados:", error);
    }
  };

  useEffect(() => {
    fetchTopMovies();
  }, []);

  return (
    <div className="top-container">
      <Navbar />
      <div className="top-hero">
        <h2>Populares</h2>
      </div>
      <MoviesContainer movies={topMovies} />
      <Footer />
    </div>
  );
};

export default Top;
