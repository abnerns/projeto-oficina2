import * as React from "react";
import { useAuth } from "./AuthContext";

export type Workshop = {
  id: string;
  title: string;
  description: string;
  date: string;
  teacherIds: string[];
  studentCount: number;
  createdAt: string;
};

type Ctx = {
  workshops: Workshop[];
  loading: boolean;
  getById: (id: string) => Workshop | undefined;
  create: (w: Omit<Workshop, "id" | "createdAt" | "studentCount">) => Promise<Workshop>;
  update: (id: string, w: Partial<Omit<Workshop, "id" | "createdAt" | "studentCount">>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
};

const WorkshopsContext = React.createContext<Ctx | null>(null);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

export function WorkshopsProvider({ children }: { children: React.ReactNode }) {
  const [workshops, setWorkshops] = React.useState<Workshop[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { getToken } = useAuth();

  const fetchWorkshops = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/get-oficinas`);
      if (response.ok) {
        const data = await response.json();
        const mapped: Workshop[] = data.map((o: any) => ({
          id: o.uuid,
          title: o.tema,
          description: o.descricao,
          date: o.data,
          teacherIds: o.teacherIds || (o.SUP_responsavel ? [o.SUP_responsavel] : []),
          studentCount: o.student_count || 0,
          createdAt: o.created_at || o.data,
        }));
        setWorkshops(mapped);
      }
    } catch (error) {
      console.error("Erro ao buscar oficinas:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchWorkshops();
  }, [fetchWorkshops]);

  const value: Ctx = {
    workshops,
    loading,
    getById: (id) => workshops.find((w) => w.id === id),
    create: async (w) => {
      const token = await getToken();
      const response = await fetch(`${API_URL}/create-oficina`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tema: w.title,
          descricao: w.description,
          data: w.date,
          responsavel: w.teacherIds[0],
          teacherIds: w.teacherIds,
        }),
      });

      if (!response.ok) throw new Error("Erro ao criar oficina");
      
      const data = await response.json();
      const newW: Workshop = {
        id: data.id,
        title: w.title,
        description: w.description,
        date: w.date,
        teacherIds: w.teacherIds,
        studentCount: 0,
        createdAt: new Date().toISOString(),
      };
      
      setWorkshops((prev) => [newW, ...prev]);
      return newW;
    },
    update: async (id, patch) => {
      const token = await getToken();
      const response = await fetch(`${API_URL}/update-oficina/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tema: patch.title,
          descricao: patch.description,
          data: patch.date,
          teacherIds: patch.teacherIds,
        }),
      });

      if (!response.ok) throw new Error("Erro ao atualizar oficina");
      
      setWorkshops((prev) =>
        prev.map((w) => (w.id === id ? { ...w, ...patch } : w))
      );
    },
    remove: async (id) => {
      const token = await getToken();
      const response = await fetch(`${API_URL}/delete-oficina/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Erro ao deletar oficina");
      
      setWorkshops((prev) => prev.filter((w) => w.id !== id));
    },
    refresh: fetchWorkshops,
  };

  return <WorkshopsContext.Provider value={value}>{children}</WorkshopsContext.Provider>;
}

export function useWorkshops() {
  const ctx = React.useContext(WorkshopsContext);
  if (!ctx) throw new Error("useWorkshops must be used within WorkshopsProvider");
  return ctx;
}
