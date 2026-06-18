import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useStudents } from "@/context/StudentsContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { UserPlus, Users, GraduationCap, Trash2, Loader2, School } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/_app/students")({
  head: () => ({
    meta: [
      { title: "Alunos — EduFlow" },
      { name: "description", content: "Gerencie os alunos cadastrados no sistema." },
    ],
  }),
  component: StudentsPage,
});

function StudentsPage() {
  const { students, loading, addStudent, addStudentsBySchool, deleteStudent } = useStudents();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [school, setSchool] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [isBatchOpen, setIsBatchOpen] = useState(false);
  const [batchSchool, setBatchSchool] = useState("");
  const [batchAge, setBatchAge] = useState("");
  const [batchNames, setBatchNames] = useState("");
  const [batchSubmitting, setBatchSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !age || !school) {
      toast.error("Preencha todos os campos");
      return;
    }
    setSubmitting(true);
    try {
      await addStudent({ name, age: parseInt(age), school });
      toast.success("Aluno cadastrado com sucesso!");
      setIsDialogOpen(false);
      setName("");
      setAge("");
      setSchool("");
    } catch (err: any) {
      toast.error(err.message || "Erro ao cadastrar aluno");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nomes = batchNames.split("\n").map((n) => n.trim()).filter(Boolean);
    if (!batchSchool || nomes.length === 0) {
      toast.error("Preencha a escola e pelo menos um nome");
      return;
    }
    setBatchSubmitting(true);
    try {
      await addStudentsBySchool({
        escola: batchSchool,
        nomes,
        idade: batchAge ? parseInt(batchAge) : undefined,
      });
      toast.success(`${nomes.length} aluno(s) cadastrado(s) com sucesso!`);
      setIsBatchOpen(false);
      setBatchSchool("");
      setBatchAge("");
      setBatchNames("");
    } catch (err: any) {
      toast.error(err.message || "Erro ao cadastrar alunos");
    } finally {
      setBatchSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alunos</h1>
          <p className="text-muted-foreground">Gerencie os alunos cadastrados no sistema.</p>
        </div>

        <div className="flex gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary">
                <UserPlus className="mr-2 h-4 w-4" />
                Novo Aluno
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cadastrar Aluno</DialogTitle>
                <DialogDescription>Insira as informações do novo aluno abaixo.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome do aluno" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Idade</Label>
                    <Input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Ex: 12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="school">Escola</Label>
                    <Input id="school" value={school} onChange={(e) => setSchool(e.target.value)} placeholder="Nome da escola" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full gradient-primary" disabled={submitting}>
                    {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</> : "Salvar Aluno"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isBatchOpen} onOpenChange={setIsBatchOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-border">
                <School className="mr-2 h-4 w-4" />
                Adicionar por Escola
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Adicionar Alunos por Escola</DialogTitle>
                <DialogDescription>
                  Cadastre vários alunos da mesma escola de uma só vez.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleBatchSubmit} className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="batchSchool">Escola *</Label>
                    <Input id="batchSchool" value={batchSchool} onChange={(e) => setBatchSchool(e.target.value)} placeholder="Nome da escola" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="batchAge">Idade (opcional)</Label>
                    <Input id="batchAge" type="number" value={batchAge} onChange={(e) => setBatchAge(e.target.value)} placeholder="Ex: 12" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="batchNames">Nomes dos Alunos *</Label>
                  <p className="text-xs text-muted-foreground">Um nome por linha</p>
                  <Textarea
                    id="batchNames"
                    value={batchNames}
                    onChange={(e) => setBatchNames(e.target.value)}
                    placeholder={`João Silva\nMaria Oliveira\nPedro Santos`}
                    rows={6}
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full gradient-primary" disabled={batchSubmitting}>
                    {batchSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</> : `Cadastrar Alunos`}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-primary/5 border-primary/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Alunos</p>
                <h3 className="text-2xl font-bold">{loading ? "—" : students.length}</h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-soft border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            Lista de Alunos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Idade</TableHead>
                    <TableHead>Escola</TableHead>
                    <TableHead>Oficinas</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                        Nenhum aluno cadastrado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.age} anos</TableCell>
                        <TableCell>{student.school}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">
                            {student.workshopIds.length} vinculada(s)
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-muted-foreground hover:text-destructive"
                            onClick={async () => {
                              try {
                                await deleteStudent(student.id);
                                toast.success("Aluno removido");
                              } catch (err: any) {
                                toast.error(err.message || "Erro ao remover aluno");
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
