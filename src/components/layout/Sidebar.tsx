import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, GraduationCap, Plus, Users, Sparkles, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  collapsed: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
};

const items = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/workshops", label: "Oficinas", icon: GraduationCap },
  { to: "/workshops/new", label: "Nova Oficina", icon: Plus },
  { to: "/teachers", label: "Professores", icon: Users },
  { to: "/students", label: "Alunos", icon: Users },
];

export function Sidebar({ collapsed, onToggle, onNavigate }: Props) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside
      className={cn(
        "relative h-full bg-sidebar border-r border-sidebar-border flex flex-col transition-[width] duration-300 ease-out",
        collapsed ? "w-[76px]" : "w-[260px]"
      )}
    >
      <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border">
        <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center shadow-elegant shrink-0">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-sidebar-foreground">EduFlow</span>
            <span className="text-xs text-muted-foreground">Oficinas</span>
          </div>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map((it) => {
          const isActive = it.exact ? pathname === it.to : pathname.startsWith(it.to);
          const Icon = it.icon;
          return (
            <Link
              key={it.to}
              to={it.to}
              onClick={onNavigate}
              className={cn(
                "relative group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="active-pill"
                  className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-primary"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Icon className="h-[18px] w-[18px] shrink-0" />
              {!collapsed && <span className="truncate">{it.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={onToggle}
          className="hidden md:flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs text-muted-foreground hover:bg-sidebar-accent transition-colors"
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
          {!collapsed && <span>Esconder menu</span>}
        </button>
      </div>
    </aside>
  );
}
