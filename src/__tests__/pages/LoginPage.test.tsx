import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginPage } from "@/routes/login";
import { renderWithProviders, createMockAuthValue } from "../helpers";
import { AuthContext } from "@/context/AuthContext";
import { toast } from "sonner";

describe("LoginPage", () => {
  it("renders login form with email, password and submit button", () => {
    renderWithProviders(<LoginPage />);
    expect(screen.getAllByText("Entrar").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByText("ELLP")).toBeInTheDocument();
  });

  it("shows error toast when submitting with empty fields", () => {
    renderWithProviders(<LoginPage />);

    const form = document.querySelector("form")!;
    fireEvent.submit(form);

    expect(toast.error).toHaveBeenCalledWith("Por favor, preencha todos os campos.");
  });

  it("calls login with credentials on submit", async () => {
    const mockLogin = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(
      <AuthContext.Provider value={createMockAuthValue({ login: mockLogin, isAuthenticated: false })}>
        <LoginPage />
      </AuthContext.Provider>
    );

    await user.type(screen.getByLabelText(/e-mail/i), "user@test.com");
    await user.type(screen.getByLabelText(/senha/i), "123456");
    await user.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("user@test.com", "123456");
    });
  });

  it("renders Google login button", () => {
    renderWithProviders(<LoginPage />);
    expect(screen.getByText("Google")).toBeInTheDocument();
  });

  it("has link to register page", () => {
    renderWithProviders(<LoginPage />);
    expect(screen.getByText("Cadastre-se")).toBeInTheDocument();
  });

  it("shows loading state while submitting", async () => {
    const mockLogin = vi.fn().mockImplementation(() => new Promise(() => {}));
    const user = userEvent.setup();

    render(
      <AuthContext.Provider value={createMockAuthValue({ login: mockLogin, isAuthenticated: false })}>
        <LoginPage />
      </AuthContext.Provider>
    );

    await user.type(screen.getByLabelText(/e-mail/i), "user@test.com");
    await user.type(screen.getByLabelText(/senha/i), "123456");
    await user.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => {
      expect(screen.getByText("Entrando...")).toBeInTheDocument();
    });
  });
});
