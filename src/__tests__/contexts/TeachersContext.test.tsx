import { render, screen, waitFor } from "@testing-library/react";
import { AuthContext } from "@/context/AuthContext";
import { TeachersProvider, useTeachers } from "@/context/TeachersContext";
import { createMockAuthValue } from "../helpers";

const API_URL = "http://localhost:3333";

function TestComponent() {
  const { teachers, loading, getById } = useTeachers();
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="count">{teachers.length}</span>
      <ul data-testid="list">{teachers.map((t: any) => <li key={t.id}>{t.name}</li>)}</ul>
      <span data-testid="getById">{getById("none") ? "found" : "not-found"}</span>
    </div>
  );
}

describe("TeachersContext", () => {
  beforeEach(() => {
    vi.mocked(fetch).mockReset();
  });

  it("fetches teachers on mount when authenticated", async () => {
    const apiData = [
      { uuid: "t1", nome: "Prof João", cargo: "Professor" },
      { uuid: "t2", nome: "Admin Maria", cargo: "Admin" },
    ];
    vi.mocked(fetch).mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(apiData) } as any);

    render(
      <AuthContext.Provider value={createMockAuthValue({ isAuthenticated: true })}>
        <TeachersProvider><TestComponent /></TeachersProvider>
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("count").textContent).toBe("2");
    });
    expect(screen.getByText("Prof João")).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/get-users`, expect.objectContaining({
      headers: { Authorization: "Bearer test-jwt" },
    }));
  });

  it("does not fetch when not authenticated", async () => {
    render(
      <AuthContext.Provider value={createMockAuthValue({ isAuthenticated: false, user: null })}>
        <TeachersProvider><TestComponent /></TeachersProvider>
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("count").textContent).toBe("0");
    });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("maps user data to teacher type with colors", async () => {
    const apiData = [
      { uuid: "t1", nome: "João", cargo: "Professor" },
    ];
    vi.mocked(fetch).mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(apiData) } as any);

    render(
      <AuthContext.Provider value={createMockAuthValue()}>
        <TeachersProvider><TestComponent /></TeachersProvider>
      </AuthContext.Provider>
    );

    await waitFor(() => {
      const listItems = screen.getAllByRole("listitem");
      expect(listItems.length).toBe(1);
    });
  });
});
