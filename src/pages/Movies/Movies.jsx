import React, { useEffect, useState } from "react";
import "./Movies.css";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import MoviesContainer from "../../components/MoviesContainer/MoviesContainer";

const Movies = () => {
  const [movies, setMovies] = useState([]);

  const fetchMovies = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/popular?language=pt-BR&page=1`,
        {
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmYWVlYzMzMmFjMTk4NjY0OTJhOTc2OGQ2YmRhZGUzNyIsIm5iZiI6MTcyNjE0Mzk0NS4wMjgxMDUsInN1YiI6IjY2ZDg1YTk2NWNkZjI3OWZmNTE4Mjk2NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.KHf4DkN0bqTxHPAj7Pyz0Ljrm5I6jxIUSCPOxX54IK0",
          },
        }
      );
      setMovies(response.data.results || []);
    } catch (error) {
      console.error("Erro ao buscar filmes populares:", error);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className="movies-container">
      <Navbar />
      <div className="movies-hero">
        <h2>Filmes</h2>
      </div>
      <MoviesContainer movies={movies} />
      <Footer />
    </div>
  );
};

export default Movies;
