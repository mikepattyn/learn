import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "paper" | "ink";
export type TypeSize = "comfortable" | "large";
export type Motion = "reduce" | "a-little";

type PrefsState = {
  theme: Theme;
  typeSize: TypeSize;
  motion: Motion;
  setTheme: (theme: Theme) => void;
  setTypeSize: (size: TypeSize) => void;
  setMotion: (motion: Motion) => void;
};

export const usePrefs = create<PrefsState>()(
  persist(
    (set) => ({
      theme: "paper",
      typeSize: "comfortable",
      motion: "reduce",
      setTheme: (theme) => set({ theme }),
      setTypeSize: (typeSize) => set({ typeSize }),
      setMotion: (motion) => set({ motion }),
    }),
    { name: "learn-prefs" },
  ),
);

export function applyPrefsToDocument(prefs: Pick<PrefsState, "theme" | "typeSize" | "motion">) {
  const root = document.documentElement;
  root.dataset.theme = prefs.theme;
  root.dataset.size = prefs.typeSize;
  root.dataset.motion = prefs.motion;
}
