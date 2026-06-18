import { Link } from "@tanstack/react-router";
import { Inbox, Plus } from "lucide-react";

export function EmptyState({
  title = "No workshops found",
  description = "Get started by creating your first workshop.",
  actionLabel = "Nova Oficina",
  actionTo = "/workshops/new",
}: {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionTo?: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border p-12 text-center bg-card/50">
      <div className="mx-auto h-14 w-14 rounded-2xl gradient-primary text-primary-foreground flex items-center justify-center shadow-elegant mb-4">
        <Inbox className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">{description}</p>
      <Link
        to={actionTo}
        className="inline-flex items-center gap-2 mt-5 h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity shadow-elegant"
      >
        <Plus className="h-4 w-4" /> {actionLabel}
      </Link>
    </div>
  );
}
