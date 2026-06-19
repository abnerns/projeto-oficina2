import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
import React from "react";

vi.mock("@/lib/firebase", () => ({
  auth: {
    currentUser: null,
  },
  googleProvider: {},
}));

vi.mock("firebase/auth", () => ({
  onAuthStateChanged: vi.fn((_auth: any, cb: (u: any) => void) => {
    cb(null);
    return () => {};
  }),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  GoogleAuthProvider: vi.fn(),
}));

vi.mock("@tanstack/react-router", () => ({
  createFileRoute: vi.fn(() => (options: any) => ({
    ...options,
    head: options?.head || vi.fn(() => ({ meta: [] })),
  })),
  Link: ({ children, to, ...props }: any) =>
    React.createElement("a", { href: to, ...props }, children),
  useNavigate: vi.fn(() => vi.fn()),
  useRouter: vi.fn(() => ({ invalidate: vi.fn() })),
  createRouter: vi.fn(),
  createRootRouteWithContext: vi.fn(() => ({
    head: vi.fn(),
    component: vi.fn(),
  })),
  Outlet: () => null,
  RouterProvider: ({ children }: any) => React.createElement(React.Fragment, null, children),
  HeadContent: () => null,
  Scripts: () => null,
  createRootRoute: vi.fn(() => ({
    head: vi.fn(),
    shellComponent: ({ children }: any) => React.createElement(React.Fragment, null, children),
    component: () => null,
    errorComponent: () => null,
    notFoundComponent: () => null,
  })),
  useRouterState: vi.fn(() => ({ location: { pathname: "/" } })),
}));

vi.mock("@/lib/utils", () => ({
  cn: (...inputs: any[]) => inputs.filter(Boolean).join(" "),
}));

vi.mock("@/styles.css?url", () => ({}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
  Toaster: () => null,
}));

const localStorageStore: Record<string, string> = {};
Object.defineProperty(globalThis, "localStorage", {
  value: {
    getItem: vi.fn((key: string) => localStorageStore[key] ?? null),
    setItem: vi.fn((key: string, val: string) => { localStorageStore[key] = val; }),
    removeItem: vi.fn((key: string) => { delete localStorageStore[key]; }),
    clear: vi.fn(() => { Object.keys(localStorageStore).forEach(k => delete localStorageStore[k]); }),
    get length() { return Object.keys(localStorageStore).length; },
    key: vi.fn((i: number) => Object.keys(localStorageStore)[i] ?? null),
  },
  configurable: true,
});

globalThis.fetch = vi.fn();

afterEach(() => {
  vi.clearAllMocks();
  Object.keys(localStorageStore).forEach(k => delete localStorageStore[k]);
});
