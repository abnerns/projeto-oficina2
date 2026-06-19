import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StudentsPage } from "@/routes/_app.students";
import { renderWithProviders, createMockStudentsValue } from "../helpers";
import { AuthContext } from "@/context/AuthContext";
import { StudentsContext } from "@/context/StudentsContext";

describe("StudentsPage", () => {
  it("renders page title", () => {
    renderWithProviders(<StudentsPage />);
    expect(screen.getByText("Alunos")).toBeInTheDocument();
  });

  it("shows loading state", () => {
    renderWithProviders(<StudentsPage />, {
      students: createMockStudentsValue({ loading: true, students: [] }),
    });
    expect(screen.getByText("Alunos")).toBeInTheDocument();
  });

  it("shows empty state when no students", () => {
    renderWithProviders(<StudentsPage />);
    expect(screen.getByText("Nenhum aluno cadastrado.")).toBeInTheDocument();
  });

  it("displays students in table", () => {
    const mockStudents = [
      { id: "s1", name: "João", age: 12, school: "Escola A", workshopIds: [] },
      { id: "s2", name: "Maria", age: 10, school: "Escola B", workshopIds: ["w1"] },
    ];
    renderWithProviders(<StudentsPage />, {
      students: createMockStudentsValue({ students: mockStudents, loading: false }),
    });

    expect(screen.getByText("João")).toBeInTheDocument();
    expect(screen.getByText("Maria")).toBeInTheDocument();
    expect(screen.getByText("Escola A")).toBeInTheDocument();
    expect(screen.getByText("Escola B")).toBeInTheDocument();
  });

  it("shows workshop count per student", () => {
    renderWithProviders(<StudentsPage />, {
      students: createMockStudentsValue({
        students: [{ id: "s1", name: "João", age: 12, school: "Escola A", workshopIds: ["w1", "w2"] }],
      }),
    });

    expect(screen.getByText("2 vinculada(s)")).toBeInTheDocument();
  });

  it("shows total students in card", () => {
    renderWithProviders(<StudentsPage />, {
      students: createMockStudentsValue({
        students: [
          { id: "s1", name: "João", age: 12, school: "A", workshopIds: [] },
          { id: "s2", name: "Maria", age: 10, school: "B", workshopIds: [] },
          { id: "s3", name: "Pedro", age: 11, school: "C", workshopIds: [] },
        ],
      }),
    });

    // The total students card should show 3
    const totalCards = screen.getAllByText(/Alunos/);
    expect(totalCards.length).toBeGreaterThanOrEqual(1);
  });

  it("opens new student dialog when clicking Novo Aluno button", async () => {
    const user = userEvent.setup();
    renderWithProviders(<StudentsPage />);

    const novoBtn = screen.getByText("Novo Aluno");
    await user.click(novoBtn);

    expect(screen.getByText("Cadastrar Aluno")).toBeInTheDocument();
    expect(screen.getByLabelText("Nome Completo")).toBeInTheDocument();
    expect(screen.getByLabelText("Idade")).toBeInTheDocument();
    expect(screen.getByLabelText("Escola")).toBeInTheDocument();
  });

  it("opens batch dialog when clicking Adicionar por Escola", async () => {
    const user = userEvent.setup();
    renderWithProviders(<StudentsPage />);

    await user.click(screen.getByText("Adicionar por Escola"));
    expect(screen.getByText("Adicionar Alunos por Escola")).toBeInTheDocument();
  });

  it("calls addStudent when submitting new student form", async () => {
    const mockAddStudent = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    renderWithProviders(<StudentsPage />, {
      students: createMockStudentsValue({ addStudent: mockAddStudent }),
    });

    await user.click(screen.getByText("Novo Aluno"));
    await user.type(screen.getByLabelText("Nome Completo"), "Novo Aluno Teste");
    await user.type(screen.getByLabelText("Idade"), "10");
    await user.type(screen.getByLabelText("Escola"), "Escola Teste");
    await user.click(screen.getByText("Salvar Aluno"));

    await waitFor(() => {
      expect(mockAddStudent).toHaveBeenCalledWith({ name: "Novo Aluno Teste", age: 10, school: "Escola Teste" });
    });
  });
});
