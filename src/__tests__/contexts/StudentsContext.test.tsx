import { render, screen, waitFor } from "@testing-library/react";
import { AuthContext } from "@/context/AuthContext";
import { StudentsProvider, useStudents } from "@/context/StudentsContext";
import { createMockAuthValue } from "../helpers";

const API_URL = "http://localhost:3333";

function TestComponent() {
  const { students, loading, addStudent, deleteStudent, linkStudentToWorkshop, unlinkStudentFromWorkshop, getStudentsByWorkshop } = useStudents();
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="count">{students.length}</span>
      <ul data-testid="list">{students.map((s: any) => <li key={s.id}>{s.name}</li>)}</ul>
      <button onClick={async () => { await addStudent({ name: "Novo", age: 10, school: "Escola X" }); }} data-testid="add-btn">Add</button>
      <button onClick={async () => { await deleteStudent("s1"); }} data-testid="delete-btn">Delete</button>
      <button onClick={async () => { await linkStudentToWorkshop("s1", "w1"); }} data-testid="link-btn">Link</button>
      <button onClick={async () => { await unlinkStudentFromWorkshop("s1", "w1"); }} data-testid="unlink-btn">Unlink</button>
      <span data-testid="filtered">{getStudentsByWorkshop("w1").length}</span>
    </div>
  );
}

describe("StudentsContext", () => {
  beforeEach(() => {
    vi.mocked(fetch).mockReset();
  });

  it("fetches students on mount when authenticated", async () => {
    const apiData = [
      { uuid: "s1", nome: "João", idade: 12, escola: "Escola A", workshopIds: ["w1"] },
      { uuid: "s2", nome: "Maria", idade: 10, escola: "Escola B", workshopIds: [] },
    ];
    vi.mocked(fetch).mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(apiData) } as any);

    render(
      <AuthContext.Provider value={createMockAuthValue()}>
        <StudentsProvider><TestComponent /></StudentsProvider>
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("count").textContent).toBe("2");
    });
    expect(screen.getByText("João")).toBeInTheDocument();
    expect(screen.getByText("Maria")).toBeInTheDocument();
  });

  it("addStudent calls POST /create-aluno", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) } as any)
      .mockResolvedValueOnce({ ok: true } as any)
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) } as any);

    render(
      <AuthContext.Provider value={createMockAuthValue()}>
        <StudentsProvider><TestComponent /></StudentsProvider>
      </AuthContext.Provider>
    );

    await waitFor(() => expect(screen.getByTestId("count").textContent).toBe("0"));
    screen.getByTestId("add-btn").click();

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(`${API_URL}/create-aluno`, expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ nome: "Novo", idade: 10, escola: "Escola X" }),
      }));
    });
  });

  it("deleteStudent calls DELETE /delete-aluno/:id", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) } as any)
      .mockResolvedValueOnce({ ok: true } as any);

    render(
      <AuthContext.Provider value={createMockAuthValue()}>
        <StudentsProvider><TestComponent /></StudentsProvider>
      </AuthContext.Provider>
    );

    await waitFor(() => expect(screen.getByTestId("count").textContent).toBe("0"));
    screen.getByTestId("delete-btn").click();

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(`${API_URL}/delete-aluno/s1`, expect.objectContaining({ method: "DELETE" }));
    });
  });

  it("linkStudentToWorkshop calls POST /enroll-aluno", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) } as any)
      .mockResolvedValueOnce({ ok: true } as any)
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) } as any);

    render(
      <AuthContext.Provider value={createMockAuthValue()}>
        <StudentsProvider><TestComponent /></StudentsProvider>
      </AuthContext.Provider>
    );

    await waitFor(() => expect(screen.getByTestId("count").textContent).toBe("0"));
    screen.getByTestId("link-btn").click();

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(`${API_URL}/enroll-aluno`, expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ alunoId: "s1", oficinaId: "w1" }),
      }));
    });
  });

  it("unlinkStudentFromWorkshop calls DELETE /unenroll-aluno", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) } as any)
      .mockResolvedValueOnce({ ok: true } as any);

    render(
      <AuthContext.Provider value={createMockAuthValue()}>
        <StudentsProvider><TestComponent /></StudentsProvider>
      </AuthContext.Provider>
    );

    await waitFor(() => expect(screen.getByTestId("count").textContent).toBe("0"));
    screen.getByTestId("unlink-btn").click();

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(`${API_URL}/unenroll-aluno`, expect.objectContaining({
        method: "DELETE",
        body: JSON.stringify({ alunoId: "s1", oficinaId: "w1" }),
      }));
    });
  });
});
