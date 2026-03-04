import {createContext} from "react";
import {type User} from "firebase/auth";

export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);
