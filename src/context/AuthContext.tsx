import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  User as FirebaseUser,
  getIdToken
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

export type UserRole = "admin" | "teacher";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const syncWithBackend = async (firebaseUser: FirebaseUser) => {
    try {
      const token = await firebaseUser.getIdToken();
      const response = await fetch(`${API_URL}/login`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const userData: User = {
          id: data.idgoogle || firebaseUser.uid,
          name: data.nome || firebaseUser.displayName || "Usuário",
          email: firebaseUser.email || "",
          role: data.profissao === "Admin" ? "admin" : "teacher",
          token: token,
        };
        setUser(userData);
        localStorage.setItem("ellp.user", JSON.stringify(userData));
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Erro na sincronização com o servidor");
      }
    } catch (error) {
      console.error("Erro ao sincronizar com backend:", error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      if (firebaseUser) {
        try {
          await syncWithBackend(firebaseUser);
        } catch (error) {
          console.error("Failed to sync user data:", error);
        }
      } else {
        const savedUser = localStorage.getItem("ellp.user");
        if (savedUser) {
          setUser(null);
          localStorage.removeItem("ellp.user");
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, _password: string) => {
    // This could be implemented with signInWithEmailAndPassword if needed
    console.log("Email login not fully implemented with Firebase yet", email);
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await syncWithBackend(result.user);
    } catch (error) {
      console.error("Erro no login com Google:", error);
      setIsLoading(false);
      throw error;
    }
  };

  const register = async (data: any) => {
    // Similar to login
    console.log("Register not implemented with Firebase yet", data);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    localStorage.removeItem("ellp.user");
  };

  const getToken = async () => {
    if (auth.currentUser) {
      return await auth.currentUser.getIdToken(true);
    }
    return null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        loginWithGoogle,
        register,
        logout,
        isLoading,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
