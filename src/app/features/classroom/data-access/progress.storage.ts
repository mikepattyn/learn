export const PROGRESS_KEY = 'learn-progress';

export type ProgressState = {
  completed: Record<string, string[]>;
  lastLessonId: string | null;
  lastStepId: string | null;
};

const empty: ProgressState = {
  completed: {},
  lastLessonId: null,
  lastStepId: null,
};

export function readProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return { ...empty, completed: {} };
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return {
      completed:
        parsed.completed && typeof parsed.completed === 'object' ? parsed.completed : {},
      lastLessonId: typeof parsed.lastLessonId === 'string' ? parsed.lastLessonId : null,
      lastStepId: typeof parsed.lastStepId === 'string' ? parsed.lastStepId : null,
    };
  } catch {
    return { ...empty, completed: {} };
  }
}

function write(state: ProgressState): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(state));
  } catch {
    /* ignore quota */
  }
}

export function isStepDone(completed: Record<string, string[]>, lessonId: string, stepId: string) {
  return (completed[lessonId] ?? []).includes(stepId);
}

export function markDone(lessonId: string, stepId: string): ProgressState {
  const current = readProgress();
  const ids = current.completed[lessonId] ?? [];
  const completed = ids.includes(stepId)
    ? current.completed
    : { ...current.completed, [lessonId]: [...ids, stepId] };
  const next = { completed, lastLessonId: lessonId, lastStepId: stepId };
  write(next);
  return next;
}

export function unmark(lessonId: string, stepId: string): ProgressState {
  const current = readProgress();
  const next = {
    ...current,
    completed: {
      ...current.completed,
      [lessonId]: (current.completed[lessonId] ?? []).filter((id) => id !== stepId),
    },
  };
  write(next);
  return next;
}

export function setLast(lessonId: string, stepId: string): ProgressState {
  const next = { ...readProgress(), lastLessonId: lessonId, lastStepId: stepId };
  write(next);
  return next;
}

export function resetLesson(lessonId: string): ProgressState {
  const current = readProgress();
  const completed = { ...current.completed };
  delete completed[lessonId];
  const next = { ...current, completed };
  write(next);
  return next;
}

export function resetAll(): ProgressState {
  write(empty);
  return { ...empty, completed: {} };
}
