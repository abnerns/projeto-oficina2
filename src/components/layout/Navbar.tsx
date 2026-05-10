import { Bell, Menu, Moon, Search, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Breadcrumbs } from "./Breadcrumbs";

export function Navbar({ onMenu }: { onMenu: () => void }) {
  const { theme, toggle } = useTheme();
  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="h-full px-4 md:px-6 flex items-center gap-3">
        <button
          onClick={onMenu}
          className="md:hidden h-9 w-9 inline-flex items-center justify-center rounded-lg hover:bg-accent"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden md:block">
          <Breadcrumbs />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Pesquisar oficinas..."
              className="h-9 pl-9 pr-3 w-56 lg:w-72 rounded-lg bg-muted/60 border border-transparent focus:border-ring focus:bg-background outline-none text-sm transition-colors"
            />
          </div>
          <button
            onClick={toggle}
            className="h-9 w-9 inline-flex items-center justify-center rounded-lg hover:bg-accent transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button className="relative h-9 w-9 inline-flex items-center justify-center rounded-lg hover:bg-accent">
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
          </button>
          <div className="ml-1 h-9 w-9 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-semibold shadow-elegant">
            AS
          </div>
        </div>
      </div>
    </header>
  );
}
