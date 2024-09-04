import React, { useState } from "react";
import "./Player.css";
import back_arrow_icon from '../../assets/back_arrow_icon.png'
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";


const Player = () => {

  const {id} = useParams();
  const navigate = useNavigate();

  const [apiData, setApiData] = useState({
    name: "",
    key: "",
    published_at: "",
    typeof: ""
  })

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmYWVlYzMzMmFjMTk4NjY0OTJhOTc2OGQ2YmRhZGUzNyIsIm5iZiI6MTcyNTQ1NTI5OS44NDk3MTYsInN1YiI6IjY2ZDg1YTk2NWNkZjI3OWZmNTE4Mjk2NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.hhuZG-MusU4Ozh6PVLx0Zl-oKmZacdax6ocCwDzWPS4'
    }
  };

  useEffect(()=>{
    fetch(`https://api.themoviedb.org/3/movie/${id}/videos?language=pt-BR`, options)
    .then(response => response.json())
    .then(response => setApiData(response.results[0]))
    .catch(err => console.error(err));
  })
  

  return(
    <div className="player">
      <img src={back_arrow_icon} alt="" onClick={()=>{navigate("/")}}/>
      <iframe width='90%' height='90%'
      src={`https://www.youtube.com/embed/${apiData.key}`}
      title='trailer' frameBorder='0' allowFullScreen
      ></iframe>
      <div className="player-info">
        <p>{apiData.published_at.slice(0)}</p>
        <p>{apiData.name}</p>
        <p>{apiData.type}</p>
      </div>
    </div>
  );
};

export default Player;
