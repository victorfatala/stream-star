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
  const cardsRef = useRef();

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmYWVlYzMzMmFjMTk4NjY0OTJhOTc2OGQ2YmRhZGUzNyIsIm5iZiI6MTcyNTYyNzI1OS41MzcxMjMsInN1YiI6IjY2ZDg1YTk2NWNkZjI3OWZmNTE4Mjk2NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.TyMdGsePzq9XOQkcd6SbNZ0V64FqoiGAduYIl-gn5TA",
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
          setFavorites((prevFavorites) => {
            const newFavorites = new Set(prevFavorites);
            newFavorites.delete(movie.id);
            return newFavorites;
          });
        } else {
          // Adiciona aos favoritos
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
      console.log("Enviando dados para o backend:", updatedMovieData);
      const response = await axios.post(`http://localhost:5000/watched/${userId}`, updatedMovieData);
      console.log("Resposta do backend:", response.data);
    } catch (error) {
      console.error("Erro ao adicionar filme aos assistidos:", error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/${category ? category : "now_playing"}?language=pt-BR&page=1`,
      options
    )
      .then((response) => response.json())
      .then((response) => {
        console.log("Dados da API recebidos:", response);
        setApiData(response.results || []);
      })
      .catch((err) => console.error("Erro ao buscar dados da API:", err));
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

  useEffect(() => {
    if (auth.currentUser) {
      const fetchFavorites = async () => {
        const userId = auth.currentUser.uid;
        try {
          const docRef = doc(db, "favorites", userId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.movies) {
              const favoriteIds = new Set(data.movies.map(movie => movie.id));
              setFavorites(favoriteIds);
            }
          }
        } catch (error) {
          console.error("Erro ao buscar favoritos:", error);
        }
      };

      fetchFavorites();
    }
  }, [auth.currentUser]);

  return (
    <div className="title-cards">
      <h2>{title ? title : "Destaques"}</h2>
      <div className="card-list" ref={cardsRef}>
        {apiData.map((card) => (
          <div
            className="card"
            key={card.id} // Use `card.id` como chave única
            onClick={() => handleCardClick(card)}
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${card.backdrop_path}`}
              alt={card.original_title}
            />
            <p>{card.original_title}</p>
            <button
              className="favorite-button"
              onClick={(e) => {
                e.stopPropagation(); // Evita que o clique no botão também abra o modal
                toggleFavorite(card);
              }}
            >
              <FaStar
                color={favorites.has(card.id) ? "gold" : "gray"}
                size={30}
              />
            </button>
          </div>
        ))}
      </div>

      {modalVisible && selectedMovie && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="modal-close" onClick={closeModal}>
              ×
            </span>
            <button
              className="favorite-button"
              onClick={() => toggleFavorite(selectedMovie)}
            >
              <FaStar
                color={favorites.has(selectedMovie.id) ? "gold" : "gray"}
                size={30}
              />
            </button>
            <h2>{selectedMovie.original_title}</h2>
            <img
              src={`https://image.tmdb.org/t/p/w500${selectedMovie.backdrop_path}`}
              alt={selectedMovie.original_title}
            />
            <p>{selectedMovie.overview}</p>
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
          </div>
        </div>
      )}
    </div>
  );
};

export default TitleCards;
