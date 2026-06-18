import * as React from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Save } from "lucide-react";
import { toast } from "sonner";
import { useWorkshops } from "@/context/WorkshopsContext";
import { MultiSelectTeachers } from "./MultiSelectTeachers";

type Props = { mode: "create" | "edit"; id?: string };

type Errors = Partial<Record<"title" | "description" | "date" | "teacherIds", string>>;

export function WorkshopForm({ mode, id }: Props) {
  const navigate = useNavigate();
  const { create, update, getById, loading } = useWorkshops();
  const existing = id ? getById(id) : undefined;

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [date, setDate] = React.useState("");
  const [teacherIds, setTeacherIds] = React.useState<string[]>([]);
  const [errors, setErrors] = React.useState<Errors>({});
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (existing) {
      setTitle(existing.title);
      setDescription(existing.description);
      setDate(existing.date.slice(0, 10));
      setTeacherIds(existing.teacherIds);
    }
  }, [existing?.id]);

  const validate = (): Errors => {
    const e: Errors = {};
    if (!title.trim()) e.title = "Titulo é obrigatório";
    else if (title.trim().length < 3) e.title = "Pelo menos 3 caracteres";
    if (!description.trim()) e.description = "Descrição é obrigatória";
    else if (description.trim().length < 10) e.description = "Pelo menos 10 caracteres";
    if (!date) e.date = "Data é obrigatória";
    if (teacherIds.length === 0) e.teacherIds = "Selecione pelo menos um professor";
    return e;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) {
      toast.error("Por favor, corrija os erros abaixo");
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 400));
    const payload = { title: title.trim(), description: description.trim(), date: new Date(date).toISOString(), teacherIds };
    if (mode === "create") {
      try {
        const w = await create(payload);
        toast.success("Oficina criada", { description: w.title });
        // The id will be w_ timestamp if backend doesn't return id, but at least w is resolved.
        navigate({ to: "/workshops/$id", params: { id: w.id } });
      } catch (err) {
        toast.error("Erro ao criar oficina");
      }
    } else if (id) {
      try {
        await update(id, payload);
        toast.success("Oficina atualizada");
        navigate({ to: "/workshops/$id", params: { id } });
      } catch (err) {
        toast.error("Erro ao atualizar oficina");
      }
    }
    setSubmitting(false);
  };

  if (mode === "edit" && !loading && !existing) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold">Oficina não encontrada</h2>
        <Link to="/workshops" className="text-primary hover:underline text-sm mt-2 inline-block">Voltar para a lista</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <Link to="/workshops" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar para as oficinas
      </Link>

      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          {mode === "create" ? "Nova Oficina" : "Editar Oficina"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {mode === "create" ? "Preencha os detalhes para criar uma nova oficina." : "Atualize os detalhes da oficina."}
        </p>
      </div>

      <form onSubmit={onSubmit} className="rounded-2xl bg-card border border-border p-6 md:p-8 shadow-soft space-y-5">
        <Field label="Título / Tema" error={errors.title} required>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Introduction to Design Systems"
            className={inputCls(!!errors.title)}
          />
        </Field>

        <Field label="Descrição" error={errors.description} required>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="O que os participantes vão aprender?"
            rows={4}
            className={`${inputCls(!!errors.description)} py-2.5 resize-none`}
          />
        </Field>

        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Data" error={errors.date} required>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`${inputCls(!!errors.date)} pl-10`}
              />
            </div>
          </Field>
          <Field label="Professores" error={errors.teacherIds} required>
            <MultiSelectTeachers value={teacherIds} onChange={setTeacherIds} error={!!errors.teacherIds} />
          </Field>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-4 border-t border-border">
          <Link
            to="/workshops"
            className="h-11 px-4 inline-flex items-center justify-center rounded-lg border border-input bg-background text-sm font-medium hover:bg-accent transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="h-11 px-5 inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold shadow-elegant hover:opacity-90 disabled:opacity-60 transition-opacity"
          >
            <Save className="h-4 w-4" />
            {submitting ? "Saving..." : mode === "create" ? "Criar Oficina" : "Salvar Alterações"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label, error, required, children,
}: { label: string; error?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-destructive mt-1.5">{error}</p>}
    </div>
  );
}

function inputCls(error: boolean) {
  return [
    "w-full h-11 px-3 rounded-lg bg-background text-sm outline-none transition-colors border",
    error ? "border-destructive ring-1 ring-destructive/30" : "border-input focus:border-ring focus:ring-2 focus:ring-ring/30",
  ].join(" ");
}
