import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Inbox,
  Gift,
  Megaphone,
  RotateCcw,
  Package,
  Wallet,
  BarChart3,
  Star,
  Settings,
} from "lucide-react";

interface Item {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  end?: boolean;
  badge?: string;
}

const sections: { title: string; items: Item[] }[] = [
  {
    title: "Управление",
    items: [
      { to: "/", label: "Дашборд", icon: LayoutDashboard, end: true },
      { to: "/schedule", label: "Журнал записи", icon: CalendarDays },
      { to: "/clients", label: "Клиенты", icon: Users },
    ],
  },
  {
    title: "AI & Маркетинг",
    items: [
      { to: "/inbox", label: "AI-Инбокс", icon: Inbox, badge: "12" },
      { to: "/reactivation", label: "Возврат клиентов", icon: RotateCcw, badge: "47" },
      { to: "/marketing", label: "Маркетинг", icon: Megaphone },
      { to: "/reviews", label: "Отзывы", icon: Star, badge: "2" },
    ],
  },
  {
    title: "Финансы и склад",
    items: [
      { to: "/loyalty", label: "Лояльность", icon: Gift },
      { to: "/finance", label: "Финансы", icon: Wallet },
      { to: "/inventory", label: "Склад", icon: Package, badge: "!" },
      { to: "/analytics", label: "Аналитика", icon: BarChart3 },
    ],
  },
  {
    title: "Прочее",
    items: [{ to: "/settings", label: "Настройки", icon: Settings }],
  },
];

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  return (
    <aside className="w-60 shrink-0 border-r border-border bg-card/60 h-[calc(100vh-64px)] sticky top-16 overflow-y-auto py-4">
      <nav className="px-3 space-y-6">
        {sections.map((section) => (
          <div key={section.title}>
            <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {section.title}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground font-medium shadow-sm"
                        : "text-foreground/80 hover:bg-primary/10 hover:text-foreground"
                    )
                  }
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={cn(
                        "text-[10px] rounded-full px-1.5 py-0.5 font-medium",
                        item.badge === "!"
                          ? "bg-red-500 text-white"
                          : "bg-card border border-border text-muted-foreground"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
