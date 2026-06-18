import { useState, useMemo } from "react";
import { useStudents } from "@/context/StudentsContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Users, UserPlus, UserMinus, Loader2, School } from "lucide-react";

interface WorkshopStudentsProps {
  workshopId: string;
}

export function WorkshopStudents({ workshopId }: WorkshopStudentsProps) {
  const { students, loading, linkStudentToWorkshop, linkStudentsToWorkshop, unlinkStudentFromWorkshop, getStudentsByWorkshop } = useStudents();
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [linking, setLinking] = useState(false);

  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const [linkingSchool, setLinkingSchool] = useState(false);

  const linkedStudents = getStudentsByWorkshop(workshopId);
  const availableStudents = students.filter(s => !s.workshopIds.includes(workshopId));
  const linkedStudentIds = new Set(linkedStudents.map(s => s.id));

  const schools = useMemo(() => {
    const unique = new Set(availableStudents.map(s => s.school));
    return Array.from(unique).sort();
  }, [availableStudents]);

  const studentsBySchool = useMemo(() => {
    if (!selectedSchool) return [];
    return availableStudents.filter(s => s.school === selectedSchool);
  }, [availableStudents, selectedSchool]);

  const handleLink = async () => {
    if (!selectedStudentId) return;
    setLinking(true);
    try {
      await linkStudentToWorkshop(selectedStudentId, workshopId);
      toast.success("Aluno vinculado com sucesso!");
      setSelectedStudentId("");
    } catch (err: any) {
      toast.error(err.message || "Erro ao vincular aluno");
    } finally {
      setLinking(false);
    }
  };

  const handleLinkSchool = async () => {
    if (!selectedSchool || studentsBySchool.length === 0) return;
    setLinkingSchool(true);
    try {
      const ids = studentsBySchool.map(s => s.id);
      await linkStudentsToWorkshop(ids, workshopId);
      toast.success(`${ids.length} aluno(s) vinculado(s) com sucesso!`);
      setSelectedSchool("");
    } catch (err: any) {
      toast.error(err.message || "Erro ao vincular alunos");
    } finally {
      setLinkingSchool(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/50 shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Vincular Novo Aluno
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="flex-1">
              <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um aluno para vincular" />
                </SelectTrigger>
                <SelectContent>
                  {loading ? (
                    <SelectItem value="none" disabled>Carregando...</SelectItem>
                  ) : availableStudents.length === 0 ? (
                    <SelectItem value="none" disabled>Todos os alunos já estão vinculados</SelectItem>
                  ) : (
                    availableStudents.map(student => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name} ({student.school})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleLink} disabled={!selectedStudentId || linking} className="gradient-primary">
              {linking ? <Loader2 className="h-4 w-4 animate-spin" /> : "Vincular"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <School className="h-5 w-5 text-primary" />
            Vincular por Escola
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 items-start">
            <div className="flex-1 space-y-2">
              <Select value={selectedSchool} onValueChange={setSelectedSchool}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma escola" />
                </SelectTrigger>
                <SelectContent>
                  {loading ? (
                    <SelectItem value="none" disabled>Carregando...</SelectItem>
                  ) : schools.length === 0 ? (
                    <SelectItem value="none" disabled>Nenhuma escola disponível</SelectItem>
                  ) : (
                    schools.map(school => (
                      <SelectItem key={school} value={school}>
                        {school} ({availableStudents.filter(s => s.school === school).length} alunos)
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {selectedSchool && studentsBySchool.length > 0 && (
                <div className="rounded-md border text-sm divide-y divide-border">
                  {studentsBySchool.map(s => (
                    <div key={s.id} className="flex items-center justify-between px-3 py-2">
                      <span className="font-medium">{s.name}</span>
                      <span className="text-muted-foreground">{s.age} anos</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Button
              onClick={handleLinkSchool}
              disabled={!selectedSchool || studentsBySchool.length === 0 || linkingSchool}
              className="gradient-primary mt-0"
            >
              {linkingSchool ? <Loader2 className="h-4 w-4 animate-spin" /> : `Vincular Todos (${studentsBySchool.length})`}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Alunos Vinculados ({linkedStudents.length})
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
                    <TableHead>Escola</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {linkedStudents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                        Nenhum aluno vinculado a esta oficina.
                      </TableCell>
                    </TableRow>
                  ) : (
                    linkedStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.school}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-muted-foreground hover:text-destructive"
                            onClick={async () => {
                              try {
                                await unlinkStudentFromWorkshop(student.id, workshopId);
                                toast.success("Vínculo removido");
                              } catch (err: any) {
                                toast.error(err.message || "Erro ao remover vínculo");
                              }
                            }}
                          >
                            <UserMinus className="h-4 w-4" />
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
