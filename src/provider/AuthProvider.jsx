import { createContext, useEffect, useState } from "react";
import { toast } from 'react-toastify';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile as firebaseUpdateProfile,
  signOut,
} from "firebase/auth";
import { auth } from "../Firebase/firebase.config";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const createNewUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const loginWithEmailPassword = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider)
        .then(() => {
            toast.success('Google Sign-In successful!');
            window.location.href = "/"; 
        })
        .catch((error) => {
            toast.error(`Google Sign-In failed: ${error.message}`);
            console.error("Google Sign-In Error: ", error);
        });
};
  

  const signOutUser = () => {
    return signOut(auth);
  };

  const updateUserProfile = async (name, photoURL) => {
    if (!auth.currentUser) throw new Error("No user logged in.");
    await firebaseUpdateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photoURL,
    });

    // Refresh user state
    setUser({
      ...auth.currentUser,
      displayName: name,
      photoURL: photoURL,
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    setUser,
    loading,
    createNewUser,
    googleSignIn,
    loginWithEmailPassword,
    updateUserProfile,
    signOutUser,

  };

  return (
    <AuthContext.Provider value={authInfo}>
      {loading ? <div className="flex justify-center items-center min-h-screen"><span className="loading loading-bars loading-lg"></span>
        </div> : children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;