import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WorkshopForm } from "@/components/workshops/WorkshopForm";
import { renderWithProviders, createMockWorkshopsValue, createMockAuthValue } from "../helpers";
import { AuthContext } from "@/context/AuthContext";
import { WorkshopsContext } from "@/context/WorkshopsContext";

describe("WorkshopForm", () => {
  it("renders all form fields in create mode", () => {
    renderWithProviders(<WorkshopForm mode="create" />);
    expect(screen.getByText("Nova Oficina")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e\.g\./)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/O que os participantes/)).toBeInTheDocument();
    expect(screen.getByText("Criar Oficina")).toBeInTheDocument();
  });

  it("shows validation errors when submitting empty form", async () => {
    const user = userEvent.setup();
    renderWithProviders(<WorkshopForm mode="create" />);

    await user.click(screen.getByText("Criar Oficina"));
    expect(screen.getByText("Titulo é obrigatório")).toBeInTheDocument();
    expect(screen.getByText("Descrição é obrigatória")).toBeInTheDocument();
    expect(screen.getByText("Data é obrigatória")).toBeInTheDocument();
    expect(screen.getByText("Selecione pelo menos um professor")).toBeInTheDocument();
  });

  it("shows title validation error when title is too short", async () => {
    const user = userEvent.setup();
    renderWithProviders(<WorkshopForm mode="create" />);

    await user.type(screen.getByPlaceholderText(/e\.g\./), "AB");
    await user.click(screen.getByText("Criar Oficina"));
    expect(screen.getByText("Pelo menos 3 caracteres")).toBeInTheDocument();
  });

  it("shows description validation error when description is too short", async () => {
    const user = userEvent.setup();
    renderWithProviders(<WorkshopForm mode="create" />);

    await user.type(screen.getByPlaceholderText(/O que os participantes/), "Curta");
    await user.click(screen.getByText("Criar Oficina"));
    expect(screen.getByText("Pelo menos 10 caracteres")).toBeInTheDocument();
  });

  it("calls create with correct payload on valid submit", async () => {
    const mockCreate = vi.fn().mockResolvedValue({ id: "w-new", title: "Oficina Teste", description: "Descricao longa aqui com mais de 10", date: "2026-06-18", teacherIds: ["t1"], studentCount: 0, createdAt: "2026-06-18" });
    const user = userEvent.setup();

    renderWithProviders(<WorkshopForm mode="create" />, {
      workshops: createMockWorkshopsValue({ create: mockCreate }),
      teachers: { teachers: [{ id: "t1", name: "Prof João", expertise: "Matemática", color: "red" }] },
    });

    await user.type(screen.getByPlaceholderText(/e\.g\./), "Oficina Teste");
    await user.type(screen.getByPlaceholderText(/O que os participantes/), "Descricao longa aqui com mais de 10");

    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("shows edit mode title when editing", () => {
    const existingWorkshop = {
      id: "w1",
      title: "Workshop Existente",
      description: "Descricao bem longa para passar na validacao",
      date: "2026-06-01T00:00:00.000Z",
      teacherIds: ["t1"],
      studentCount: 3,
      createdAt: "2026-05-01",
    };

    renderWithProviders(<WorkshopForm mode="edit" id="w1" />, {
      workshops: createMockWorkshopsValue({
        getById: vi.fn().mockReturnValue(existingWorkshop),
        workshops: [existingWorkshop],
      }),
    });

    expect(screen.getByText("Editar Oficina")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Workshop Existente")).toBeInTheDocument();
  });

  it("shows not found message when editing non-existent workshop", () => {
    renderWithProviders(<WorkshopForm mode="edit" id="nonexistent" />, {
      workshops: createMockWorkshopsValue({ loading: false, getById: vi.fn().mockReturnValue(undefined) }),
    });

    expect(screen.getByText("Oficina não encontrada")).toBeInTheDocument();
  });
});
