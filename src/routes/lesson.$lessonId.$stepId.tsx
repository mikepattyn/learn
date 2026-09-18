import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppHeader } from "@/components/app-header";
import { LessonPlayer } from "@/components/lesson-player";
import { getLesson, getStep, lessons } from "@/lib/lessons/catalog";

function LessonNotFound() {
  return (
    <div className="min-h-dvh bg-bg text-fg">
      <AppHeader />
      <main id="main" className="mx-auto max-w-lg px-4 py-16">
        <h1 className="text-2xl font-medium tracking-tight">That step is not here</h1>
        <p className="mt-3 text-pretty text-muted">The path still starts at lesson 1. Nothing is lost.</p>
        <Link to="/" className="mt-6 inline-flex min-h-11 items-center text-sm font-medium underline underline-offset-4">
          Go home
        </Link>
      </main>
    </div>
  );
}

export const Route = createFileRoute("/lesson/$lessonId/$stepId")({
  component: LessonStepPage,
  notFoundComponent: LessonNotFound,
});

function LessonStepPage() {
  const { lessonId, stepId } = Route.useParams();
  const lesson = getLesson(lessonId);
  if (!lesson) throw notFound();
  const step = getStep(lesson, stepId);
  if (!step) throw notFound();

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <AppHeader
        trailing={
          <span className="hidden text-xs text-muted sm:inline">
            Lesson {lesson.number} of {lessons.length}
          </span>
        }
      />
      <main id="main">
        <LessonPlayer lesson={lesson} step={step} />
      </main>
    </div>
  );
}
