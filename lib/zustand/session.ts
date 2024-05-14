import { create } from "zustand";
import { Session } from "../zodSchema/session";

interface SessionState {
  session: Session | null;
  setSession: (session: Session) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  session: null,
  setSession: (session: Session) => set({ session }),
  clearSession: () => set({ session: null }),
}));
