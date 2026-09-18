import {
  isStepDone,
  markDone,
  PROGRESS_KEY,
  readProgress,
  resetAll,
  resetLesson,
  setLast,
  unmark,
} from './progress.storage';

describe('progress storage', () => {
  beforeEach(() => {
    localStorage.removeItem(PROGRESS_KEY);
  });

  it('returns empty progress for missing or invalid payloads', () => {
    expect(readProgress()).toEqual({
      completed: {},
      lastLessonId: null,
      lastStepId: null,
    });
    localStorage.setItem(PROGRESS_KEY, '{');
    expect(readProgress().completed).toEqual({});
    localStorage.setItem(PROGRESS_KEY, JSON.stringify({ completed: 'nope', lastLessonId: 1 }));
    expect(readProgress()).toEqual({
      completed: {},
      lastLessonId: null,
      lastStepId: null,
    });
  });

  it('ticks a step once, remembers last place, and can reset', () => {
    markDone('scaffold', 'what');
    markDone('scaffold', 'what');
    expect(isStepDone(readProgress().completed, 'scaffold', 'what')).toBe(true);
    expect(readProgress().lastLessonId).toBe('scaffold');
    unmark('scaffold', 'what');
    expect(isStepDone(readProgress().completed, 'scaffold', 'what')).toBe(false);
    setLast('email', 'why');
    expect(readProgress().lastStepId).toBe('why');
    resetLesson('scaffold');
    expect(readProgress().completed['scaffold']).toBeUndefined();
    resetAll();
    expect(readProgress().lastLessonId).toBeNull();
  });
});
