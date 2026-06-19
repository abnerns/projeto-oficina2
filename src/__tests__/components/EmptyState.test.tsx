import { render, screen } from "@testing-library/react";
import { EmptyState } from "@/components/ui-kit/EmptyState";

describe("EmptyState", () => {
  it("renders default title and description", () => {
    render(<EmptyState />);
    expect(screen.getByText("No workshops found")).toBeInTheDocument();
    expect(screen.getByText(/Get started/)).toBeInTheDocument();
  });

  it("renders custom title", () => {
    render(<EmptyState title="Nenhum aluno encontrado" />);
    expect(screen.getByText("Nenhum aluno encontrado")).toBeInTheDocument();
  });

  it("renders custom description", () => {
    render(<EmptyState description="Cadastre um novo aluno para começar." />);
    expect(screen.getByText("Cadastre um novo aluno para começar.")).toBeInTheDocument();
  });

  it("renders action button with default label", () => {
    render(<EmptyState />);
    expect(screen.getByText("Nova Oficina")).toBeInTheDocument();
  });

  it("renders action button with custom label", () => {
    render(<EmptyState actionLabel="Novo Aluno" actionTo="/students" />);
    expect(screen.getByText("Novo Aluno")).toBeInTheDocument();
  });

  it("action link points to the correct route", () => {
    render(<EmptyState actionTo="/workshops/new" />);
    const link = screen.getByText("Nova Oficina").closest("a");
    expect(link).toHaveAttribute("href", "/workshops/new");
  });
});
