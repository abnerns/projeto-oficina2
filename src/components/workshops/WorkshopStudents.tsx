import { useState } from "react";
import { useStudents } from "@/context/StudentsContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Users, UserPlus, UserMinus } from "lucide-react";

interface WorkshopStudentsProps {
  workshopId: string;
}

export function WorkshopStudents({ workshopId }: WorkshopStudentsProps) {
  const { students, linkStudentToWorkshop, unlinkStudentFromWorkshop, getStudentsByWorkshop } = useStudents();
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");

  const linkedStudents = getStudentsByWorkshop(workshopId);
  const availableStudents = students.filter(s => !s.workshopIds.includes(workshopId));

  const handleLink = () => {
    if (!selectedStudentId) return;
    linkStudentToWorkshop(selectedStudentId, workshopId);
    toast.success("Aluno vinculado com sucesso!");
    setSelectedStudentId("");
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
                  {availableStudents.length === 0 ? (
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
            <Button onClick={handleLink} disabled={!selectedStudentId} className="gradient-primary">
              Vincular
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
                          onClick={() => {
                            unlinkStudentFromWorkshop(student.id, workshopId);
                            toast.success("Vínculo removido");
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
        </CardContent>
      </Card>
    </div>
  );
}
