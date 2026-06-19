import * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Pencil, Trash2, Users } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useWorkshops } from "@/context/WorkshopsContext";
import { useTeachers } from "@/context/TeachersContext";
import { DeleteWorkshopModal } from "@/components/workshops/DeleteWorkshopModal";
import { WorkshopStudents } from "@/components/workshops/WorkshopStudents";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_app/workshops/$id/")({
  head: () => ({ meta: [{ title: "Oficinas" }] }),
  component: WorkshopDetail,
});

function WorkshopDetail() {
  const { id } = Route.useParams();
  const { getById, remove, loading } = useWorkshops();
  const { teachers } = useTeachers();
  const navigate = useNavigate();
  const [confirm, setConfirm] = React.useState(false);
  const w = getById(id);

  if (loading) return <div className="text-muted-foreground">Loading...</div>;
  if (!w) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold">Oficina não encontrada</h2>
        <Link to="/workshops" className="text-primary hover:underline text-sm mt-2 inline-block">Voltar para a lista</Link>
      </div>
    );
  }
  const wTeachers = teachers.filter((t) => w.teacherIds.includes(t.id));
  const isPast = new Date(w.date) < new Date();

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <Link to="/workshops" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar para as Oficinas
      </Link>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="details">Detalhes da Oficina</TabsTrigger>
          <TabsTrigger value="students">Alunos Vinculados</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <div className="rounded-2xl bg-card border border-border p-8 shadow-soft">
            <div className="flex items-start justify-between gap-4 mb-4">
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${isPast ? "bg-muted text-muted-foreground" : "bg-success/10 text-success"
                  }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${isPast ? "bg-muted-foreground" : "bg-success"}`} />
                {isPast ? "Concluída" : "Próxima"}
              </span>
              <div className="flex gap-2">
                <Link
                  to="/workshops/$id/edit"
                  params={{ id: w.id }}
                  className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-input bg-background text-sm font-medium hover:bg-accent"
                >
                  <Pencil className="h-4 w-4" /> Edit
                </Link>
                <button
                  onClick={() => setConfirm(true)}
                  className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-destructive/30 bg-destructive/5 text-destructive text-sm font-medium hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" /> Deletar
                </button>
              </div>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight mb-3">{w.title}</h1>
            <p className="text-muted-foreground leading-relaxed mb-6">{w.description}</p>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="rounded-xl bg-muted/50 p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <Calendar className="h-3.5 w-3.5" /> Data
                </div>
                <p className="font-medium">{format(new Date(w.date), "PPPP")}</p>
              </div>
              <div className="rounded-xl bg-muted/50 p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <Users className="h-3.5 w-3.5" /> Professores
                </div>
                <p className="font-medium">{wTeachers.length} associados</p>
              </div>
            </div>

            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">Professores</h3>
            <div className="flex flex-wrap gap-2">
              {wTeachers.length === 0 && <span className="text-sm text-muted-foreground">Nenhum professor associado.</span>}
              {wTeachers.map((t) => (
                <div key={t.id} className="inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground pl-1 pr-3 py-1">
                  <span className="h-6 w-6 rounded-full text-[10px] font-semibold text-white flex items-center justify-center" style={{ background: t.color }}>
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                  <div className="text-xs">
                    <div className="font-medium leading-tight">{t.name}</div>
                    <div className="text-muted-foreground">{t.expertise}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="students">
          <WorkshopStudents workshopId={w.id} />
        </TabsContent>
      </Tabs>

      <DeleteWorkshopModal
        workshop={confirm ? w : null}
        onCancel={() => setConfirm(false)}
        onConfirm={() => {
          remove(w.id);
          toast.success("Oficina deletada com sucesso!");
          navigate({ to: "/workshops" });
        }}
      />
    </div>
  );
}
