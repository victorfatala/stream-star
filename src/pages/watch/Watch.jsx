import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { db, auth } from "../../firebase";
import "./Watch.css";
import MoviesContainer from "../../components/MoviesContainer/MoviesContainer";

const Watch = () => {
  const { uid } = useParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWatchedMovies = async () => {
      try {
        if (uid) {
          if (!auth.currentUser || auth.currentUser.uid !== uid) {
            throw new Error("Usuário não autenticado ou UID incorreto.");
          }

          const userWatchedDocRef = doc(db, "watched", uid);
          const userWatchedDoc = await getDoc(userWatchedDocRef);

          if (userWatchedDoc.exists()) {
            const data = userWatchedDoc.data();
            setMovies(Array.isArray(data.movies) ? data.movies : []);
          } else {
            setMovies([]);
          }
        } else {
          console.log("UID não encontrado.");
        }
      } catch (error) {
        console.error("Erro ao buscar filmes assistidos:", error);
        setError("Erro ao buscar filmes assistidos.");
      } finally {
        setLoading(false);
      }
    };

    fetchWatchedMovies();
  }, [uid]);

  const removeMovie = async (movieId) => {
    try {
      const userWatchedDocRef = doc(db, "watched", uid);

      await updateDoc(userWatchedDocRef, {
        movies: arrayRemove(movies.find((movie) => movie.id === movieId)),
      });

      setMovies(movies.filter((movie) => movie.id !== movieId));
    } catch (error) {
      console.error("Erro ao remover filme assistido:", error);
      setError("Erro ao remover filme assistido.");
    }
  };

  if (loading) {
    return <p className="watch-loading">Carregando...</p>;
  }

  if (error) {
    return <p className="watch-error">Erro: {error}</p>;
  }

  return (
    <div className="watch-container">
      <Navbar />
      <div className="watch-hero">
          <h2>Filmes Assistidos</h2>
      </div>
      <MoviesContainer
        movies={movies}
        removeFromList={removeMovie}
        noMoviesMessage={"Nenhum filme assistido."}
        displayWatchedDate={true}
      />
      <Footer />
    </div>
  );
};

export default Watch;
