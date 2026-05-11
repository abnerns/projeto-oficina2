import { Link } from "@tanstack/react-router";
import { Calendar, Eye, Pencil, Trash2, Users } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import type { Workshop } from "@/context/WorkshopsContext";
import { getTeachersByIds } from "@/data/teachers";

type Props = {
  workshop: Workshop;
  onDelete: (w: Workshop) => void;
};

export function WorkshopCard({ workshop, onDelete }: Props) {
  const teachers = getTeachersByIds(workshop.teacherIds);
  const isPast = new Date(workshop.date) < new Date();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25 }}
      whileHover={{ y: -3 }}
      className="group relative rounded-2xl bg-card border border-border p-5 shadow-soft hover:shadow-elegant transition-shadow"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full ${
            isPast
              ? "bg-muted text-muted-foreground"
              : "bg-success/10 text-success"
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${isPast ? "bg-muted-foreground" : "bg-success"}`} />
          {isPast ? "Passada" : "Nova"}
        </span>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          <Link
            to="/workshops/$id"
            params={{ id: workshop.id }}
            className="h-8 w-8 inline-flex items-center justify-center rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground"
            aria-label="View"
          >
            <Eye className="h-4 w-4" />
          </Link>
          <Link
            to="/workshops/$id/edit"
            params={{ id: workshop.id }}
            className="h-8 w-8 inline-flex items-center justify-center rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground"
            aria-label="Edit"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <button
            onClick={() => onDelete(workshop)}
            className="h-8 w-8 inline-flex items-center justify-center rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
            aria-label="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <Link
        to="/workshops/$id"
        params={{ id: workshop.id }}
        className="block group/title"
      >
        <h3 className="text-lg font-semibold tracking-tight mb-2 group-hover/title:text-primary transition-colors">
          {workshop.title}
        </h3>
      </Link>
      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
        {workshop.description}
      </p>

      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          {format(new Date(workshop.date), "MMM d, yyyy")}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5" />
          {teachers.length} teacher{teachers.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="flex items-center -space-x-2">
        {teachers.slice(0, 4).map((t) => (
          <div
            key={t.id}
            title={t.name}
            className="h-7 w-7 rounded-full ring-2 ring-card flex items-center justify-center text-[10px] font-semibold text-white"
            style={{ background: t.color }}
          >
            {t.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
        ))}
        {teachers.length > 4 && (
          <div className="h-7 w-7 rounded-full ring-2 ring-card bg-muted text-[10px] font-semibold flex items-center justify-center">
            +{teachers.length - 4}
          </div>
        )}
        {teachers.length === 0 && (
          <span className="text-xs text-muted-foreground">Sem professores</span>
        )}
      </div>
    </motion.div>
  );
}
