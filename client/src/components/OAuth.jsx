import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase.js";
import { useDispatch } from "react-redux";
import { signInSuccess, signInFailure } from "../redux/user/userSlice.js";
import { useNavigate } from "react-router-dom";

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photoURL: result.user.photoURL,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Google sign-in failed');
      }

      dispatch(signInSuccess(data));
      navigate('/')

    } catch (error) {
      dispatch(signInFailure(error.message))
      console.error("Google sign-in error: ", error);
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      className="oauth-button bg-red-600 text-white font-medium p-3 border-2 border-red-600 rounded-lg transition-all duration-300 ease-in-out transform hover:bg-transparent hover:text-red-600 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50"
    >
      Continue with Google
    </button>
  );
};

export default OAuth;
