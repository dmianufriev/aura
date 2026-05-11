import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { RoleProvider } from "@/contexts/RoleContext";
import { Header } from "@/components/layout/Header";
import { DashboardPage } from "@/pages/Dashboard";
import { InboxPage } from "@/pages/Inbox";
import { ReactivationPage } from "@/pages/Reactivation";
import { ClientPage } from "@/pages/Client";
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

export default function App() {
  return (
    <RoleProvider>
      <ApplyPalette />
      <BrowserRouter basename={BASE === "/" ? undefined : BASE}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route
                path="/"
                element={
                  <div className="mx-auto max-w-7xl px-4 md:px-6 py-8">
                    <DashboardPage />
                  </div>
                }
              />
              <Route
                path="/inbox"
                element={
                  <div className="mx-auto max-w-7xl px-4 md:px-6 py-8">
                    <InboxPage />
                  </div>
                }
              />
              <Route
                path="/reactivation"
                element={
                  <div className="mx-auto max-w-7xl px-4 md:px-6 py-8">
                    <ReactivationPage />
                  </div>
                }
              />
              <Route path="/client" element={<ClientPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
        <Toaster position="bottom-right" richColors />
      </BrowserRouter>
    </RoleProvider>
  );
}
