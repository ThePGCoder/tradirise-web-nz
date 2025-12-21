import { create } from "zustand";

interface PolicyStore {
  termsViewed: boolean;
  privacyViewed: boolean;
  setTermsViewed: (viewed: boolean) => void;
  setPrivacyViewed: (viewed: boolean) => void;
  reset: () => void;
}

export const usePolicyStore = create<PolicyStore>((set) => ({
  termsViewed: false,
  privacyViewed: false,
  setTermsViewed: (viewed: boolean) => set({ termsViewed: viewed }),
  setPrivacyViewed: (viewed: boolean) => set({ privacyViewed: viewed }),
  reset: () => set({ termsViewed: false, privacyViewed: false }),
}));
