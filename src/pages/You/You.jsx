import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { generateRecommendations } from "../../firebase";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "./You.css";
import streamstar_spinner from "../../assets/streamstar_spinner.gif";

const You = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          setUserId(user.uid);
        } else {
          console.error("Usuário não autenticado");
          setError("Usuário não autenticado");
        }
      } catch (err) {
        console.error("Erro ao obter ID do usuário:", err);
        setError("Erro ao obter ID do usuário");
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);
      try {
        await generateRecommendations();

        const response = await fetch(`http://localhost:5000/you/${userId}`, {
          method: "GET",
        });

        if (!response.ok) throw new Error("Falha na solicitação");
        const data = await response.json();

        console.log("Dados recebidos:", data);

        const recommendationsArray =
          data.recommendations?.recommendations || [];
        setRecommendations(recommendationsArray);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [userId]);

  if (loading)
    return (
      <div className="you-spinner">
        <img src={streamstar_spinner} alt="loading" />
        <p>
          <span class="dot">.</span>
          <span class="dot">.</span>
          <span class="dot">.</span>
        </p>
      </div>
    );
  if (error) return <p className="you-error">Erro ao carregar: {error}</p>;

  return (
    <div className="you-container">
      <Navbar />
      <div className="you-hero">
        <h2>Para Você</h2>
      </div>
      <div className="you-grid-container">
        {recommendations.length > 0 ? (
          recommendations.map((movie) => (
            <div key={movie.id} className="you-grid-item">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="you-grid-item-img"
              />
              <p className="you-grid-item-title">
                {movie.title || "Título não disponível"}
              </p>
            </div>
          ))
        ) : (
          <p>Nenhuma recomendação disponível.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default You;
