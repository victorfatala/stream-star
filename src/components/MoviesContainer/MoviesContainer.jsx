import { AiOutlineClose } from "react-icons/ai";
import "./MoviesContainer.css";
import ModalOverlay from "../ModalOverlay/ModalOverlay";
import { auth, addFavoriteMovie, removeFavoriteMovie } from "../../firebase";
import { db, doc, getDoc } from "../../firebase";

import { useEffect, useState } from "react";

const MoviesContainer = ({
  movies,
  removeFromList = null,
  noMoviesMessage = "Nenhum filme aqui.",
  displayWatchedDate = false,
}) => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleCardClick = (movie) => {
    setSelectedMovie(movie);
    setModalVisible(true);
  };

  return (
    <div>
      {movies.length > 0 ? (
        <div className="movies-grid-container">
          {movies.map((movie) => (
            <div
              key={movie.id}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                textAlign: "center",
              }}
            >
              <div className="movies-grid-item">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.original_title}
                  onClick={() => handleCardClick(movie)}
                />
                {removeFromList ? (
                  <div className="modal-close">
                    <AiOutlineClose
                      className="material-icons"
                      onClick={() => removeFromList(movie.id)}
                    />
                  </div>
                ) : null}
              </div>
              <p style={{ zIndex: 10 }}>
                {movie.title ?? movie.original_title}
              </p>
              {displayWatchedDate && (
                <p className="watch-card-date">
                  Assistido em:{" "}
                  {movie.watchedAt
                    ? new Date(movie.watchedAt).toLocaleDateString("pt-BR")
                    : "Data não disponível"}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-message">
          <p>Eita! Que vazio</p>
          <span
            style={{ fontSize: "4.5rem" }}
            className="material-symbols-outlined"
          >
            family_star
          </span>
          <p>{noMoviesMessage}</p>
        </div>
      )}
      {modalVisible && selectedMovie && (
        <ModalOverlay
          selectedMovie={selectedMovie}
          setModalVisible={setModalVisible}
          modalVisible={modalVisible}
          setSelectedMovie={setSelectedMovie}
        />
      )}
    </div>
  );
};

export default MoviesContainer;
