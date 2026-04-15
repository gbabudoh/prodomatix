import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CookiePreferences {
  essential: boolean; // Always true, cannot be disabled
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface CookieState {
  hasConsented: boolean;
  showBanner: boolean;
  showPreferences: boolean;
  preferences: CookiePreferences;
  consentDate: string | null;
  
  // Actions
  acceptAll: () => void;
  rejectAll: () => void;
  savePreferences: (prefs: Partial<CookiePreferences>) => void;
  openPreferences: () => void;
  closePreferences: () => void;
  resetConsent: () => void;
}

const defaultPreferences: CookiePreferences = {
  essential: true,
  functional: false,
  analytics: false,
  marketing: false,
};

export const useCookieStore = create<CookieState>()(
  persist(
    (set) => ({
      hasConsented: false,
      showBanner: true,
      showPreferences: false,
      preferences: defaultPreferences,
      consentDate: null,

      acceptAll: () => set({
        hasConsented: true,
        showBanner: false,
        showPreferences: false,
        preferences: {
          essential: true,
          functional: true,
          analytics: true,
          marketing: true,
        },
        consentDate: new Date().toISOString(),
      }),

      rejectAll: () => set({
        hasConsented: true,
        showBanner: false,
        showPreferences: false,
        preferences: {
          essential: true, // Essential always stays true
          functional: false,
          analytics: false,
          marketing: false,
        },
        consentDate: new Date().toISOString(),
      }),

      savePreferences: (prefs) => set((state) => ({
        hasConsented: true,
        showBanner: false,
        showPreferences: false,
        preferences: {
          ...state.preferences,
          ...prefs,
          essential: true, // Essential always stays true
        },
        consentDate: new Date().toISOString(),
      })),

      openPreferences: () => set({ showPreferences: true }),
      
      closePreferences: () => set({ showPreferences: false }),

      resetConsent: () => set({
        hasConsented: false,
        showBanner: true,
        showPreferences: false,
        preferences: defaultPreferences,
        consentDate: null,
      }),
    }),
    {
      name: 'prodomatix-cookie-consent',
      partialize: (state) => ({
        hasConsented: state.hasConsented,
        preferences: state.preferences,
        consentDate: state.consentDate,
      }),
    }
  )
);
