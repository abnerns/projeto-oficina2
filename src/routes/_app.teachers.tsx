import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { TEACHERS } from "@/data/teachers";
import { useWorkshops } from "@/context/WorkshopsContext";
import { GraduationCap } from "lucide-react";

export const Route = createFileRoute("/_app/teachers")({
  head: () => ({
    meta: [
      { title: "Professores" },
      { name: "description", content: "Conheça os professores que lideram as oficinas." },
    ],
  }),
  component: TeachersPage,
});

function TeachersPage() {
  const { workshops } = useWorkshops();
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Professores</h1>
        <p className="text-muted-foreground mt-1">Todos os professores disponíveis na plataforma.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TEACHERS.map((t, i) => {
          const count = workshops.filter((w) => w.teacherIds.includes(t.id)).length;
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="rounded-2xl bg-card border border-border p-6 shadow-soft hover:shadow-elegant transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div
                  className="h-14 w-14 rounded-2xl text-white text-lg font-semibold flex items-center justify-center"
                  style={{ background: t.color }}
                >
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <h3 className="font-semibold">{t.name}</h3>
                  <p className="text-xs text-muted-foreground">{t.expertise}</p>
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between text-sm">
                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <GraduationCap className="h-4 w-4" /> Oficinas
                </span>
                <span className="font-semibold">{count}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
