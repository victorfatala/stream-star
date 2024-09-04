import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { addDoc, collection, getFirestore } from "firebase/firestore";
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
    await addDoc(collection(db, "user"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });
  } catch (error) {
    console.log(error);
    toast.error(error.code.split('/')[1].split('-').join(" "));
  }
};

const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password)
  } catch (error) {
   console.log(error);
   toast.error(error.code.split('/')[1].split('-').join(" "));
  }
};

const history = async(moviehistory) =>{
 const user = await create
}

const logout = ()=>{
 signOut(auth);
}


export {auth, db, login, signup, logout};
