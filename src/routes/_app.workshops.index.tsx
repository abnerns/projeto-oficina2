import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Filter, Plus, Search, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import { useWorkshops, type Workshop } from "@/context/WorkshopsContext";
import { WorkshopCard } from "@/components/workshops/WorkshopCard";
import { WorkshopCardSkeleton } from "@/components/ui-kit/Skeleton";
import { EmptyState } from "@/components/ui-kit/EmptyState";
import { DeleteWorkshopModal } from "@/components/workshops/DeleteWorkshopModal";

export const Route = createFileRoute("/_app/workshops/")({
  head: () => ({
    meta: [
      { title: "Oficinas" },
      { name: "description", content: "Navegue, pesquise e gerencie todos os workshops educacionais" },
    ],
  }),
  component: WorkshopsList,
});

const PAGE_SIZE = 6;

function WorkshopsList() {
  const { workshops, loading, remove } = useWorkshops();
  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState<"todas" | "novas" | "passadas">("todas");
  const [sort, setSort] = React.useState<"date-asc" | "date-desc" | "title">("date-asc");
  const [page, setPage] = React.useState(1);
  const [toDelete, setToDelete] = React.useState<Workshop | null>(null);

  const filtered = React.useMemo(() => {
    const now = new Date();
    let list = workshops.filter((w) => {
      const matches =
        w.title.toLowerCase().includes(query.toLowerCase()) ||
        w.description.toLowerCase().includes(query.toLowerCase());
      const isPast = new Date(w.date) < now;
      const matchesFilter =
        filter === "todas" ||
        (filter === "novas" && !isPast) ||
        (filter === "passadas" && isPast);
      return matches && matchesFilter;
    });
    list = [...list].sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      const da = new Date(a.date).getTime();
      const db = new Date(b.date).getTime();
      return sort === "date-asc" ? da - db : db - da;
    });
    return list;
  }, [workshops, query, filter, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  React.useEffect(() => setPage(1), [query, filter, sort]);

  const confirmDelete = () => {
    if (!toDelete) return;
    remove(toDelete.id);
    toast.success("Oficina deletada com sucesso!", { description: toDelete.title });
    setToDelete(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Oficinas</h1>
          <p className="text-muted-foreground mt-1">
            {loading ? "Loading..." : `${filtered.length} oficina${filtered.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <Link
          to="/workshops/new"
          className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold shadow-elegant hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" /> Nova Oficina
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Procure por um título ou descrição..."
            className="w-full h-11 pl-10 pr-3 rounded-lg bg-card border border-input outline-none text-sm focus:border-ring focus:ring-2 focus:ring-ring/30 transition-all"
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className="h-11 pl-9 pr-8 rounded-lg bg-card border border-input outline-none text-sm appearance-none focus:border-ring focus:ring-2 focus:ring-ring/30"
            >
              <option value="todas">Todas</option>
              <option value="novas">Novas</option>
              <option value="passadas">Passadas</option>
            </select>
          </div>
          <div className="relative">
            <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="h-11 pl-9 pr-8 rounded-lg bg-card border border-input outline-none text-sm appearance-none focus:border-ring focus:ring-2 focus:ring-ring/30"
            >
              <option value="date-asc">Data ↑</option>
              <option value="date-desc">Data ↓</option>
              <option value="title">Título</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <WorkshopCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title={query ? "Nenhum resultado encontrado" : "Sem oficinas por aqui"}
          description={query ? "Tente um termo de pesquisa ou filtro diferente." : "Crie seu primeiro workshop para começar."}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {current.map((w) => (
                <WorkshopCard key={w.id} workshop={w} onDelete={setToDelete} />
              ))}
            </AnimatePresence>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="h-9 w-9 rounded-lg border border-input bg-card disabled:opacity-40 hover:bg-accent transition-colors flex items-center justify-center"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`h-9 min-w-9 px-3 rounded-lg text-sm font-medium transition-colors ${page === i + 1
                      ? "bg-primary text-primary-foreground shadow-elegant"
                      : "border border-input bg-card hover:bg-accent"
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="h-9 w-9 rounded-lg border border-input bg-card disabled:opacity-40 hover:bg-accent transition-colors flex items-center justify-center"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <DeleteWorkshopModal
        workshop={toDelete}
        onCancel={() => setToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
