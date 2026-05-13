import * as React from "react";
import { Check, ChevronDown, Loader2, X } from "lucide-react";
import { useTeachers } from "@/context/TeachersContext";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  value: string[];
  onChange: (ids: string[]) => void;
  error?: boolean;
};

export function MultiSelectTeachers({ value, onChange, error }: Props) {
  const [open, setOpen] = React.useState(false);
  const { teachers, loading } = useTeachers();
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const selected = teachers.filter((t) => value.includes(t.id));

  const toggle = (id: string) => {
    onChange(value.includes(id) ? [] : [id]);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "w-full min-h-11 rounded-lg border bg-background px-3 py-2 text-left text-sm flex flex-wrap gap-1.5 items-center transition-colors",
          error ? "border-destructive ring-1 ring-destructive/30" : "border-input hover:border-ring/60",
          open && "ring-2 ring-ring/30 border-ring"
        )}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground mr-2" />}
        {selected.length === 0 && !loading && (
          <span className="text-muted-foreground">Selecionar professor...</span>
        )}
        {selected.map((t) => (
          <span
            key={t.id}
            className="inline-flex items-center gap-1.5 rounded-full bg-accent text-accent-foreground pl-2 pr-1 py-0.5 text-xs font-medium"
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: t.color }} />
            {t.name}
            <span
              role="button"
              onClick={(e) => {
                e.stopPropagation();
                toggle(t.id);
              }}
              className="h-4 w-4 inline-flex items-center justify-center rounded-full hover:bg-background/60"
            >
              <X className="h-3 w-3" />
            </span>
          </span>
        ))}
        <ChevronDown className={cn("ml-auto h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute z-20 mt-2 w-full rounded-xl border border-border bg-popover shadow-elegant overflow-hidden"
          >
            <ul className="py-1 max-h-64 overflow-auto scrollbar-thin">
              {loading && (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              )}
              {!loading && teachers.length === 0 && (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  Nenhum professor encontrado.
                </div>
              )}
              {teachers.map((t) => {
                const isSel = value.includes(t.id);
                return (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => toggle(t.id)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-accent transition-colors"
                    >
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: t.color }} />
                      <div className="flex-1 text-left">
                        <div className="font-medium">{t.name}</div>
                        <div className="text-xs text-muted-foreground">{t.expertise}</div>
                      </div>
                      <span
                        className={cn(
                          "h-5 w-5 rounded-md border flex items-center justify-center transition-colors",
                          isSel ? "bg-primary border-primary text-primary-foreground" : "border-input"
                        )}
                      >
                        {isSel && <Check className="h-3.5 w-3.5" />}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
