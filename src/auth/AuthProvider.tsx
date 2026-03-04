import * as React from "react";
import {useEffect, useState} from "react";
import {onAuthStateChanged, signOut, type User} from "firebase/auth";
import {auth} from "./firebase.ts";
import {AuthContext} from "./AuthContext.tsx";

export const AuthProvider = ({children}: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const logout = async () => {
        await signOut(auth);
    };

    return (
        <AuthContext.Provider value={{user, isAuthenticated: !!user, isLoading, logout}}>
            {children}
        </AuthContext.Provider>
    );
}