import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Role = "owner" | "client";

interface RoleContextValue {
  role: Role;
  setRole: (r: Role) => void;
}

const STORAGE_KEY = "aura.role";
const RoleContext = createContext<RoleContextValue | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>(() => {
    if (typeof window === "undefined") return "owner";
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "client" ? "client" : "owner";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, role);
  }, [role]);

  return (
    <RoleContext.Provider value={{ role, setRole: setRoleState }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
}
