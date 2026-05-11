import { NavLink, useNavigate } from "react-router-dom";
import { useRole } from "@/contexts/RoleContext";
import { salonConfig } from "@/config/salon.config";
import { cn } from "@/lib/utils";
import { Menu, Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onToggleNav?: () => void;
  showHamburger?: boolean;
}

export function Header({ onToggleNav, showHamburger }: HeaderProps) {
  const { role, setRole } = useRole();
  const navigate = useNavigate();

  function switchRole(next: "owner" | "client") {
    setRole(next);
    navigate(next === "client" ? "/client" : "/");
  }

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="flex h-full items-center gap-3 px-4 md:px-6">
        {showHamburger && role === "owner" && (
          <button
            type="button"
            onClick={onToggleNav}
            className="lg:hidden h-9 w-9 inline-flex items-center justify-center rounded-md hover:bg-muted"
            aria-label="Меню"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <NavLink to="/" className="flex items-center gap-2 font-heading font-bold text-lg">
          <span className="text-2xl">{salonConfig.emoji}</span>
          <span className="hidden sm:inline">{salonConfig.name}</span>
        </NavLink>

        {role === "owner" && (
          <div className="hidden lg:flex items-center gap-2 flex-1 max-w-md ml-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Поиск клиента, услуги, мастера..."
                className="w-full h-9 pl-9 pr-3 rounded-md border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
        )}

        <div className="flex-1" />

        {role === "owner" && (
          <Button variant="ghost" size="icon" aria-label="Уведомления" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
          </Button>
        )}

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
      </div>
    </header>
  );
}
