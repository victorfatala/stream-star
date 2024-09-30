import React, { useEffect, useState } from "react";
import axios from "axios";

import "./SearchBar.css";
import youtube_icon from "../../assets/youtube_icon.png";
import twitter_icon from "../../assets/twitter_icon.png";
import instagram_icon from "../../assets/instagram_icon.png";
import facebook_icon from "../../assets/facebook_icon.png";
import ReactSearchBox from "react-search-box";
import ModalOverlay from "../ModalOverlay/ModalOverlay";

const SearchBar = () => {
  const [movies, setMovies] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const fetchMovies = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/popular?language=pt-BR&page=1`,
        {
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmYWVlYzMzMmFjMTk4NjY0OTJhOTc2OGQ2YmRhZGUzNyIsIm5iZiI6MTcyNjE0Mzk0NS4wMjgxMDUsInN1YiI6IjY2ZDg1YTk2NWNkZjI3OWZmNTE4Mjk2NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.KHf4DkN0bqTxHPAj7Pyz0Ljrm5I6jxIUSCPOxX54IK0",
          },
        }
      );
      setMovies(response.data.results || []);
    } catch (error) {
      console.error("Erro ao buscar filmes populares:", error);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  let data = movies.map((movie) => {
    return { key: movie.id, value: movie.title };
  });

  return (
    <div className="root-container">
      <ReactSearchBox
        placeholder="Pesquisar filme..."
        value="Doe"
        data={data}
        onSelect={(record) => {
          setSelectedMovie(
            movies.find((movie) => movie.id === record.item.key)
          );
          setModalVisible(true);
        }}
        autoFocus
        inputFontColor={"#fff"}
        inputBackgroundColor={"#2D1744"}
        inputBorderColor={"#2D1744"}
        dropDownHoverColor={"2D1744"}
        dropDownBorderColor={"#2D1744"}
      />
      {modalVisible && selectedMovie && (
        <ModalOverlay
          selectedMovie={selectedMovie}
          setModalVisible={setModalVisible}
          modalVisible={modalVisible}
          setSelectedMovie={setSelectedMovie}
        />
      )}
    </div>
  );
};

export default SearchBar;
