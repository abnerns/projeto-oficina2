import { render, screen } from "@testing-library/react";
import { WorkshopCard } from "@/components/workshops/WorkshopCard";
import { renderWithProviders, createMockTeachersValue } from "../helpers";

const baseWorkshop = {
  id: "w1",
  title: "Workshop de Teste",
  description: "Descricao completa do workshop para exibicao",
  date: "2026-06-18T00:00:00.000Z",
  teacherIds: ["t1"],
  studentCount: 5,
  createdAt: "2026-06-01",
};

describe("WorkshopCard", () => {
  it("renders workshop title and description", () => {
    renderWithProviders(<WorkshopCard workshop={baseWorkshop} onDelete={vi.fn()} />, {
      teachers: createMockTeachersValue({
        teachers: [{ id: "t1", name: "Prof João", expertise: "Matemática", color: "red" }],
      }),
    });
    expect(screen.getByText("Workshop de Teste")).toBeInTheDocument();
    expect(screen.getByText(/Descricao completa/)).toBeInTheDocument();
  });

  it("shows student count", () => {
    renderWithProviders(<WorkshopCard workshop={baseWorkshop} onDelete={vi.fn()} />, {
      teachers: createMockTeachersValue(),
    });
    expect(screen.getByText("5 alunos")).toBeInTheDocument();
  });

  it("shows singular student count when 1", () => {
    renderWithProviders(
      <WorkshopCard workshop={{ ...baseWorkshop, studentCount: 1 }} onDelete={vi.fn()} />,
      { teachers: createMockTeachersValue() }
    );
    expect(screen.getByText("1 aluno")).toBeInTheDocument();
  });

  it("shows teacher names", () => {
    renderWithProviders(<WorkshopCard workshop={baseWorkshop} onDelete={vi.fn()} />, {
      teachers: createMockTeachersValue({
        teachers: [{ id: "t1", name: "Prof João", expertise: "Matemática", color: "red" }],
      }),
    });
    expect(screen.getByText("1 professor")).toBeInTheDocument();
  });

  it("shows Sem professores when no teachers", () => {
    renderWithProviders(
      <WorkshopCard workshop={{ ...baseWorkshop, teacherIds: [] }} onDelete={vi.fn()} />,
      { teachers: createMockTeachersValue() }
    );
    expect(screen.getByText("Sem professores")).toBeInTheDocument();
  });

  it("calls onDelete when delete button is clicked", async () => {
    const onDelete = vi.fn();
    const { container } = renderWithProviders(<WorkshopCard workshop={baseWorkshop} onDelete={onDelete} />, {
      teachers: createMockTeachersValue(),
    });

    const deleteBtn = container.querySelector('[aria-label="Delete"]');
    expect(deleteBtn).toBeInTheDocument();
    deleteBtn!.click();
    expect(onDelete).toHaveBeenCalledWith(baseWorkshop);
  });
});
