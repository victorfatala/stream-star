import React, { useEffect, useState } from "react";
import axios from "axios";
import "./High.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import MoviesContainer from "../../components/MoviesContainer/MoviesContainer";

const High = () => {
  const [highlights, setHighlights] = useState([]);

  const fetchHighlights = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/now_playing?language=pt-BR&page=1`,
        {
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmYWVlYzMzMmFjMTk4NjY0OTJhOTc2OGQ2YmRhZGUzNyIsIm5iZiI6MTcyNTk3Mjg2MC43MDQxODUsInN1YiI6IjY2ZDg1YTk2NWNkZjI3OWZmNTE4Mjk2NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.wYNRIXNrJZGiBvNbWG5My829ZeeLhh7kY5eOeON-7eQ", // Substitua pelo seu token de API
          },
        }
      );
      setHighlights(response.data.results || []);
    } catch (error) {
      console.error("Erro ao buscar destaques:", error);
    }
  };

  useEffect(() => {
    fetchHighlights();
  }, []);

  return (
    <div className="highlights-container">
      <Navbar />
      <div className="highlights-hero">
        <h2>Destaques</h2>
      </div>
      <MoviesContainer movies={highlights} />
      <Footer />
    </div>
  );
};

export default High;
