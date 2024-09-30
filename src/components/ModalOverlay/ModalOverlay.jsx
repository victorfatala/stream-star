import FavoriteButton from "../FavoriteButton/FavoriteButton";
import "./ModalOverlay.css";
import { Link } from "react-router-dom";
import { auth, addFavoriteMovie, removeFavoriteMovie } from "../../firebase";
import { db, doc, getDoc } from "../../firebase";
import axios from "axios";
import { useEffect, useState } from "react";

const ModalOverlay = ({
  selectedMovie,
  category = "",
  setModalVisible,
  modalVisible,
  setSelectedMovie,
}) => {
  const [favorites, setFavorites] = useState(new Set());
  const [watched, setWatched] = useState(new Set());

  const closeModal = () => {
    setModalVisible(false);
    setSelectedMovie(null);
  };

  useEffect(() => {
    if (modalVisible) {
      document.body.style.overflowY = "clip"; // Disable scrolling
    } else {
      document.body.style.overflowY = "auto"; // Re-enable scrolling
    }
    return () => {
      document.body.style.overflowY = "auto";
    };
  }, [modalVisible]);

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
  }, []);

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

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-close">
          <span class="material-icons" onClick={closeModal}>
            close
          </span>
        </div>

        <h2>{selectedMovie.title ?? selectedMovie.original_title}</h2>
        <img
          src={`https://image.tmdb.org/t/p/w500${selectedMovie.backdrop_path}`}
          alt={selectedMovie.original_title}
        />
        <div className="overview-container">
          <p>{selectedMovie.overview}</p>
        </div>
        <div className="play-and-star-container">
          <Link
            to={`/player/${selectedMovie.id}`}
            onClick={() => {
              addToWatched(selectedMovie);
              closeModal();
            }}
          >
            <button className="modal-button">
              <div className="modal-button-container">
                <span class="material-icons">play_arrow</span>
                Assistir
              </div>
            </button>
          </Link>
          <FavoriteButton
            toggleFavorite={toggleFavorite}
            selectedMovie={selectedMovie}
            favorites={favorites}
          />
        </div>
        {category === "watched" && (
          <p
            style={{
              fontSize: "0.8rem",
              marginTop: "10px",
              fontStyle: "italic",
            }}
          >
            Você já assistiu a este filme.
          </p>
        )}
      </div>
    </div>
  );
};

export default ModalOverlay;
