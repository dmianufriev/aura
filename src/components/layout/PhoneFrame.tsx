import type { ReactNode } from "react";

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="w-full flex justify-center">
      <div className="w-full sm:w-[420px] sm:rounded-[32px] sm:shadow-2xl sm:border-[10px] sm:border-black bg-white sm:my-8 overflow-hidden flex flex-col h-[calc(100vh-64px)] sm:h-[800px]">
        {children}
      </div>
    </div>
  );
}
