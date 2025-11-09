// src/store/userStore.ts
import { create } from "zustand";

interface UserState {
  registeredUsername: string;
  registeredAccountEmail: string;
  setRegisteredUserDetails: (username: string, email: string) => void;
  clearRegisteredUserDetails: () => void;
}

const useUserStore = create<UserState>((set) => ({
  registeredUsername: "unknown",
  registeredAccountEmail: "unknown",
  setRegisteredUserDetails: (username, email) =>
    set({ registeredUsername: username, registeredAccountEmail: email }),
  clearRegisteredUserDetails: () =>
    set({ registeredUsername: "unknown", registeredAccountEmail: "unknown" }),
}));

export default useUserStore;
