"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  loginAdmin,
  logoutAdmin,
  readAdminSession,
  type AdminSession,
} from "@/lib/adminAuth";
import { AdminSignInModal } from "@/components/admin/AdminSignInModal";

interface AdminAuthContextValue {
  isAdminAuthenticated: boolean;
  adminUsername: string | null;
  login: (
    username: string,
    password: string,
  ) => { ok: boolean; error?: string };
  logout: () => void;
  openSignInModal: () => void;
  closeSignInModal: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<AdminSession | null>(null);
  const [signInModalOpen, setSignInModalOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSession(readAdminSession());
    setHydrated(true);
  }, []);

  const login = useCallback((username: string, password: string) => {
    const result = loginAdmin(username, password);
    if (result.ok && result.session) {
      setSession(result.session);
    }
    return result;
  }, []);

  const logout = useCallback(() => {
    logoutAdmin();
    setSession(null);
  }, []);

  const openSignInModal = useCallback(() => {
    setSignInModalOpen(true);
  }, []);

  const closeSignInModal = useCallback(() => {
    setSignInModalOpen(false);
  }, []);

  const handleSignInSuccess = useCallback(() => {
    closeSignInModal();
    router.push("/admin");
  }, [closeSignInModal, router]);

  const value = useMemo<AdminAuthContextValue>(
    () => ({
      isAdminAuthenticated: hydrated && session !== null,
      adminUsername: session?.username ?? null,
      login,
      logout,
      openSignInModal,
      closeSignInModal,
    }),
    [
      hydrated,
      session,
      login,
      logout,
      openSignInModal,
      closeSignInModal,
    ],
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
      <AdminSignInModal
        open={signInModalOpen}
        onClose={closeSignInModal}
        onSuccess={handleSignInSuccess}
      />
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return context;
}

export function useOptionalAdminAuth() {
  return useContext(AdminAuthContext);
}
