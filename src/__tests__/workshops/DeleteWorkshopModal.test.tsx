import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DeleteWorkshopModal } from "@/components/workshops/DeleteWorkshopModal";

const workshop = {
  id: "w1",
  title: "Oficina para Deletar",
  description: "Desc",
  date: "2026-01-01",
  teacherIds: ["t1"],
  studentCount: 2,
  createdAt: "2026-01-01",
};

describe("DeleteWorkshopModal", () => {
  it("renders nothing when workshop is null", () => {
    const { container } = render(
      <DeleteWorkshopModal workshop={null} onCancel={vi.fn()} onConfirm={vi.fn()} />
    );
    expect(container.textContent).toBe("");
  });

  it("renders workshop title in confirmation message", () => {
    render(
      <DeleteWorkshopModal workshop={workshop} onCancel={vi.fn()} onConfirm={vi.fn()} />
    );
    expect(screen.getByText(/Oficina para Deletar/)).toBeInTheDocument();
    const heading = screen.getByRole("heading", { name: /Deletar Oficina/i });
    expect(heading).toBeInTheDocument();
  });

  it("calls onCancel when cancel button is clicked", async () => {
    const onCancel = vi.fn();
    const user = userEvent.setup();
    render(
      <DeleteWorkshopModal workshop={workshop} onCancel={onCancel} onConfirm={vi.fn()} />
    );

    await user.click(screen.getByText("Cancelar"));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("calls onConfirm when delete button is clicked", async () => {
    const onConfirm = vi.fn();
    const user = userEvent.setup();
    render(
      <DeleteWorkshopModal workshop={workshop} onCancel={vi.fn()} onConfirm={onConfirm} />
    );

    const deleteBtn = screen.getByRole("button", { name: /Deletar Oficina/i });
    await user.click(deleteBtn);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("shows confirmation text", () => {
    render(
      <DeleteWorkshopModal workshop={workshop} onCancel={vi.fn()} onConfirm={vi.fn()} />
    );
    expect(screen.getByText(/Tem certeza/)).toBeInTheDocument();
  });
});
