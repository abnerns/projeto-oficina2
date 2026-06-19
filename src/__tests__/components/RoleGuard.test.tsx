import { render, screen } from "@testing-library/react";
import { RoleGuard } from "@/components/ui-kit/RoleGuard";
import { AuthContext } from "@/context/AuthContext";
import { createMockAuthValue } from "../helpers";

describe("RoleGuard", () => {
  it("renders children when role matches", () => {
    render(
      <AuthContext.Provider value={createMockAuthValue({ user: { id: "1", name: "Admin", email: "a@a.com", role: "admin", token: "x" } })}>
        <RoleGuard allowedRoles={["admin"]}>
          <div data-testid="content">Protected Content</div>
        </RoleGuard>
      </AuthContext.Provider>
    );
    expect(screen.getByTestId("content")).toBeInTheDocument();
  });

  it("does not render children when role does not match", () => {
    render(
      <AuthContext.Provider value={createMockAuthValue({ user: { id: "1", name: "Teacher", email: "t@t.com", role: "teacher", token: "x" } })}>
        <RoleGuard allowedRoles={["admin"]}>
          <div data-testid="content">Protected Content</div>
        </RoleGuard>
      </AuthContext.Provider>
    );
    expect(screen.queryByTestId("content")).not.toBeInTheDocument();
  });

  it("renders nothing when user is null", () => {
    render(
      <AuthContext.Provider value={createMockAuthValue({ user: null, isAuthenticated: false })}>
        <RoleGuard allowedRoles={["admin"]}>
          <div data-testid="content">Protected Content</div>
        </RoleGuard>
      </AuthContext.Provider>
    );
    expect(screen.queryByTestId("content")).not.toBeInTheDocument();
  });

  it("renders fallback when role does not match and fallback is provided", () => {
    render(
      <AuthContext.Provider value={createMockAuthValue({ user: { id: "1", name: "Teacher", email: "t@t.com", role: "teacher", token: "x" } })}>
        <RoleGuard allowedRoles={["admin"]} fallback={<div data-testid="fallback">Sem permissão</div>}>
          <div data-testid="content">Protected Content</div>
        </RoleGuard>
      </AuthContext.Provider>
    );
    expect(screen.queryByTestId("content")).not.toBeInTheDocument();
    expect(screen.getByTestId("fallback")).toBeInTheDocument();
  });
});
