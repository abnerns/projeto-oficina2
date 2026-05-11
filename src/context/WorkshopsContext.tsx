import * as React from "react";
import { SEED_WORKSHOPS } from "@/data/seed";

export type Workshop = {
  id: string;
  title: string;
  description: string;
  date: string; // ISO
  teacherIds: string[];
  createdAt: string;
};

type Ctx = {
  workshops: Workshop[];
  loading: boolean;
  getById: (id: string) => Workshop | undefined;
  create: (w: Omit<Workshop, "id" | "createdAt">) => Workshop;
  update: (id: string, w: Partial<Omit<Workshop, "id" | "createdAt">>) => void;
  remove: (id: string) => void;
};

const WorkshopsContext = React.createContext<Ctx | null>(null);
const STORAGE_KEY = "edu.workshops.v1";

export function WorkshopsProvider({ children }: { children: React.ReactNode }) {
  const [workshops, setWorkshops] = React.useState<Workshop[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const t = setTimeout(() => {
      try {
        const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
        if (raw) setWorkshops(JSON.parse(raw));
        else setWorkshops(SEED_WORKSHOPS);
      } catch {
        setWorkshops(SEED_WORKSHOPS);
      } finally {
        setLoading(false);
      }
    }, 450);
    return () => clearTimeout(t);
  }, []);

  React.useEffect(() => {
    if (!loading && typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(workshops));
    }
  }, [workshops, loading]);

  const value: Ctx = {
    workshops,
    loading,
    getById: (id) => workshops.find((w) => w.id === id),
    create: (w) => {
      const newW: Workshop = {
        ...w,
        id: `w_${Date.now().toString(36)}`,
        createdAt: new Date().toISOString(),
      };
      setWorkshops((prev) => [newW, ...prev]);
      return newW;
    },
    update: (id, patch) =>
      setWorkshops((prev) => prev.map((w) => (w.id === id ? { ...w, ...patch } : w))),
    remove: (id) => setWorkshops((prev) => prev.filter((w) => w.id !== id)),
  };

  return <WorkshopsContext.Provider value={value}>{children}</WorkshopsContext.Provider>;
}

export function useWorkshops() {
  const ctx = React.useContext(WorkshopsContext);
  if (!ctx) throw new Error("useWorkshops must be used within WorkshopsProvider");
  return ctx;
}
