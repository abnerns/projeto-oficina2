import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RegisterPage } from "@/routes/register";
import { renderWithProviders, createMockAuthValue } from "../helpers";
import { AuthContext } from "@/context/AuthContext";

describe("RegisterPage", () => {
  it("renders registration form with all fields", () => {
    renderWithProviders(<RegisterPage />);
    expect(screen.getByText("Cadastro")).toBeInTheDocument();
    expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByText("Criar conta")).toBeInTheDocument();
  });

  it("renders profile selection (Professor/Admin)", () => {
    renderWithProviders(<RegisterPage />);
    const options = screen.getAllByText(/Professor\/Tutor|Administrador/);
    expect(options.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("Administrador")).toBeInTheDocument();
  });

  it("calls register with form data on submit", async () => {
    const mockRegister = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(
      <AuthContext.Provider value={createMockAuthValue({ register: mockRegister })}>
        <RegisterPage />
      </AuthContext.Provider>
    );

    await user.type(screen.getByLabelText(/nome completo/i), "João Silva");
    await user.type(screen.getByLabelText(/e-mail/i), "joao@test.com");
    await user.type(screen.getByLabelText(/senha/i), "123456");
    await user.click(screen.getByRole("button", { name: /criar conta/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        nome: "João Silva",
        email: "joao@test.com",
        senha: "123456",
        cargo: "Professor",
      });
    });
  });

  it("renders Google signup button", () => {
    renderWithProviders(<RegisterPage />);
    expect(screen.getByText("Continuar com Google")).toBeInTheDocument();
  });

  it("has link to login page", () => {
    renderWithProviders(<RegisterPage />);
    expect(screen.getByText("Faça login")).toBeInTheDocument();
  });
});
