import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download, FileText, Users, Search } from "lucide-react";
import { toast } from "sonner";
import { useWorkshops } from "@/context/WorkshopsContext";
import { useStudents } from "@/context/StudentsContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_app/certificates")({
  head: () => ({ meta: [{ title: "Certificados — EduFlow" }] }),
  component: CertificatesPage,
});

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

function CertificatesPage() {
  const { workshops, loading: wsLoading } = useWorkshops();
  const { students, loading: stdLoading, getStudentsByWorkshop } = useStudents();
  const { getToken } = useAuth();
  const [generating, setGenerating] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");

  const filtered = workshops.filter((w) =>
    w.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleDownload = async (alunoId: string, oficinaId: string, alunoNome: string) => {
    const key = `${alunoId}-${oficinaId}`;
    setGenerating(key);
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/certificate/${alunoId}/${oficinaId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!response.ok) throw new Error("Erro ao gerar certificado");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `certificado_${alunoNome.replace(/\s+/g, "_")}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`Certificado de ${alunoNome} baixado!`);
    } catch (error: any) {
      toast.error(error.message || "Erro ao gerar certificado");
    } finally {
      setGenerating(null);
    }
  };

  const loading = wsLoading || stdLoading;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Certificados</h1>
          <p className="text-muted-foreground mt-1">Gere certificados de participação para os alunos</p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar oficina..."
          className="w-full h-11 pl-10 pr-3 rounded-lg bg-card border border-input outline-none text-sm focus:border-ring focus:ring-2 focus:ring-ring/30 transition-all"
        />
      </div>

      {loading ? (
        <div className="text-muted-foreground py-8 text-center">Carregando...</div>
      ) : filtered.length === 0 ? (
        <Card className="border-border/50 shadow-soft">
          <CardContent className="py-12 text-center text-muted-foreground">
            {search ? "Nenhuma oficina encontrada." : "Nenhuma oficina cadastrada."}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filtered.map((ws) => {
            const linked = getStudentsByWorkshop(ws.id);
            return (
              <Card key={ws.id} className="border-border/50 shadow-soft">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    {ws.title}
                    <span className="ml-auto text-sm font-normal text-muted-foreground">
                      <Users className="h-4 w-4 inline mr-1" />
                      {linked.length} aluno{linked.length !== 1 ? "s" : ""}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {linked.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Nenhum aluno vinculado a esta oficina.
                    </p>
                  ) : (
                    <div className="divide-y divide-border rounded-md border">
                      {linked.map((student) => (
                        <div key={student.id} className="flex items-center justify-between px-4 py-3">
                          <div>
                            <p className="font-medium text-sm">{student.name}</p>
                            <p className="text-xs text-muted-foreground">{student.school}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5"
                            onClick={() => handleDownload(student.id, ws.id, student.name)}
                            disabled={generating === `${student.id}-${ws.id}`}
                          >
                            <Download className="h-4 w-4" />
                            {generating === `${student.id}-${ws.id}` ? "Gerando..." : "PDF"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
