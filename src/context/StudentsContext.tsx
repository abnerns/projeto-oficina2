import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";

export interface Student {
  id: string;
  name: string;
  age: number;
  school: string;
  workshopIds: string[];
}

interface StudentsContextType {
  students: Student[];
  loading: boolean;
  addStudent: (data: Omit<Student, "id" | "workshopIds">) => Promise<void>;
  addStudentsBySchool: (data: { escola: string; nomes: string[]; idade?: number }) => Promise<void>;
  updateStudent: (id: string, data: Partial<Student>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  linkStudentToWorkshop: (studentId: string, workshopId: string) => Promise<void>;
  linkStudentsToWorkshop: (studentIds: string[], workshopId: string) => Promise<void>;
  unlinkStudentFromWorkshop: (studentId: string, workshopId: string) => Promise<void>;
  getStudentsByWorkshop: (workshopId: string) => Student[];
  refresh: () => Promise<void>;
}

export const StudentsContext = createContext<StudentsContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

export function StudentsProvider({ children }: { children: React.ReactNode }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const { getToken, isAuthenticated } = useAuth();

  const fetchStudents = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/get-alunos`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (response.ok) {
        const data = await response.json();
        const mapped: Student[] = data.map((a: any) => ({
          id: a.uuid,
          name: a.nome,
          age: a.idade,
          school: a.escola,
          workshopIds: a.workshopIds || [],
        }));
        setStudents(mapped);
      }
    } catch (error) {
      console.error("Erro ao buscar alunos:", error);
    } finally {
      setLoading(false);
    }
  }, [getToken, isAuthenticated]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const addStudent = async (data: Omit<Student, "id" | "workshopIds">) => {
    const token = await getToken();
    const response = await fetch(`${API_URL}/create-aluno`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ nome: data.name, idade: data.age, escola: data.school }),
    });
    if (!response.ok) throw new Error("Erro ao criar aluno");
    await fetchStudents();
  };

  const addStudentsBySchool = async (data: { escola: string; nomes: string[]; idade?: number }) => {
    const token = await getToken();
    const response = await fetch(`${API_URL}/create-alunos-batch`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ escola: data.escola, nomes: data.nomes, idade: data.idade }),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: "Erro ao criar alunos" }));
      throw new Error(err.error || "Erro ao criar alunos");
    }
    await fetchStudents();
  };

  const updateStudent = async (id: string, data: Partial<Student>) => {
    const token = await getToken();
    const response = await fetch(`${API_URL}/update-aluno/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ nome: data.name, idade: data.age, escola: data.school }),
    });
    if (!response.ok) throw new Error("Erro ao atualizar aluno");
    await fetchStudents();
  };

  const deleteStudent = async (id: string) => {
    const token = await getToken();
    const response = await fetch(`${API_URL}/delete-aluno/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Erro ao deletar aluno");
    await fetchStudents();
  };

  const linkStudentToWorkshop = async (studentId: string, workshopId: string) => {
    const token = await getToken();
    const response = await fetch(`${API_URL}/enroll-aluno`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ alunoId: studentId, oficinaId: workshopId }),
    });
    if (!response.ok) throw new Error("Erro ao vincular aluno");
    await fetchStudents();
  };

  const linkStudentsToWorkshop = async (studentIds: string[], workshopId: string) => {
    const token = await getToken();
    const response = await fetch(`${API_URL}/enroll-alunos-batch`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ alunoIds: studentIds, oficinaId: workshopId }),
    });
    if (!response.ok) throw new Error("Erro ao vincular alunos");
    await fetchStudents();
  };

  const unlinkStudentFromWorkshop = async (studentId: string, workshopId: string) => {
    const token = await getToken();
    const response = await fetch(`${API_URL}/unenroll-aluno`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ alunoId: studentId, oficinaId: workshopId }),
    });
    if (!response.ok) throw new Error("Erro ao remover vínculo");
    await fetchStudents();
  };

  const getStudentsByWorkshop = (workshopId: string) => {
    return students.filter((s) => s.workshopIds.includes(workshopId));
  };

  return (
      <StudentsContext.Provider
      value={{
        students,
        loading,
        addStudent,
        addStudentsBySchool,
        updateStudent,
        deleteStudent,
        linkStudentToWorkshop,
        linkStudentsToWorkshop,
        unlinkStudentFromWorkshop,
        getStudentsByWorkshop,
        refresh: fetchStudents,
      }}
    >
      {children}
    </StudentsContext.Provider>
  );
}

export function useStudents() {
  const context = useContext(StudentsContext);
  if (context === undefined) {
    throw new Error("useStudents must be used within a StudentsProvider");
  }
  return context;
}
