import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db, auth } from '../../firebase';

const Watch = () => {
  const { uid } = useParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWatchedMovies = async () => {
      console.log(`Fetching movies for user ${uid}`);
      try {
        if (uid) {
          if (!auth.currentUser || auth.currentUser.uid !== uid) {
            throw new Error('Usuário não autenticado ou UID incorreto.');
          }

          const userWatchedDocRef = doc(db, 'watched', uid);
          const userWatchedDoc = await getDoc(userWatchedDocRef);

          if (userWatchedDoc.exists()) {
            const data = userWatchedDoc.data();
            console.log('Data fetched:', data);

            setMovies(Array.isArray(data.movies) ? data.movies : []);
          } else {
            console.log('Nenhum documento encontrado para o UID fornecido.');
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

  const updateWatchedMovies = async (newMovie) => {
    try {
      const userWatchedDocRef = doc(db, 'watched', uid);

      console.log("Atualizando filmes assistidos com:", newMovie);

      const movieExists = movies.some(movie => movie.id === newMovie.id);

      if (movieExists) {
        const updatedMovies = movies.map(movie =>
          movie.id === newMovie.id ? { ...movie, watchedAt: newMovie.watchedAt } : movie
        );
        setMovies(updatedMovies);

        await updateDoc(userWatchedDocRef, {
          movies: updatedMovies
        });
      } else {
        const updatedMovies = [...movies, newMovie];
        setMovies(updatedMovies);

        await updateDoc(userWatchedDocRef, {
          movies: arrayUnion(newMovie)
        });
      }

      console.log("Filmes atualizados com sucesso.");
    } catch (error) {
      console.error('Erro ao atualizar filmes assistidos:', error);
      setError('Erro ao atualizar filmes assistidos.');
    }
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>Erro: {error}</p>;
  }

  return (
    <div>
      <h2>Filmes Assistidos</h2>
      <ul>
        {movies.length > 0 ? (
          movies.map((movie, index) => (
            <li key={index}>
              <p>{movie.title || 'Título não disponível'}</p>
              <p>
                Assistido em: {movie.watchedAt ? new Date(movie.watchedAt).toLocaleDateString() : 'Data não disponível'}
              </p>
              {movie.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  style={{ width: '100px', height: 'auto' }}
                />
              )}
            </li>
          ))
        ) : (
          <p>Nenhum filme assistido encontrado.</p>
        )}
      </ul>
    </div>
  );
};

export default Watch;
