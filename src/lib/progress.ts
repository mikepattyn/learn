import { create } from "zustand";
import { persist } from "zustand/middleware";

type ProgressState = {
  completed: Record<string, string[]>;
  lastLessonId: string | null;
  lastStepId: string | null;
  markDone: (lessonId: string, stepId: string) => void;
  unmark: (lessonId: string, stepId: string) => void;
  setLast: (lessonId: string, stepId: string) => void;
  resetLesson: (lessonId: string) => void;
  resetAll: () => void;
};

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      completed: {},
      lastLessonId: null,
      lastStepId: null,
      markDone: (lessonId, stepId) => {
        const current = get().completed[lessonId] ?? [];
        if (current.includes(stepId)) {
          set({ lastLessonId: lessonId, lastStepId: stepId });
          return;
        }
        set({
          completed: { ...get().completed, [lessonId]: [...current, stepId] },
          lastLessonId: lessonId,
          lastStepId: stepId,
        });
      },
      unmark: (lessonId, stepId) => {
        const current = get().completed[lessonId] ?? [];
        set({
          completed: {
            ...get().completed,
            [lessonId]: current.filter((id) => id !== stepId),
          },
        });
      },
      setLast: (lessonId, stepId) => set({ lastLessonId: lessonId, lastStepId: stepId }),
      resetLesson: (lessonId) => {
        const next = { ...get().completed };
        delete next[lessonId];
        set({ completed: next });
      },
      resetAll: () => set({ completed: {}, lastLessonId: null, lastStepId: null }),
    }),
    { name: "learn-progress" },
  ),
);

export function isStepDone(completed: Record<string, string[]>, lessonId: string, stepId: string) {
  return (completed[lessonId] ?? []).includes(stepId);
}
