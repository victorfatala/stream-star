import React, { useEffect } from "react";
import Home from "./pages/Home/Home";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import Player from "./pages/Player/Player";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Watch from './pages/watch/Watch';
import Fav from "./pages/Favorites/Fav";

const App = () => {


  const navigate = useNavigate();

  useEffect(()=>{
    onAuthStateChanged(auth, async(user)=>{
      if (user) {
        navigate('/');
      }else{
        navigate('/login');
      }
    })
  },[])

  return (
    <div>
      <ToastContainer theme="dark"/>
      <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet"
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/player/:id" element={<Player/>}></Route>
        <Route path="/watched/:uid" element={<Watch/>}></Route>
        <Route path="/favorites/:uid" element={<Fav/>}></Route>
      </Routes>
    </div>
  );
};

export default App;
