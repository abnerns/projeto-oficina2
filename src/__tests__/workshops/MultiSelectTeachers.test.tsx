import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MultiSelectTeachers } from "@/components/workshops/MultiSelectTeachers";
import { renderWithProviders, createMockTeachersValue } from "../helpers";

describe("MultiSelectTeachers", () => {
  it("shows placeholder when no teachers selected", () => {
    renderWithProviders(
      <MultiSelectTeachers value={[]} onChange={vi.fn()} />,
      { teachers: createMockTeachersValue() }
    );
    expect(screen.getByText("Selecionar professor...")).toBeInTheDocument();
  });

  it("shows loading state", () => {
    renderWithProviders(
      <MultiSelectTeachers value={[]} onChange={vi.fn()} />,
      { teachers: createMockTeachersValue({ loading: true, teachers: [] }) }
    );
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("shows 'Nenhum professor encontrado' when list is empty", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <MultiSelectTeachers value={[]} onChange={vi.fn()} />,
      { teachers: createMockTeachersValue({ teachers: [], loading: false }) }
    );

    await user.click(screen.getByRole("button"));
    expect(screen.getByText("Nenhum professor encontrado.")).toBeInTheDocument();
  });

  it("displays teachers in dropdown", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <MultiSelectTeachers value={[]} onChange={vi.fn()} />,
      {
        teachers: createMockTeachersValue({
          teachers: [
            { id: "t1", name: "Prof João", expertise: "Matemática", color: "red" },
            { id: "t2", name: "Prof Maria", expertise: "Português", color: "blue" },
          ],
        }),
      }
    );

    await user.click(screen.getByRole("button"));
    expect(screen.getByText("Prof João")).toBeInTheDocument();
    expect(screen.getByText("Prof Maria")).toBeInTheDocument();
  });

  it("calls onChange when selecting a teacher from dropdown", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <MultiSelectTeachers value={[]} onChange={onChange} />,
      {
        teachers: createMockTeachersValue({
          teachers: [{ id: "t1", name: "Prof João", expertise: "Matemática", color: "red" }],
        }),
      }
    );

    await user.click(screen.getByRole("button"));
    const dropdownBtn = screen.getByRole("button", { name: /matemática/i });
    expect(dropdownBtn).toBeDefined();
    await user.click(dropdownBtn!);
    expect(onChange).toHaveBeenCalledWith(["t1"]);
  });

  it("deselects a teacher by clicking dropdown item when already selected", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <MultiSelectTeachers value={["t1"]} onChange={onChange} />,
      {
        teachers: createMockTeachersValue({
          teachers: [{ id: "t1", name: "Prof João", expertise: "Matemática", color: "red" }],
        }),
      }
    );

    const allButtons = screen.getAllByRole("button");
    const trigger = allButtons.find(b => b.tagName === "BUTTON")!;
    await user.click(trigger);
    const dropdownBtn = screen.getByRole("button", { name: /matemática/i });
    expect(dropdownBtn).toBeDefined();
    await user.click(dropdownBtn!);
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it("shows selected teachers as badges", () => {
    renderWithProviders(
      <MultiSelectTeachers value={["t1"]} onChange={vi.fn()} />,
      {
        teachers: createMockTeachersValue({
          teachers: [{ id: "t1", name: "Prof João", expertise: "Matemática", color: "red" }],
        }),
      }
    );

    expect(screen.getByText("Prof João")).toBeInTheDocument();
  });
});
