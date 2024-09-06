import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, arrayUnion, getFirestore } from "firebase/firestore";
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

    // Adiciona o usuário à coleção 'users'
    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      authProvider: "local",
    });

    toast.success("Usuário criado com sucesso!");
  } catch (error) {
    console.error(error);
    toast.error(error.code.split('/')[1].split('-').join(" "));
  }
};

const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    console.log(auth);
  } catch (error) {
    console.error(error);
    toast.error(error.code.split('/')[1].split('-').join(" "));
  }
};

const logout = () => {
  signOut(auth).catch((error) => {
    console.error("Erro durante o logout:", error);
  });
};

const addWatchedMovie = async (movieData) => {
  if (auth.currentUser) {
    const userId = auth.currentUser.uid;
    const userDocRef = doc(db, "watched", userId);

    // Adiciona o filme ao array 'movies' do documento
    await updateDoc(userDocRef, {
      movies: arrayUnion(movieData)
    });
  } else {
    console.error("Usuário não autenticado");
  }
};

export { auth, db, login, signup, logout, setDoc, getDoc, updateDoc, arrayUnion, addWatchedMovie };
