import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase'; // Verifique se o caminho está correto

const Watch = () => {
  const { uid } = useParams(); // Captura o parâmetro 'uid' da URL
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWatchedMovies = async () => {
      console.log(`Fetching movies for user ${uid}`); // Log de depuração
      try {
        if (uid) {
          const userDocRef = doc(db, 'watched', uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const data = userDoc.data();
            console.log('Data fetched:', data); // Log de depuração
            setMovies(Array.isArray(data.movies) ? data.movies : []);
          } else {
            console.log('Nenhum filme assistido encontrado.');
            setMovies([]);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar filmes assistidos:', error);
        setError('Erro ao buscar filmes assistidos.');
      } finally {
        setLoading(false);
      }
    };

    fetchWatchedMovies();
  }, [uid]); // Dependência do useEffect é o parâmetro 'uid'

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
          movies.map((movie) => (
            <li key={movie.id}>
              <p>{movie.title}</p>
              <p>
                Assistido em: {new Date(movie.watchedAt).toLocaleDateString()}
              </p>
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
