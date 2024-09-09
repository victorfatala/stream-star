import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { db, doc, getDoc, updateDoc, arrayRemove } from "../../firebase";
import { auth } from "../../firebase";
import "./Fav.css";
import { AiOutlineClose } from "react-icons/ai";

const Fav = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (auth.currentUser) {
        const userId = auth.currentUser.uid;
        const userFavoritesDocRef = doc(db, "favorites", userId);
        try {
          const userFavoritesDoc = await getDoc(userFavoritesDocRef);
          if (userFavoritesDoc.exists()) {
            const data = userFavoritesDoc.data();
            setMovies(data.movies || []);
          } else {
            setMovies([]);
          }
        } catch (error) {
          console.error("Erro ao buscar favoritos:", error.message);
          setError("Erro ao buscar favoritos.");
        } finally {
          setLoading(false);
        }
      } else {
        setMovies([]);
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [auth.currentUser]);

  const removeFavorite = async (movieId) => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      const userFavoritesDocRef = doc(db, "favorites", userId);
      try {
        await updateDoc(userFavoritesDocRef, {
          movies: arrayRemove(movies.find((movie) => movie.id === movieId)),
        });
        setMovies(movies.filter((movie) => movie.id !== movieId));
      } catch (error) {
        console.error("Erro ao remover favorito:", error.message);
        setError("Erro ao remover favorito.");
      }
    }
  };

  if (loading) {
    return <p className="fav-loading">Carregando...</p>;
  }

  if (error) {
    return <p className="fav-error">Erro: {error}</p>;
  }

  return (
    <div className="fav">
      <Navbar />
      <div className="fav-hero">
        <div className="fav-hero-caption">
          <h2>Favoritos</h2>
        </div>
        <div className="fav-cards-container">
          {movies.length > 0 ? (
            movies.map((movie) => (
              <div key={movie.id} className="fav-card">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="fav-card-img"
                />
                <p className="fav-card-title">
                  {movie.title || "Título não disponível"}
                </p>
                <button
                  className="fav-remove-btn"
                  onClick={() => removeFavorite(movie.id)}
                >
                  <AiOutlineClose />
                </button>
              </div>
            ))
          ) : (
            <p>Nenhum favorito encontrado.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Fav;
