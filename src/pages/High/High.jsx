import React, { useEffect, useState } from "react";
import axios from "axios";
import "./High.css";
import { auth, addFavoriteMovie, removeFavoriteMovie } from "../../firebase";
import { db, doc, getDoc } from "../../firebase";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const High = () => {
  const [highlights, setHighlights] = useState([]);
  const [selectedHighlight, setSelectedHighlight] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [watched, setWatched] = useState(new Set());

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

  const toggleFavorite = async (movie) => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      try {
        if (favorites.has(movie.id)) {
          await removeFavoriteMovie(movie.id);
          setFavorites((prevFavorites) => {
            const newFavorites = new Set(prevFavorites);
            newFavorites.delete(movie.id);
            return newFavorites;
          });
        } else {
          await addFavoriteMovie(movie);
          setFavorites((prevFavorites) => new Set(prevFavorites).add(movie.id));
        }
      } catch (error) {
        console.error("Erro ao atualizar favoritos:", error);
      }
    } else {
      console.error("Usuário não autenticado");
    }
  };

  const addToWatched = async (movieData) => {
    const userId = auth.currentUser ? auth.currentUser.uid : null;

    if (!userId) {
      console.error("Usuário não autenticado");
      return;
    }

    const { id, title } = movieData;
    const watchedAt = new Date().toISOString();

    if (!id || !title) {
      console.error("Dados do filme inválidos:", movieData);
      return;
    }

    try {
      const updatedMovieData = { ...movieData, watchedAt };
      const response = await axios.post(
        `http://localhost:5000/watched/${userId}`,
        updatedMovieData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Resposta do backend:", response.data);
    } catch (error) {
      console.error(
        "Erro ao adicionar filme aos assistidos:",
        error.response ? error.response.data : error.message
      );
    }
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      if (auth.currentUser) {
        const userId = auth.currentUser.uid;
        try {
          const docRef = doc(db, "favorites", userId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            const favoriteIds = new Set(data.movies.map((movie) => movie.id));
            setFavorites(favoriteIds);
          } else {
            setFavorites(new Set());
          }
        } catch (error) {
          console.error("Erro ao buscar favoritos:", error);
        }
      }
    };

    const fetchWatched = async () => {
      if (auth.currentUser) {
        const userId = auth.currentUser.uid;
        try {
          const docRef = doc(db, "watched", userId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            const watchedIds = new Set(data.movies.map((movie) => movie.id));
            setWatched(watchedIds);
          } else {
            setWatched(new Set());
          }
        } catch (error) {
          console.error("Erro ao buscar filmes assistidos:", error);
        }
      }
    };

    fetchFavorites();
    fetchWatched();
    fetchHighlights();
  }, []);

  const handleCardClick = (movie) => {
    setSelectedHighlight(movie);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedHighlight(null);
  };

  return (
    <div className="highlights-container">
      <Navbar />
      <div className="highlights-hero">
        <h2>Destaques</h2>
        <div className="highlights-grid-container">
          {highlights.length > 0 ? (
            highlights.map((movie) => (
              <div
                className="highlights-grid-item"
                key={movie.id}
                onClick={() => handleCardClick(movie)}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                  alt={movie.original_title}
                />
                <p>{movie.original_title}</p>
                <button
                  className="highlights-favorite-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(movie);
                  }}
                >
                  <FaStar
                    color={favorites.has(movie.id) ? "gold" : "gray"}
                    size={30}
                  />
                </button>
              </div>
            ))
          ) : (
            <p>Nenhum destaque aqui</p>
          )}
        </div>
      </div>

      {modalVisible && selectedHighlight && (
        <div className="highlights-modal-overlay">
          <div className="highlights-modal-content">
            <button
              className="highlights-favorite-button"
              onClick={() => toggleFavorite(selectedHighlight)}
            >
              <FaStar
                color={favorites.has(selectedHighlight.id) ? "gold" : "gray"}
                size={30}
              />
            </button>
            <span
              className="highlights-modal-close-button"
              onClick={closeModal}
            >
              ×
            </span>
            <h2>{selectedHighlight.original_title}</h2>
            <img
              src={`https://image.tmdb.org/t/p/w500${selectedHighlight.backdrop_path}`}
              alt={selectedHighlight.original_title}
            />
            <p>{selectedHighlight.overview}</p>
            <Link
              to={`/player/${selectedHighlight.id}`}
              className="highlights-modal-action-button"
              onClick={() => {
                addToWatched(selectedHighlight);
                closeModal();
              }}
            >
              Assistir
            </Link>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default High;
