import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

const labelMap: Record<string, string> = {
  "": "Dashboard",
  workshops: "Oficinas",
  new: "Nova Oficina",
  edit: "Editar",
  teachers: "Professores",
};

export function Breadcrumbs() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const parts = pathname.split("/").filter(Boolean);

  const crumbs = [{ to: "/", label: "Dashboard" }, ...parts.map((p, i) => ({
    to: "/" + parts.slice(0, i + 1).join("/"),
    label: labelMap[p] ?? p,
  }))];

  // dedup if first is dashboard and parts is empty
  const items = parts.length === 0 ? [crumbs[0]] : crumbs;

  return (
    <nav className="flex items-center text-sm text-muted-foreground">
      {items.map((c, i) => (
        <span key={c.to} className="flex items-center">
          {i > 0 && <ChevronRight className="h-3.5 w-3.5 mx-1.5 opacity-60" />}
          {i === items.length - 1 ? (
            <span className="text-foreground font-medium">{c.label}</span>
          ) : (
            <Link to={c.to} className="hover:text-foreground transition-colors">
              {c.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
