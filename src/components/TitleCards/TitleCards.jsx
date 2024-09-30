import React, { useEffect, useRef, useState } from "react";
import "./TitleCards.css";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import { auth, addFavoriteMovie, removeFavoriteMovie } from "../../firebase";
import { db, doc, getDoc } from "../../firebase";
import ModalOverlay from "../ModalOverlay/ModalOverlay";

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
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmYWVlYzMzMmFjMTk4NjY0OTJhOTc2OGQ2YmRhZGUzNyIsIm5iZiI6MTcyNTk3Mjg2MC43MDQxODUsInN1YiI6IjY2ZDg1YTk2NWNkZjI3OWZmNTE4Mjk2NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.wYNRIXNrJZGiBvNbWG5My829ZeeLhh7kY5eOeON-7eQ",
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

  useEffect(() => {
    if (category === "favorites") {
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
    } else if (category === "watched") {
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
        `https://api.themoviedb.org/3/movie/${
          category ? category : "now_playing"
        }?language=pt-BR&page=1`,
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
                alt={card.title ?? card.original_title}
              />
              <p>{card.title ?? card.original_title}</p>
            </div>
          ))
        ) : (
          <p>Nenhum filme aqui</p>
        )}
      </div>

      {modalVisible && selectedMovie && (
        <ModalOverlay
          selectedMovie={selectedMovie}
          category={category}
          setModalVisible={setModalVisible}
          modalVisible={modalVisible}
          setSelectedMovie={setSelectedMovie}
        />
      )}
    </div>
  );
};

export default TitleCards;
