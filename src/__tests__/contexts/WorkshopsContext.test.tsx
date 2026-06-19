import { render, screen, waitFor } from "@testing-library/react";
import { AuthContext } from "@/context/AuthContext";
import { WorkshopsProvider, useWorkshops } from "@/context/WorkshopsContext";
import { createMockAuthValue } from "../helpers";

const API_URL = "http://localhost:3333";

function TestComponent() {
  const { workshops, loading, create, update, remove, getById } = useWorkshops();
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="count">{workshops.length}</span>
      <ul data-testid="list">{workshops.map((w: any) => <li key={w.id}>{w.title}</li>)}</ul>
      <button onClick={async () => {
        await create({ title: "Nova", description: "Descricao com mais de 10 chars", date: "2026-01-01T00:00:00.000Z", teacherIds: [] });
      }} data-testid="create-btn">Create</button>
      <button onClick={async () => {
        if (workshops[0]) await update(workshops[0].id, { title: "Editada" });
      }} data-testid="update-btn">Update</button>
      <button onClick={async () => {
        if (workshops[0]) await remove(workshops[0].id);
      }} data-testid="remove-btn">Remove</button>
      <span data-testid="getById">{getById("none") ? "found" : "not-found"}</span>
    </div>
  );
}

describe("WorkshopsContext", () => {
  beforeEach(() => {
    vi.mocked(fetch).mockReset();
  });

  it("fetches workshops on mount and maps data correctly", async () => {
    const apiData = [
      { uuid: "w1", tema: "Workshop 1", descricao: "Desc", data: "2026-06-01", teacherIds: ["t1"], student_count: 5, created_at: "2026-05-01" },
      { uuid: "w2", tema: "Workshop 2", descricao: "Desc 2", data: "2026-07-01", teacherIds: [], student_count: 0, created_at: "2026-05-02" },
    ];
    vi.mocked(fetch).mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(apiData) } as any);

    render(
      <AuthContext.Provider value={createMockAuthValue()}>
        <WorkshopsProvider><TestComponent /></WorkshopsProvider>
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("count").textContent).toBe("2");
    });
    expect(screen.getByText("Workshop 1")).toBeInTheDocument();
    expect(screen.getByText("Workshop 2")).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/get-oficinas`);
  });

  it("create calls POST /create-oficina", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) } as any)
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ id: "w-new" }) } as any);

    render(
      <AuthContext.Provider value={createMockAuthValue()}>
        <WorkshopsProvider><TestComponent /></WorkshopsProvider>
      </AuthContext.Provider>
    );

    await waitFor(() => expect(screen.getByTestId("count").textContent).toBe("0"));
    const btn = screen.getByTestId("create-btn");
    btn.click();
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(`${API_URL}/create-oficina`, expect.objectContaining({ method: "POST" }));
    });
  });

  it("remove calls DELETE /delete-oficina/:id", async () => {
    const apiData = [{ uuid: "w1", tema: "Test", descricao: "Descricao longa", data: "2026-01-01", teacherIds: [], student_count: 0, created_at: "2026-01-01" }];
    vi.mocked(fetch)
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(apiData) } as any)
      .mockResolvedValueOnce({ ok: true } as any);

    render(
      <AuthContext.Provider value={createMockAuthValue()}>
        <WorkshopsProvider><TestComponent /></WorkshopsProvider>
      </AuthContext.Provider>
    );

    await waitFor(() => expect(screen.getByTestId("count").textContent).toBe("1"));
    screen.getByTestId("remove-btn").click();
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(`${API_URL}/delete-oficina/w1`, expect.objectContaining({ method: "DELETE" }));
    });
  });
});
