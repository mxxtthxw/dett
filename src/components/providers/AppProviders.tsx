"use client";

import type { ReactNode } from "react";
import { StudentProfileProvider } from "@/context/StudentProfileContext";
import { DashboardWidget } from "@/components/dashboard/DashboardWidget";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <StudentProfileProvider>
      {children}
      <DashboardWidget />
    </StudentProfileProvider>
  );
}
