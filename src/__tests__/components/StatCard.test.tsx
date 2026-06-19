import { render, screen } from "@testing-library/react";
import { StatCard } from "@/components/ui-kit/StatCard";
import { GraduationCap } from "lucide-react";

describe("StatCard", () => {
  it("renders label and value", () => {
    render(<StatCard label="Total" value="42" icon={GraduationCap} />);
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("renders numeric value", () => {
    render(<StatCard label="Alunos" value={10} icon={GraduationCap} />);
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("shows trend when provided", () => {
    render(<StatCard label="Oficinas" value="5" icon={GraduationCap} trend="+2 novas" />);
    expect(screen.getByText("+2 novas")).toBeInTheDocument();
  });

  it("does not show trend when not provided", () => {
    render(<StatCard label="Test" value="0" icon={GraduationCap} />);
    expect(screen.queryByText("+2 novas")).not.toBeInTheDocument();
  });

  it("renders loading state with dash", () => {
    render(<StatCard label="Loading" value="—" icon={GraduationCap} />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("applies custom delay for animation", () => {
    const { container } = render(<StatCard label="Delay" value="1" icon={GraduationCap} delay={0.5} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
