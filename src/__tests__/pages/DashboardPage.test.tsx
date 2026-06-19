import { render, screen } from "@testing-library/react";
import { Dashboard } from "@/routes/_app.index";
import { renderWithProviders, createMockWorkshopsValue, createMockStudentsValue, createMockTeachersValue } from "../helpers";

const mockWorkshops = [
  { id: "w1", title: "Oficina Recente", description: "Descricao longa", date: "2026-06-18T00:00:00.000Z", teacherIds: ["t1"], studentCount: 5, createdAt: "2026-06-18T00:00:00.000Z" },
  { id: "w2", title: "Oficina Antiga", description: "Outra descricao", date: "2026-05-01T00:00:00.000Z", teacherIds: ["t2"], studentCount: 3, createdAt: "2026-05-01T00:00:00.000Z" },
];

const mockTeachers = [
  { id: "t1", name: "Prof João", expertise: "Matemática", color: "red" },
  { id: "t2", name: "Prof Maria", expertise: "Português", color: "blue" },
];

describe("Dashboard", () => {
  it("renders welcome message with user name", () => {
    renderWithProviders(<Dashboard />, {
      auth: { user: { id: "1", name: "Admin Teste", email: "admin@test.com", role: "admin" as const } },
    });
    expect(screen.getByText(/Admin/)).toBeInTheDocument();
  });

  it("renders stat cards", () => {
    renderWithProviders(<Dashboard />, {
      workshops: createMockWorkshopsValue({ workshops: mockWorkshops }),
      students: createMockStudentsValue({ students: [{ id: "s1", name: "A", age: 10, school: "S", workshopIds: [] }] }),
      teachers: createMockTeachersValue({ teachers: mockTeachers }),
    });

    expect(screen.getByText("Total de Oficinas")).toBeInTheDocument();
    expect(screen.getByText("Total de Alunos")).toBeInTheDocument();
    expect(screen.getByText("Professores Ativos")).toBeInTheDocument();
    expect(screen.getByText("Alunos por Oficina")).toBeInTheDocument();
  });

  it("renders correct total in stat cards", () => {
    renderWithProviders(<Dashboard />, {
      workshops: createMockWorkshopsValue({ workshops: mockWorkshops }),
      students: createMockStudentsValue({
        students: Array.from({ length: 8 }, (_, i) => ({ id: `s${i}`, name: `S${i}`, age: 10, school: "S", workshopIds: [] })),
      }),
      teachers: createMockTeachersValue({ teachers: mockTeachers }),
    });

    expect(screen.getAllByText("2").length).toBeGreaterThanOrEqual(1); // Total de Oficinas
    expect(screen.getByText("8")).toBeInTheDocument(); // Total de Alunos
  });

  it("renders top teachers section", () => {
    renderWithProviders(<Dashboard />, {
      workshops: createMockWorkshopsValue({ workshops: mockWorkshops }),
      teachers: createMockTeachersValue({ teachers: mockTeachers }),
    });

    expect(screen.getByText("Top professores")).toBeInTheDocument();
    expect(screen.getByText("Prof João")).toBeInTheDocument();
    expect(screen.getByText("Prof Maria")).toBeInTheDocument();
  });

  it("renders recent workshops section", () => {
    renderWithProviders(<Dashboard />, {
      workshops: createMockWorkshopsValue({ workshops: mockWorkshops }),
      teachers: createMockTeachersValue({ teachers: mockTeachers }),
    });

    expect(screen.getByText("Criadas recentemente")).toBeInTheDocument();
    expect(screen.getByText("Oficina Recente")).toBeInTheDocument();
  });

  it("shows Nova oficina button linking to creation page", () => {
    renderWithProviders(<Dashboard />);
    const novaBtn = screen.getByText("Nova oficina");
    expect(novaBtn).toBeInTheDocument();
    expect(novaBtn.closest("a")).toHaveAttribute("href", "/workshops/new");
  });

  it("shows Ver todas link", () => {
    renderWithProviders(<Dashboard />);
    const verTodas = screen.getByText("Ver todas");
    expect(verTodas).toBeInTheDocument();
    expect(verTodas.closest("a")).toHaveAttribute("href", "/workshops");
  });
});
