import React, { useEffect, useState } from "react";
import "./Movies.css";
import axios from "axios";
import { auth, addFavoriteMovie, removeFavoriteMovie } from "../../firebase";
import { db, doc, getDoc } from '../../firebase';
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [watched, setWatched] = useState(new Set());

  const fetchMovies = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/popular?language=pt-BR&page=1`,
        {
          headers: {
            accept: "application/json",
            Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmYWVlYzMzMmFjMTk4NjY0OTJhOTc2OGQ2YmRhZGUzNyIsIm5iZiI6MTcyNjE0Mzk0NS4wMjgxMDUsInN1YiI6IjY2ZDg1YTk2NWNkZjI3OWZmNTE4Mjk2NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.KHf4DkN0bqTxHPAj7Pyz0Ljrm5I6jxIUSCPOxX54IK0",
          },
        }
      );
      setMovies(response.data.results || []);
    } catch (error) {
      console.error("Erro ao buscar filmes populares:", error);
    }
  };

  const toggleFavorite = async (movie) => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      try {
        if (favorites.has(movie.id)) {
          await removeFavoriteMovie(movie.id);
          setFavorites(prevFavorites => {
            const newFavorites = new Set(prevFavorites);
            newFavorites.delete(movie.id);
            return newFavorites;
          });
        } else {
          await addFavoriteMovie(movie);
          setFavorites(prevFavorites => new Set(prevFavorites).add(movie.id));
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
      const response = await axios.post(`http://localhost:5000/watched/${userId}`, updatedMovieData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log("Resposta do backend:", response.data);
    } catch (error) {
      console.error("Erro ao adicionar filme aos assistidos:", error.response ? error.response.data : error.message);
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
            const favoriteIds = new Set(data.movies.map(movie => movie.id));
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
            const watchedIds = new Set(data.movies.map(movie => movie.id));
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
    fetchMovies();
  }, []);

  const handleCardClick = (movie) => {
    setSelectedMovie(movie);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedMovie(null);
  };

  return (
    <div className="movies-container">
      <Navbar />
      <div className="movies-hero">
        <h2>Filmes</h2>
        <div className="movies-grid-container">
          {movies.length > 0 ? (
            movies.map((movie) => (
              <div
                className="movies-grid-item"
                key={movie.id}
                onClick={() => handleCardClick(movie)}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                  alt={movie.original_title}
                />
                <p>{movie.original_title}</p>
                <button
                  className="movies-favorite-button"
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
            <p>Nenhum filme aqui</p>
          )}
        </div>
      </div>

      {modalVisible && selectedMovie && (
        <div className="movies-modal-overlay">
          <div className="movies-modal-content">
          <button
              className="movies-favorite-button"
              onClick={() => toggleFavorite(selectedMovie)}
            >
              <FaStar
                color={favorites.has(selectedMovie.id) ? "gold" : "gray"}
                size={30}
              />
            </button>
            <span className="movies-modal-close-button" onClick={closeModal}>
              ×
            </span>
            <h2>{selectedMovie.original_title}</h2>
            <img
              src={`https://image.tmdb.org/t/p/w500${selectedMovie.backdrop_path}`}
              alt={selectedMovie.original_title}
            />
            <p>{selectedMovie.overview}</p>
            <Link
              to={`/player/${selectedMovie.id}`}
              className="movies-modal-action-button"
              onClick={() => {
                addToWatched(selectedMovie);
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

export default Movies;
