import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  User as FirebaseUser,
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
  register: (data: { nome: string; email: string; senha: string; cargo?: string }) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

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
          id: data.uuid || firebaseUser.uid,
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
          const parsed = JSON.parse(savedUser);
          if (parsed.localAuth) {
            setUser(parsed);
          } else {
            setUser(null);
            localStorage.removeItem("ellp.user");
          }
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const localRes = await fetch(`${API_URL}/login/local`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha: password }),
    });
    if (localRes.ok) {
      const data = await localRes.json();
      const userData: Record<string, any> = {
        id: data.usuario.uuid,
        name: data.usuario.nome,
        email: data.usuario.email,
        role: data.usuario.cargo === "Admin" ? "admin" : "teacher",
        token: data.token,
        localAuth: true,
      };
      setUser(userData as any);
      localStorage.setItem("ellp.user", JSON.stringify(userData));
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await syncWithBackend(userCredential.user);
    } catch {
      throw new Error("E-mail ou senha incorretos");
    }
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

  const register = async (data: { nome: string; email: string; senha: string; cargo?: string }) => {
    const response = await fetch(`${API_URL}/registrar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: data.nome,
        email: data.email,
        senha: data.senha,
        cargo: data.cargo || "Professor",
      }),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: "Erro ao registrar" }));
      throw new Error(err.error || "Erro ao registrar");
    }
  };

  const logout = async () => {
    localStorage.removeItem("ellp.user");
    setUser(null);
    await signOut(auth);
  };

  const getToken = async () => {
    if (auth.currentUser) {
      return await auth.currentUser.getIdToken(true);
    }
    const saved = localStorage.getItem("ellp.user");
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.token || null;
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
