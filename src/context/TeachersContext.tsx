import * as React from "react";
import { useAuth } from "./AuthContext";

export type Teacher = {
  id: string;
  name: string;
  expertise: string;
  color: string;
};

type Ctx = {
  teachers: Teacher[];
  loading: boolean;
  refresh: () => Promise<void>;
  getById: (id: string) => Teacher | undefined;
};

const TeachersContext = React.createContext<Ctx | null>(null);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

export function TeachersProvider({ children }: { children: React.ReactNode }) {
  const [teachers, setTeachers] = React.useState<Teacher[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { getToken, isAuthenticated } = useAuth();

  const fetchTeachers = React.useCallback(async () => {
    if (!isAuthenticated) {
        setLoading(false);
        return;
    }
    
    setLoading(true);
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/get-users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Map backend superusers to frontend Teacher type
        const mappedTeachers: Teacher[] = data.map((u: any, index: number) => ({
          id: u.uuid,
          name: u.nome,
          expertise: u.cargo || "Professor",
          // Generate a color based on the name or index if not present
          color: `oklch(0.65 0.18 ${ (index * 40) % 360 })`,
        }));
        setTeachers(mappedTeachers);
      }
    } catch (error) {
      console.error("Erro ao buscar professores:", error);
    } finally {
      setLoading(false);
    }
  }, [getToken, isAuthenticated]);

  React.useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const value: Ctx = {
    teachers,
    loading,
    refresh: fetchTeachers,
    getById: (id) => teachers.find((t) => t.id === id),
  };

  return <TeachersContext.Provider value={value}>{children}</TeachersContext.Provider>;
}

export function useTeachers() {
  const ctx = React.useContext(TeachersContext);
  if (!ctx) throw new Error("useTeachers must be used within TeachersProvider");
  return ctx;
}
