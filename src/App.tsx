import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { RoleProvider, useRole } from "@/contexts/RoleContext";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardPage } from "@/pages/Dashboard";
import { InboxPage } from "@/pages/Inbox";
import { ReactivationPage } from "@/pages/Reactivation";
import { ClientPage } from "@/pages/Client";
import { SchedulePage } from "@/pages/Schedule";
import { ClientsPage } from "@/pages/Clients";
import { LoyaltyPage } from "@/pages/Loyalty";
import { MarketingPage } from "@/pages/Marketing";
import { InventoryPage } from "@/pages/Inventory";
import { FinancePage } from "@/pages/Finance";
import { AnalyticsPage } from "@/pages/Analytics";
import { ReviewsPage } from "@/pages/Reviews";
import { SettingsPage } from "@/pages/Settings";
import { salonConfig } from "@/config/salon.config";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

function ApplyPalette() {
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--color-primary", salonConfig.palette.primary);
    root.style.setProperty("--color-accent", salonConfig.palette.accent);
    root.style.setProperty("--color-background", salonConfig.palette.background);
  }, []);
  return null;
}

function PageContainer({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-7xl px-4 md:px-8 py-6 md:py-8">{children}</div>;
}

function Layout() {
  const { role } = useRole();
  const [navOpen, setNavOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setNavOpen(false);
  }, [location.pathname]);

  if (role === "client") {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/client" element={<ClientPage />} />
            <Route path="*" element={<ClientPage />} />
          </Routes>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header onToggleNav={() => setNavOpen((v) => !v)} showHamburger />
      <div className="flex flex-1 relative">
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        {navOpen && (
          <>
            <button
              type="button"
              className="lg:hidden fixed inset-0 z-30 bg-black/40 backdrop-blur-sm"
              aria-label="Закрыть меню"
              onClick={() => setNavOpen(false)}
            />
            <div className="lg:hidden fixed top-16 left-0 z-40 bg-card border-r border-border h-[calc(100vh-64px)] w-64 overflow-y-auto shadow-xl">
              <Sidebar onNavigate={() => setNavOpen(false)} />
            </div>
          </>
        )}
        <main className="flex-1 min-w-0">
          <Routes>
            <Route path="/" element={<PageContainer><DashboardPage /></PageContainer>} />
            <Route path="/schedule" element={<PageContainer><SchedulePage /></PageContainer>} />
            <Route path="/clients" element={<PageContainer><ClientsPage /></PageContainer>} />
            <Route path="/inbox" element={<PageContainer><InboxPage /></PageContainer>} />
            <Route path="/reactivation" element={<PageContainer><ReactivationPage /></PageContainer>} />
            <Route path="/loyalty" element={<PageContainer><LoyaltyPage /></PageContainer>} />
            <Route path="/marketing" element={<PageContainer><MarketingPage /></PageContainer>} />
            <Route path="/inventory" element={<PageContainer><InventoryPage /></PageContainer>} />
            <Route path="/finance" element={<PageContainer><FinancePage /></PageContainer>} />
            <Route path="/analytics" element={<PageContainer><AnalyticsPage /></PageContainer>} />
            <Route path="/reviews" element={<PageContainer><ReviewsPage /></PageContainer>} />
            <Route path="/settings" element={<PageContainer><SettingsPage /></PageContainer>} />
            <Route path="/client" element={<ClientPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <RoleProvider>
      <ApplyPalette />
      <BrowserRouter basename={BASE === "/" ? undefined : BASE}>
        <Layout />
        <Toaster position="bottom-right" richColors />
      </BrowserRouter>
    </RoleProvider>
  );
}
