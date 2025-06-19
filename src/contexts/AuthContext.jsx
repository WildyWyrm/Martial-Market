import React, { createContext, useState, useContext, useEffect } from "react";
import { auth, googleProvider } from "../auth/firebase";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    signInWithPopup,
    updateProfile as firebaseUpdateProfile,
} from "firebase/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Función para actualizar el perfil y el estado local del usuario
    const updateProfile = async (profile) => {
        if (!auth.currentUser) throw new Error("No hay usuario logueado");
        await firebaseUpdateProfile(auth.currentUser, profile);
        // Actualizo el user del contexto
        setUser({ ...auth.currentUser });
    };

    const signup = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const loginWithGoogle = () => {
        return signInWithPopup(auth, googleProvider);
    };

    const logout = () => {
        return signOut(auth);
    };

    return (
        <AuthContext.Provider
            value={{ user, signup, login, logout, loginWithGoogle, loading, updateProfile }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
