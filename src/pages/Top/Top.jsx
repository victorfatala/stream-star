import React, { useEffect, useState } from "react";
import "./Top.css";
import axios from "axios";
import { auth, addFavoriteMovie, removeFavoriteMovie } from "../../firebase";
import { db, doc, getDoc } from '../../firebase';
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { FaStar } from "react-icons/fa";

const Top = () => {
  const [topMovies, setTopMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [watched, setWatched] = useState(new Set());

  const fetchTopMovies = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/top_rated?language=pt-BR&page=1`,
        {
          headers: {
            accept: "application/json",
            Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmYWVlYzMzMmFjMTk4NjY0OTJhOTc2OGQ2YmRhZGUzNyIsIm5iZiI6MTcyNTk3Mjg2MC43MDQxODUsInN1YiI6IjY2ZDg1YTk2NWNkZjI3OWZmNTE4Mjk2NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.wYNRIXNrJZGiBvNbWG5My829ZeeLhh7kY5eOeON-7eQ",
          },
        }
      );
      setTopMovies(response.data.results || []);
    } catch (error) {
      console.error("Erro ao buscar filmes mais bem avaliados:", error);
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
    fetchTopMovies();
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
    <div className="top-movies-container">
      <Navbar />
      <div className="fav-hero">
        <h2>Populares</h2>
        <div className="grid-container">
          {topMovies.length > 0 ? (
            topMovies.map((movie) => (
              <div
                className="grid-item"
                key={movie.id}
                onClick={() => handleCardClick(movie)}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                  alt={movie.original_title}
                />
                <p>{movie.original_title}</p>
                <button
                  className="favorite-button"
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
        <div className="modal-overlay">
          <div className="modal-content">
          <button
              className="favorite-button"
              onClick={() => toggleFavorite(selectedMovie)}
            >
              <FaStar
                color={favorites.has(selectedMovie.id) ? "gold" : "gray"}
                size={30}
              />
            </button>
            <span className="modal-close-button" onClick={closeModal}>
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
              className="modal-action-button"
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

export default Top;
