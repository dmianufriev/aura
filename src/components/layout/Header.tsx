import { NavLink, useNavigate } from "react-router-dom";
import { useRole } from "@/contexts/RoleContext";
import { salonConfig } from "@/config/salon.config";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const ownerLinks = [
  { to: "/", label: "Дашборд", end: true },
  { to: "/inbox", label: "Инбокс" },
  { to: "/reactivation", label: "Возврат" },
];

export function Header() {
  const { role, setRole } = useRole();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  function switchRole(next: "owner" | "client") {
    setRole(next);
    navigate(next === "client" ? "/client" : "/");
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-7xl items-center gap-4 px-4 md:px-6">
        <NavLink to="/" className="flex items-center gap-2 font-heading font-bold text-lg">
          <span className="text-2xl">{salonConfig.emoji}</span>
          <span className="hidden sm:inline">{salonConfig.name}</span>
        </NavLink>

        {role === "owner" && (
          <nav className="hidden md:flex items-center gap-1 ml-6">
            {ownerLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive ? "text-foreground bg-primary/10" : "text-muted-foreground hover:text-foreground"
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        )}

        <div className="flex-1" />

        <div className="inline-flex h-9 items-center rounded-full bg-muted p-1 text-sm font-medium">
          <button
            type="button"
            onClick={() => switchRole("owner")}
            className={cn(
              "px-3 py-1 rounded-full transition-all",
              role === "owner" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground"
            )}
          >
            👔 Владелец
          </button>
          <button
            type="button"
            onClick={() => switchRole("client")}
            className={cn(
              "px-3 py-1 rounded-full transition-all",
              role === "client" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground"
            )}
          >
            👤 Клиент
          </button>
        </div>

        {role === "owner" && (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden h-9 w-9 inline-flex items-center justify-center rounded-md hover:bg-muted"
            aria-label="Меню"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        )}
      </div>

      {open && role === "owner" && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="mx-auto max-w-7xl flex flex-col p-2">
            {ownerLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "px-4 py-3 rounded-md text-sm",
                    isActive ? "bg-primary/10 text-foreground font-medium" : "text-muted-foreground"
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
