import React, { createContext, useContext, useState, useEffect } from "react";

export interface Student {
  id: string;
  name: string;
  age: number;
  school: string;
  workshopIds: string[];
}

interface StudentsContextType {
  students: Student[];
  addStudent: (student: Omit<Student, "id" | "workshopIds">) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  linkStudentToWorkshop: (studentId: string, workshopId: string) => void;
  unlinkStudentFromWorkshop: (studentId: string, workshopId: string) => void;
  getStudentsByWorkshop: (workshopId: string) => Student[];
}

const StudentsContext = createContext<StudentsContextType | undefined>(undefined);

export function StudentsProvider({ children }: { children: React.ReactNode }) {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const savedStudents = localStorage.getItem("ellp.students");
    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    } else {
      // Dados iniciais para demonstração
      const initialStudents: Student[] = [
        { id: "1", name: "João Silva", age: 12, school: "Escola Municipal A", workshopIds: ["1"] },
        { id: "2", name: "Maria Oliveira", age: 14, school: "Escola Estadual B", workshopIds: ["1", "2"] },
      ];
      setStudents(initialStudents);
      localStorage.setItem("ellp.students", JSON.stringify(initialStudents));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("ellp.students", JSON.stringify(students));
  }, [students]);

  const addStudent = (data: Omit<Student, "id" | "workshopIds">) => {
    const newStudent: Student = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      workshopIds: [],
    };
    setStudents((prev) => [...prev, newStudent]);
  };

  const updateStudent = (id: string, data: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...data } : s))
    );
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  const linkStudentToWorkshop = (studentId: string, workshopId: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId && !s.workshopIds.includes(workshopId)) {
          return { ...s, workshopIds: [...s.workshopIds, workshopId] };
        }
        return s;
      })
    );
  };

  const unlinkStudentFromWorkshop = (studentId: string, workshopId: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          return { ...s, workshopIds: s.workshopIds.filter((id) => id !== workshopId) };
        }
        return s;
      })
    );
  };

  const getStudentsByWorkshop = (workshopId: string) => {
    return students.filter((s) => s.workshopIds.includes(workshopId));
  };

  return (
    <StudentsContext.Provider
      value={{
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        linkStudentToWorkshop,
        unlinkStudentFromWorkshop,
        getStudentsByWorkshop,
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
