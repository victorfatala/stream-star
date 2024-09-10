import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth'; // Importar getAuth
import { generateRecommendations } from '../../firebase'; // Importe a função de gerar recomendações

const You = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null); // Adicione um estado para o userId

  useEffect(() => {
    // Função para buscar o ID do usuário autenticado
    const fetchUserId = async () => {
      try {
        const auth = getAuth(); // Obtendo a instância de autenticação
        const user = auth.currentUser; // Obtendo o usuário autenticado
        if (user) {
          setUserId(user.uid);
        } else {
          console.error('Usuário não autenticado');
          setError('Usuário não autenticado');
        }
      } catch (err) {
        console.error('Erro ao obter ID do usuário:', err);
        setError('Erro ao obter ID do usuário');
      }
    };

    fetchUserId();
  }, []); // Este useEffect é executado apenas uma vez

  useEffect(() => {
    if (!userId) return; // Não faz nada se userId não estiver definido

    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);
      try {
        // Gere as recomendações
        await generateRecommendations();

        // Busque as recomendações geradas
        const response = await fetch(`http://localhost:5000/you/${userId}`, {
          method: 'GET',
        });

        if (!response.ok) throw new Error('Falha na solicitação');
        const data = await response.json();

        console.log('Dados recebidos:', data); // Adicione este log para depuração

        // Acessa o array de recomendações
        const recommendationsArray = data.recommendations?.recommendations || [];
        setRecommendations(recommendationsArray);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [userId]); // Dependência em userId para garantir que o fetch só ocorra quando o ID estiver disponível

  if (loading) return <p>Carregando recomendações...</p>;
  if (error) return <p>Erro: {error}</p>;

  return (
    <div>
      <h1>Recomendações</h1>
      {recommendations.length > 0 ? (
        <div>
          {recommendations.map((movie) => (
            <div key={movie.id} style={{ marginBottom: '20px' }}>
              <h2>{movie.title}</h2>
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                style={{ width: '150px' }}
              />
              <p>{movie.overview}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Nenhuma recomendação disponível.</p>
      )}
    </div>
  );
};

export default You;
