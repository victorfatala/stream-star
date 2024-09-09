import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getFirestore,
} from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyBv15xwe2rVvt4t1yq5XYbWlq9yXog9vY8",
  authDomain: "stream-star-b7813.firebaseapp.com",
  projectId: "stream-star-b7813",
  storageBucket: "stream-star-b7813.appspot.com",
  messagingSenderId: "24771137365",
  appId: "1:24771137365:web:58ad49c206d20c2581e9dc",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    await updateProfile(user, { displayName: name });

    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      authProvider: "local",
    });

    toast.success("Usuário criado com sucesso!");
  } catch (error) {
    console.error(error);
    toast.error(error.code.split("/")[1].split("-").join(" "));
  }
};

const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    console.log(auth);
  } catch (error) {
    console.error(error);
    toast.error(error.code.split("/")[1].split("-").join(" "));
  }
};

const logout = () => {
  signOut(auth).catch((error) => {
    console.error("Erro durante o logout:", error);
  });
};

const addFavoriteMovie = async (movie) => {
  if (auth.currentUser) {
    const userId = auth.currentUser.uid;
    const userDocRef = doc(db, "favorites", userId);

    try {
      // Verifica se o documento já existe
      const docSnap = await getDoc(userDocRef);

      if (!docSnap.exists()) {
        // Se o documento não existir, cria um novo documento com um array vazio
        await setDoc(userDocRef, { movies: [] });
      }

      // Adiciona o filme aos favoritos
      await updateDoc(userDocRef, {
        movies: arrayUnion({
          id: movie.id,
          title: movie.title,
          backdrop_path: movie.backdrop_path,
          poster_path: movie.poster_path,
          overview: movie.overview,
        }),
      });

      console.log("Filme adicionado aos favoritos com sucesso.");
    } catch (error) {
      console.error("Erro ao adicionar filme aos favoritos:", error);
    }
  } else {
    console.error("Usuário não autenticado");
  }
};


const removeFavoriteMovie = async (movieId) => {
  if (!auth.currentUser) {
    throw new Error("Usuário não autenticado");
  }

  const userId = auth.currentUser.uid;
  const userDocRef = doc(db, "favorites", userId);

  try {
    await updateDoc(userDocRef, {
      movies: arrayRemove({ id: movieId })
    });
  } catch (error) {
    console.error("Erro ao remover filme dos favoritos:", error);
    throw error;
  }
};

const addWatchedMovie = async (movieData) => {
  if (auth.currentUser) {
    const userId = auth.currentUser.uid;
    const userDocRef = doc(db, "watched", userId);

    try {
      await updateDoc(userDocRef, {
        movies: arrayUnion({
          id: movieData.id,
          title: movieData.title,
          backdrop_path: movieData.backdrop_path,
          genre_ids: movieData.genre_ids,
          overview: movieData.overview,
          popularity: movieData.popularity,
          poster_path: movieData.poster_path,
          release_date: movieData.release_date,
          vote_average: movieData.vote_average,
          vote_count: movieData.vote_count,
          watchedAt: new Date().toISOString(),
        }),
      });

      console.log("Filme adicionado aos assistidos com sucesso.");
    } catch (error) {
      console.error("Erro ao adicionar filme aos assistidos:", error);
    }
  } else {
    console.error("Usuário não autenticado");
  }
};

export {
  auth,
  db,
  doc,
  login,
  signup,
  logout,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  addFavoriteMovie,
  removeFavoriteMovie,
  addWatchedMovie,
};
