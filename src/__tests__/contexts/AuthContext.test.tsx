import { render, screen, waitFor } from "@testing-library/react";
import { act } from "react";
import { AuthProvider, useAuth } from "@/context/AuthContext";

const API_URL = "http://localhost:3333";

describe("AuthContext", () => {
  beforeEach(() => {
    vi.mocked(fetch).mockReset();
  });

  it("login calls /login/local with email and password", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        usuario: { uuid: "1", nome: "Admin", email: "admin@test.com", cargo: "Admin" },
        token: "jwt-token",
      }),
    } as any);

    let capturedLogin: ((e: string, p: string) => Promise<void>) | null = null;
    function Test() {
      const { login } = useAuth();
      capturedLogin = login;
      return null;
    }

    render(<AuthProvider><Test /></AuthProvider>);
    await waitFor(() => expect(capturedLogin).not.toBeNull());

    await act(async () => {
      await capturedLogin!("admin@test.com", "123");
    });

    expect(fetch).toHaveBeenCalledWith(`${API_URL}/login/local`, expect.objectContaining({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@test.com", senha: "123" }),
    }));
  });

  it("register calls POST /registrar with user data", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: true } as any);

    let capturedRegister: any = null;
    function Test() {
      const { register } = useAuth();
      capturedRegister = register;
      return null;
    }

    render(<AuthProvider><Test /></AuthProvider>);
    await waitFor(() => expect(capturedRegister).not.toBeNull());

    await act(async () => {
      await capturedRegister({ nome: "João", email: "joao@test.com", senha: "123", cargo: "Professor" });
    });

    expect(fetch).toHaveBeenCalledWith(`${API_URL}/registrar`, expect.objectContaining({
      method: "POST",
      body: JSON.stringify({ nome: "João", email: "joao@test.com", senha: "123", cargo: "Professor" }),
    }));
  });

  it("register throws error when API returns error", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: "Email já existe" }),
    } as any);

    let capturedRegister: any = null;
    function Test() {
      const { register } = useAuth();
      capturedRegister = register;
      return null;
    }

    render(<AuthProvider><Test /></AuthProvider>);
    await waitFor(() => expect(capturedRegister).not.toBeNull());

    await expect(
      act(async () => capturedRegister({ nome: "João", email: "exists@test.com", senha: "123" }))
    ).rejects.toThrow("Email já existe");
  });

  it("logout removes user from localStorage", async () => {
    localStorage.setItem("ellp.user", JSON.stringify({ id: "1", name: "User", localAuth: true }));

    let capturedLogout: (() => void) | null = null;
    function Test() {
      const { logout } = useAuth();
      capturedLogout = logout;
      return null;
    }

    render(<AuthProvider><Test /></AuthProvider>);
    await waitFor(() => expect(capturedLogout).not.toBeNull());

    act(() => { capturedLogout!(); });

    expect(localStorage.getItem("ellp.user")).toBeNull();
  });

  it("getToken returns token from localStorage when no Firebase user", async () => {
    localStorage.setItem("ellp.user", JSON.stringify({ id: "1", name: "T", token: "saved-jwt", localAuth: true }));

    let capturedGetToken: (() => Promise<string | null>) | null = null;
    function Test() {
      const { getToken } = useAuth();
      capturedGetToken = getToken;
      return null;
    }

    render(<AuthProvider><Test /></AuthProvider>);
    await waitFor(() => expect(capturedGetToken).not.toBeNull());

    const token = await capturedGetToken!();
    expect(token).toBe("saved-jwt");
  });
});
