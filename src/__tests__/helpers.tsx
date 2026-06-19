import React from "react";
import { render, type RenderResult } from "@testing-library/react";
import { AuthContext, type User } from "@/context/AuthContext";
import { WorkshopsContext, type Workshop } from "@/context/WorkshopsContext";
import { StudentsContext, type Student } from "@/context/StudentsContext";
import { TeachersContext, type Teacher } from "@/context/TeachersContext";

export function createMockAuthValue(overrides?: Record<string, any>) {
  return {
    user: { id: "test-uuid", name: "Test Admin", email: "admin@test.com", role: "admin" as const, token: "test-jwt" },
    isAuthenticated: true,
    isLoading: false,
    login: vi.fn().mockResolvedValue(undefined),
    loginWithGoogle: vi.fn().mockResolvedValue(undefined),
    register: vi.fn().mockResolvedValue(undefined),
    logout: vi.fn(),
    getToken: vi.fn().mockResolvedValue("test-jwt"),
    ...overrides,
  };
}

export function createMockWorkshopsValue(overrides?: Record<string, any>) {
  return {
    workshops: [] as Workshop[],
    loading: false,
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    refresh: vi.fn(),
    ...overrides,
  };
}

export function createMockStudentsValue(overrides?: Record<string, any>) {
  return {
    students: [] as Student[],
    loading: false,
    addStudent: vi.fn(),
    addStudentsBySchool: vi.fn(),
    updateStudent: vi.fn(),
    deleteStudent: vi.fn(),
    linkStudentToWorkshop: vi.fn(),
    linkStudentsToWorkshop: vi.fn(),
    unlinkStudentFromWorkshop: vi.fn(),
    getStudentsByWorkshop: vi.fn().mockReturnValue([]),
    refresh: vi.fn(),
    ...overrides,
  };
}

export function createMockTeachersValue(overrides?: Record<string, any>) {
  return {
    teachers: [] as Teacher[],
    loading: false,
    refresh: vi.fn(),
    getById: vi.fn(),
    ...overrides,
  };
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    auth,
    workshops,
    students,
    teachers,
  }: {
    auth?: Record<string, any>;
    workshops?: Record<string, any>;
    students?: Record<string, any>;
    teachers?: Record<string, any>;
  } = {}
): RenderResult {
  return render(
    <AuthContext.Provider value={createMockAuthValue(auth)}>
      <TeachersContext.Provider value={createMockTeachersValue(teachers)}>
        <StudentsContext.Provider value={createMockStudentsValue(students)}>
          <WorkshopsContext.Provider value={createMockWorkshopsValue(workshops)}>
            {ui}
          </WorkshopsContext.Provider>
        </StudentsContext.Provider>
      </TeachersContext.Provider>
    </AuthContext.Provider>
  );
}
