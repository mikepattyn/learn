import { contactApiLesson } from "./contact-api";
import { emailLesson } from "./email";
import { scaffoldLesson } from "./scaffold";
import type { Lesson, Track } from "./types";

export const track: Track = {
  id: "first-contact-email",
  title: "First contact email",
  summary: "Scaffold the umbrella, then send one form message through Lambda and Zoho.",
  lessons: [scaffoldLesson, emailLesson, contactApiLesson],
};

export const lessons: Lesson[] = track.lessons;

export function getLesson(id: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.id === id);
}

export function getStep(lesson: Lesson, stepId: string) {
  return lesson.steps.find((step) => step.id === stepId);
}

export function firstIncompleteStep(lesson: Lesson, completedIds: string[]) {
  return lesson.steps.find((step) => !completedIds.includes(step.id)) ?? lesson.steps[0];
}

export function adjacentSteps(lesson: Lesson, stepId: string) {
  const index = lesson.steps.findIndex((step) => step.id === stepId);
  return {
    index,
    prev: index > 0 ? lesson.steps[index - 1] : undefined,
    next: index >= 0 && index < lesson.steps.length - 1 ? lesson.steps[index + 1] : undefined,
  };
}

export function nextLesson(lessonId: string): Lesson | undefined {
  const index = lessons.findIndex((lesson) => lesson.id === lessonId);
  return index >= 0 ? lessons[index + 1] : undefined;
}

export function lessonProgress(lesson: Lesson, completedIds: string[]) {
  const done = lesson.steps.filter((step) => completedIds.includes(step.id)).length;
  return {
    done,
    total: lesson.steps.length,
    ratio: lesson.steps.length === 0 ? 0 : done / lesson.steps.length,
    complete: done === lesson.steps.length,
  };
}

export function trackProgress(completed: Record<string, string[]>) {
  const total = lessons.reduce((sum, lesson) => sum + lesson.steps.length, 0);
  const done = lessons.reduce((sum, lesson) => sum + (completed[lesson.id] ?? []).length, 0);
  return { done, total, ratio: total === 0 ? 0 : done / total };
}
