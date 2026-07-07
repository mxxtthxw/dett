"use client";

import type { ReactNode } from "react";
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import { StudentProfileProvider } from "@/context/StudentProfileContext";
import { DashboardWidget } from "@/components/dashboard/DashboardWidget";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AdminAuthProvider>
      <StudentProfileProvider>
        {children}
        <DashboardWidget />
      </StudentProfileProvider>
    </AdminAuthProvider>
  );
}
