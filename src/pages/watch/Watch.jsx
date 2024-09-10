import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import './Watch.css';
import { AiOutlineClose } from "react-icons/ai";

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
            throw new Error('Usuário não autenticado ou UID incorreto.');
          }
  
          const userWatchedDocRef = doc(db, 'watched', uid);
          const userWatchedDoc = await getDoc(userWatchedDocRef);
  
          if (userWatchedDoc.exists()) {
            const data = userWatchedDoc.data();
            setMovies(Array.isArray(data.movies) ? data.movies : []);
          } else {
            setMovies([]);
          }
        } else {
          console.log('UID não encontrado.');
        }
      } catch (error) {
        console.error('Erro ao buscar filmes assistidos:', error);
        setError('Erro ao buscar filmes assistidos.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchWatchedMovies();
  }, [uid]);  
  

  const removeMovie = async (movieId) => {
    try {
      const userWatchedDocRef = doc(db, 'watched', uid);

      await updateDoc(userWatchedDocRef, {
        movies: arrayRemove(movies.find(movie => movie.id === movieId))
      });

      setMovies(movies.filter(movie => movie.id !== movieId));
    } catch (error) {
      console.error('Erro ao remover filme assistido:', error);
      setError('Erro ao remover filme assistido.');
    }
  };

  if (loading) {
    return <p className="watch-loading">Carregando...</p>;
  }

  if (error) {
    return <p className="watch-error">Erro: {error}</p>;
  }

  return (
    <div className="watch">
      <Navbar />
      <div className="watch-hero">
        <div className="watch-hero-caption">
          <h2>Filmes Assistidos</h2>
          <div className="watch-cards-container">
            {movies.length > 0 ? (
              movies.map((movie) => (
                <div key={movie.id} className="watch-card">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="watch-card-img"
                  />
                  <p className="watch-card-title">{movie.title || 'Título não disponível'}</p>
                  <p className="watch-card-date">
                    Assistido em: {movie.watchedAt ? new Date(movie.watchedAt).toLocaleDateString() : 'Data não disponível'}
                  </p>
                  <button className="watch-remove-btn" onClick={() => removeMovie(movie.id)}>
                    <AiOutlineClose />
                  </button>
                </div>
              ))
            ) : (
              <p>Nenhum filme assistido encontrado.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Watch;
