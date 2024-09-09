import React, { useEffect, useState } from 'react';
import { db, doc, getDoc } from '../../firebase'; 
import { auth } from '../../firebase'; 

const Fav = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (auth.currentUser) {
        const userId = auth.currentUser.uid;
        const userFavoritesDocRef = doc(db, 'favorites', userId);
        try {
          const userFavoritesDoc = await getDoc(userFavoritesDocRef);
          if (userFavoritesDoc.exists()) {
            const data = userFavoritesDoc.data();
            setMovies(data.movies || []);
          } else {
            setMovies([]);
          }
        } catch (error) {
          console.error('Erro ao buscar favoritos:', error);
          setError('Erro ao buscar favoritos.');
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

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>Erro: {error}</p>;
  }

  return (
    <div>
      <h2>Favoritos</h2>
      <ul>
        {movies.length > 0 ? (
          movies.map((movie) => (
            <li key={movie.id}>
              <p>{movie.title || 'Título não disponível'}</p>
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
          <p>Nenhum favorito encontrado.</p>
        )}
      </ul>
    </div>
  );
};

export default Fav;
