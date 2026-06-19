import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CertificatesPage } from "@/routes/_app.certificates";
import { renderWithProviders, createMockWorkshopsValue, createMockStudentsValue } from "../helpers";

const mockWorkshops = [
  { id: "w1", title: "Oficina de Matemática", description: "Desc", date: "2026-06-01", teacherIds: [], studentCount: 2, createdAt: "2026-05-01" },
  { id: "w2", title: "Oficina de Português", description: "Desc", date: "2026-07-01", teacherIds: [], studentCount: 0, createdAt: "2026-05-15" },
];

const mockStudents = [
  { id: "s1", name: "João Aluno", age: 12, school: "Escola A", workshopIds: ["w1"] },
  { id: "s2", name: "Maria Aluna", age: 11, school: "Escola B", workshopIds: ["w1"] },
];

describe("CertificatesPage", () => {
  beforeEach(() => {
    vi.mocked(fetch).mockReset();
  });

  it("renders page title", () => {
    renderWithProviders(<CertificatesPage />);
    expect(screen.getByText("Certificados")).toBeInTheDocument();
  });

  it("shows loading state", () => {
    renderWithProviders(<CertificatesPage />, {
      workshops: createMockWorkshopsValue({ loading: true, workshops: [] }),
    });
    expect(screen.getByText("Carregando...")).toBeInTheDocument();
  });

  it("shows empty state when no workshops", () => {
    renderWithProviders(<CertificatesPage />, {
      workshops: createMockWorkshopsValue({ workshops: [], loading: false }),
    });
    expect(screen.getByText("Nenhuma oficina cadastrada.")).toBeInTheDocument();
  });

  it("displays workshops with student links", () => {
    renderWithProviders(<CertificatesPage />, {
      workshops: createMockWorkshopsValue({ workshops: mockWorkshops, loading: false }),
      students: createMockStudentsValue({
        students: mockStudents,
        getStudentsByWorkshop: vi.fn((wid: string) => mockStudents.filter(s => s.workshopIds.includes(wid))),
      }),
    });

    expect(screen.getByText("Oficina de Matemática")).toBeInTheDocument();
    expect(screen.getByText("2 alunos")).toBeInTheDocument();
    expect(screen.getByText("João Aluno")).toBeInTheDocument();
    expect(screen.getByText("Maria Aluna")).toBeInTheDocument();
  });

  it("shows 'Nenhum aluno vinculado' when workshop has no students", () => {
    renderWithProviders(<CertificatesPage />, {
      workshops: createMockWorkshopsValue({ workshops: mockWorkshops, loading: false }),
      students: createMockStudentsValue({
        students: [],
        getStudentsByWorkshop: vi.fn().mockReturnValue([]),
      }),
    });

    // w2 has no students
    expect(screen.getAllByText("Nenhum aluno vinculado a esta oficina.").length).toBeGreaterThanOrEqual(1);
  });

  it("filters workshops by search input", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CertificatesPage />, {
      workshops: createMockWorkshopsValue({ workshops: mockWorkshops, loading: false }),
      students: createMockStudentsValue({
        students: mockStudents,
        getStudentsByWorkshop: vi.fn().mockReturnValue([]),
      }),
    });

    await user.type(screen.getByPlaceholderText("Buscar oficina..."), "Matemática");

    expect(screen.getByText("Oficina de Matemática")).toBeInTheDocument();
    expect(screen.queryByText("Oficina de Português")).not.toBeInTheDocument();
  });

  it("downloads PDF when clicking download button", async () => {
    const blobMock = new Blob(["fake-pdf"], { type: "application/pdf" });
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      blob: () => Promise.resolve(blobMock),
    } as any);

    const createObjectURL = vi.fn().mockReturnValue("blob:test");
    globalThis.URL.createObjectURL = createObjectURL;
    globalThis.URL.revokeObjectURL = vi.fn();

    const user = userEvent.setup();
    renderWithProviders(<CertificatesPage />, {
      workshops: createMockWorkshopsValue({ workshops: mockWorkshops, loading: false }),
      students: createMockStudentsValue({
        students: mockStudents,
        getStudentsByWorkshop: vi.fn((wid: string) => mockStudents.filter(s => s.workshopIds.includes(wid))),
      }),
    });

    const pdfButtons = screen.getAllByText("PDF");
    await user.click(pdfButtons[0]);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
  });

  it("shows 'Gerando...' while certificate is being generated", async () => {
    vi.mocked(fetch).mockImplementationOnce(() => new Promise(() => {}));

    const user = userEvent.setup();
    renderWithProviders(<CertificatesPage />, {
      workshops: createMockWorkshopsValue({ workshops: mockWorkshops, loading: false }),
      students: createMockStudentsValue({
        students: mockStudents,
        getStudentsByWorkshop: vi.fn((wid: string) => mockStudents.filter(s => s.workshopIds.includes(wid))),
      }),
    });

    const pdfButtons = screen.getAllByText("PDF");
    await user.click(pdfButtons[0]);

    expect(screen.getByText("Gerando...")).toBeInTheDocument();
  });
});
