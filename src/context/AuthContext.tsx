import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "admin" | "teacher";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulação de verificação de sessão persistente
    const savedUser = localStorage.getItem("ellp.user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, _password: string) => {
    setIsLoading(true);
    try {
      // Simulação de API de login
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Usuário mockado para demonstração
      const mockUser: User = {
        id: "1",
        name: "Usuário Demonstração",
        email: email,
        role: email.includes("admin") ? "admin" : "teacher",
      };
      
      setUser(mockUser);
      localStorage.setItem("ellp.user", JSON.stringify(mockUser));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: any) => {
    setIsLoading(true);
    try {
      // Simulação de API de registro
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: data.name,
        email: data.email,
        role: data.role || "teacher",
      };
      
      setUser(newUser);
      localStorage.setItem("ellp.user", JSON.stringify(newUser));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ellp.user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        isLoading,
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
