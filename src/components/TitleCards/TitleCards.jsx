import React, { useEffect, useRef, useState } from "react";
import "./TitleCards.css";
import { Link } from "react-router-dom";
import { FaStar } from 'react-icons/fa'; 


const TitleCards = ({ title, category }) => {
  const [apiData, setApiData] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [favorites, setFavorites] = useState(new Set()); //aqui é uma const temporaria(talvez)
  const cardsRef = useRef();

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmYWVlYzMzMmFjMTk4NjY0OTJhOTc2OGQ2YmRhZGUzNyIsIm5iZiI6MTcyNTQ1NTI5OS44NDk3MTYsInN1YiI6IjY2ZDg1YTk2NWNkZjI3OWZmNTE4Mjk2NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.hhuZG-MusU4Ozh6PVLx0Zl-oKmZacdax6ocCwDzWPS4'
    }
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

  const toggleFavorite = (movie) => {
    setFavorites((prevFavorites) => {
      const newFavorites = new Set(prevFavorites);
      if (newFavorites.has(movie.id)) {
        newFavorites.delete(movie.id);
      } else {
        newFavorites.add(movie.id);
      }
      return newFavorites;
    });
  };

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${category ? category : "now_playing"}?language=pt-BR&page=1`, options)
      .then(response => response.json())
      .then(response => setApiData(response.results))
      .catch(err => console.error(err));
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
        {apiData.map((card, index) => (
          <div
            className="card"
            key={index}
            onClick={() => handleCardClick(card)}
          >
            <img src={`https://image.tmdb.org/t/p/w500${card.backdrop_path}`} alt={card.original_title} />
            <p>{card.original_title}</p>
          </div>
        ))}
      </div>

      {modalVisible && selectedMovie && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="modal-close" onClick={closeModal}>×</span>
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
            <img src={`https://image.tmdb.org/t/p/w500${selectedMovie.backdrop_path}`} alt={selectedMovie.original_title} />
            <p>{selectedMovie.overview}</p>
            <Link to={`/player/${selectedMovie.id}`} className="modal-button" onClick={closeModal}>
              Assistir
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default TitleCards;
