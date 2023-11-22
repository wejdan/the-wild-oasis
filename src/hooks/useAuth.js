// src/useAuth.js
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

const useAuth = () => {
  const [userId, setUserId] = useState(null);
  const [isAuthenticating, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("user id", user);
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { userId, isAuthenticating };
};
export default useAuth;
