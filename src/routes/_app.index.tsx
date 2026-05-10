import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Calendar, GraduationCap, Plus, Users, Activity } from "lucide-react";
import { format, isAfter } from "date-fns";
import { useWorkshops } from "@/context/WorkshopsContext";
import { StatCard } from "@/components/ui-kit/StatCard";
import { getTeachersByIds, TEACHERS } from "@/data/teachers";

export const Route = createFileRoute("/_app/")({
  head: () => ({
    meta: [
      { title: "Dashboard — EduFlow" },
      { name: "description", content: "Overview of workshops, teachers and upcoming sessions." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { workshops, loading } = useWorkshops();
  const now = new Date();
  const upcoming = workshops.filter((w) => isAfter(new Date(w.date), now));
  const teacherIds = new Set(workshops.flatMap((w) => w.teacherIds));
  const recent = [...workshops]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  // Mock chart: workshops per month (last 6 months)
  const months = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    return { key: format(d, "MMM"), m: d.getMonth(), y: d.getFullYear() };
  });
  const counts = months.map(
    ({ m, y }) =>
      workshops.filter((w) => {
        const d = new Date(w.date);
        return d.getMonth() === m && d.getFullYear() === y;
      }).length
  );
  const max = Math.max(1, ...counts);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Bem vinda de volta, Ana</h1>
          <p className="text-muted-foreground mt-1">
            Como estão as oficinas hoje
          </p>
        </div>
        <Link
          to="/workshops/new"
          className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold shadow-elegant hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" /> Nova oficina
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total de Oficinas" value={loading ? "—" : workshops.length} icon={GraduationCap} trend="+12% esse mês" delay={0} />
        <StatCard label="Novas" value={loading ? "—" : upcoming.length} icon={Calendar} trend="+3 essa semana" delay={0.05} />
        <StatCard label="Professores Ativos" value={loading ? "—" : teacherIds.size} icon={Users} trend={`${TEACHERS.length} na plataforma`} delay={0.1} />
        <StatCard label="Crescimento" value="92%" icon={Activity} trend="+4.2% vs o mês anterior" delay={0.15} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="lg:col-span-2 rounded-2xl bg-card border border-border p-6 shadow-soft"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold">Oficinas ao longo do tempo</h2>
              <p className="text-sm text-muted-foreground">Últimos 6 meses</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-success/10 text-success font-medium">+18%</span>
          </div>
          <div className="flex items-end gap-3 h-48">
            {counts.map((c, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(c / max) * 100}%` }}
                  transition={{ duration: 0.7, delay: 0.3 + i * 0.05, ease: "easeOut" }}
                  className="w-full rounded-t-lg gradient-primary min-h-1 relative group"
                >
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    {c}
                  </span>
                </motion.div>
                <span className="text-xs text-muted-foreground">{months[i].key}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="rounded-2xl bg-card border border-border p-6 shadow-soft"
        >
          <h2 className="text-lg font-semibold mb-4">Top professores</h2>
          <ul className="space-y-3">
            {TEACHERS.map((t) => {
              const count = workshops.filter((w) => w.teacherIds.includes(t.id)).length;
              const pct = workshops.length ? (count / workshops.length) * 100 : 0;
              return (
                <li key={t.id}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="h-6 w-6 rounded-full text-[10px] font-semibold text-white flex items-center justify-center" style={{ background: t.color }}>
                        {t.name.split(" ").map((n) => n[0]).join("")}
                      </span>
                      <span className="font-medium">{t.name}</span>
                    </div>
                    <span className="text-muted-foreground">{count}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ background: t.color }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="rounded-2xl bg-card border border-border p-6 shadow-soft"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Criadas recentemente</h2>
          <Link to="/workshops" className="text-sm text-primary hover:underline">Ver todas</Link>
        </div>
        <div className="divide-y divide-border">
          {recent.map((w) => {
            const teachers = getTeachersByIds(w.teacherIds);
            return (
              <Link
                key={w.id}
                to="/workshops/$id"
                params={{ id: w.id }}
                className="flex items-center gap-4 py-3 -mx-2 px-2 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="h-10 w-10 rounded-xl gradient-primary text-primary-foreground flex items-center justify-center shrink-0">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{w.title}</p>
                  <p className="text-xs text-muted-foreground">{format(new Date(w.date), "PP")} · {teachers.map((t) => t.name).join(", ") || "No teachers"}</p>
                </div>
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  {format(new Date(w.createdAt), "MMM d")}
                </span>
              </Link>
            );
          })}
          {!loading && recent.length === 0 && (
            <p className="text-sm text-muted-foreground py-6 text-center">No workshops yet.</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
