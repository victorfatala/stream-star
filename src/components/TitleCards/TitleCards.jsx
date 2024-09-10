import React, { useEffect, useRef, useState } from "react";
import "./TitleCards.css";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import { auth, addFavoriteMovie, removeFavoriteMovie } from "../../firebase";
import { db, doc, getDoc } from '../../firebase';
import { Link } from "react-router-dom";

const TitleCards = ({ title, category }) => {
  const [apiData, setApiData] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [watched, setWatched] = useState(new Set());
  const cardsRef = useRef();

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmYWVlYzMzMmFjMTk4NjY0OTJhOTc2OGQ2YmRhZGUzNyIsIm5iZiI6MTcyNTk3Mjg2MC43MDQxODUsInN1YiI6IjY2ZDg1YTk2NWNkZjI3OWZmNTE4Mjk2NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.wYNRIXNrJZGiBvNbWG5My829ZeeLhh7kY5eOeON-7eQ",
    },
  };

  const handleWheel = (event) => {
    event.preventDefault();
    if (cardsRef.current) {
      cardsRef.current.scrollLeft += event.deltaY;
    }
  };

  const handleCardClick = (movie) => {
    setSelectedMovie(movie);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedMovie(null);
  };

  const toggleFavorite = async (movie) => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      try {
        if (favorites.has(movie.id)) {
          // Remove dos favoritos
          await removeFavoriteMovie(movie.id);
          setFavorites(prevFavorites => {
            const newFavorites = new Set(prevFavorites);
            newFavorites.delete(movie.id);
            return newFavorites;
          });
        } else {
          // Adiciona aos favoritos
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
    if (category === 'favorites') {
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
              setApiData(data.movies || []);
            } else {
              setFavorites(new Set());
              setApiData([]);
            }
          } catch (error) {
            console.error("Erro ao buscar favoritos:", error);
          }
        }
      };

      fetchFavorites();
    } else if (category === 'watched') {
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
              setApiData(data.movies || []);
            } else {
              setWatched(new Set());
              setApiData([]);
            }
          } catch (error) {
            console.error("Erro ao buscar filmes assistidos:", error);
          }
        }
      };

      fetchWatched();
    } else {
      fetch(
        `https://api.themoviedb.org/3/movie/${category ? category : "now_playing"}?language=pt-BR&page=1`,
        options
      )
        .then((response) => response.json())
        .then((response) => {
          setApiData(response.results || []);
        })
        .catch((err) => console.error("Erro ao buscar dados da API:", err));
    }
  }, [category]);

  useEffect(() => {
    const currentRef = cardsRef.current;
    if (currentRef) {
      currentRef.addEventListener("wheel", handleWheel);
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener("wheel", handleWheel);
      }
    };
  }, []);

  return (
    <div className="title-cards">
      <h2>{title ? title : "Destaques"}</h2>
      <div className="card-list" ref={cardsRef}>
        {apiData.length > 0 ? (
          apiData.map((card) => (
            <div
              className="card"
              key={card.id}
              onClick={() => handleCardClick(card)}
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${card.backdrop_path}`}
                alt={card.original_title}
              />
              <p>{card.original_title}</p>
              {category !== 'watched' && (
                <button
                  className="favorite-button"
                  onClick={(e) => {
                    e.stopPropagation(); 
                    toggleFavorite(card);
                  }}
                >
                  <FaStar
                    color={favorites.has(card.id) ? "gold" : "gray"}
                    size={30}
                  />
                </button>
              )}
            </div>
          ))
        ) : (
          <p>Nenhum filme aqui</p>
        )}
      </div>

      {modalVisible && selectedMovie && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="modal-close" onClick={closeModal}>
              ×
            </span>
            {category !== 'watched' && (
              <button
                className="favorite-button"
                onClick={() => toggleFavorite(selectedMovie)}
              >
                <FaStar
                  color={favorites.has(selectedMovie.id) ? "gold" : "gray"}
                  size={30}
                />
              </button>
            )}
            <h2>{selectedMovie.original_title}</h2>
            <img
              src={`https://image.tmdb.org/t/p/w500${selectedMovie.backdrop_path}`}
              alt={selectedMovie.original_title}
            />
            <p>{selectedMovie.overview}</p>
            {category !== 'watched' && (
              <Link
                to={`/player/${selectedMovie.id}`}
                className="modal-button"
                onClick={() => {
                  addToWatched(selectedMovie);
                  closeModal();
                }}
              >
                Assistir
              </Link>
            )}
            {category === 'watched' && (
              <p>Você já assistiu a este filme.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TitleCards;
