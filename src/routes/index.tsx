import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Clock } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import {
  firstIncompleteStep,
  lessons,
  lessonProgress,
  nextLesson,
  track,
  trackProgress,
} from "@/lib/lessons/catalog";
import { useProgress } from "@/lib/progress";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const completed = useProgress((s) => s.completed);
  const lastLessonId = useProgress((s) => s.lastLessonId);
  const lastStepId = useProgress((s) => s.lastStepId);
  const setLast = useProgress((s) => s.setLast);
  const overall = trackProgress(completed);

  const lastLesson = lessons.find((lesson) => lesson.id === lastLessonId);
  const continueLesson =
    lastLesson ??
    lessons.find((lesson) => !lessonProgress(lesson, completed[lesson.id] ?? []).complete) ??
    lessons[0];
  const continueStep =
    (lastLesson && lastStepId && lastLesson.steps.find((step) => step.id === lastStepId)) ||
    firstIncompleteStep(continueLesson, completed[continueLesson.id] ?? []);

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <AppHeader />
      <main id="main" className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 py-10 sm:py-14">
        <section className="flex flex-col gap-5">
          <p className="text-xs font-medium tracking-wide text-muted uppercase">ADHD-safe classroom</p>
          <h1 className="max-w-[14ch] text-4xl font-medium tracking-tight text-balance sm:text-5xl">
            Small AWS lessons. One step on screen.
          </h1>
          <p className="max-w-prose text-pretty text-muted leading-relaxed">
            Progress waits. Nothing streaks, pings, or expires. You park whenever you want. This path
            uses the real repos: the Cursor scaffold skill, Mikepattyn.Email, and Contact.Api.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link
                to="/lesson/$lessonId/$stepId"
                params={{ lessonId: continueLesson.id, stepId: continueStep.id }}
                onClick={() => setLast(continueLesson.id, continueStep.id)}
              >
                {overall.done > 0 ? "Continue" : "Start lesson 1"}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <p className="text-sm text-muted tabular-nums">
              {overall.done} of {overall.total} steps ticked
            </p>
          </div>
        </section>

        <section className="rounded-2xl bg-surface p-5 shadow-border sm:p-6">
          <h2 className="text-sm font-medium">How this room works</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              "One step. Not a wall of docs.",
              "Still motion unless you ask for a little.",
              "No quizzes. No punishing streaks.",
              "An 8-minute timer, visual only.",
              "Ticks live on this device.",
              "Copy a command. Leave the rest.",
            ].map((item) => (
              <li key={item} className="flex gap-3 text-sm text-pretty leading-relaxed">
                <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-4">
          <div>
            <p className="text-xs font-medium tracking-wide text-muted uppercase">The path</p>
            <h2 className="mt-1 text-2xl font-medium tracking-tight">{track.title}</h2>
            <p className="mt-2 max-w-prose text-pretty text-muted">{track.summary}</p>
          </div>
          <ol className="flex flex-col gap-6">
            {lessons.map((lesson) => {
              const progress = lessonProgress(lesson, completed[lesson.id] ?? []);
              const start = firstIncompleteStep(lesson, completed[lesson.id] ?? []);
              const following = nextLesson(lesson.id);
              return (
                <li key={lesson.id}>
                  <Link
                    to="/lesson/$lessonId/$stepId"
                    params={{ lessonId: lesson.id, stepId: start.id }}
                    onClick={() => setLast(lesson.id, start.id)}
                    className="block rounded-2xl bg-surface p-5 shadow-border transition-[box-shadow] duration-(--motion-quick) hover:shadow-border-hover"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <p className="text-xs font-medium tracking-wide text-muted uppercase">
                        Lesson {lesson.number}
                        {progress.complete ? " · ticked" : null}
                      </p>
                      <p className="inline-flex items-center gap-1.5 text-xs text-muted">
                        <Clock className="size-3.5" />
                        {lesson.minutes} min · {progress.done}/{progress.total}
                      </p>
                    </div>
                    <h3 className="mt-2 text-xl font-medium tracking-tight">{lesson.title}</h3>
                    <p className="mt-2 max-w-prose text-pretty text-sm text-muted leading-relaxed">{lesson.summary}</p>
                    <div className="mt-4 h-1 overflow-hidden rounded-full bg-bg">
                      <div className="h-full rounded-full bg-accent" style={{ width: `${progress.ratio * 100}%` }} />
                    </div>
                    <p className="mt-3 text-sm font-medium">
                      {progress.complete
                        ? following
                          ? "Walk again, or continue"
                          : "Walk again"
                        : progress.done > 0
                          ? "Pick up here"
                          : "Open this lesson"}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>

        <footer className="border-t border-border pt-6 text-sm text-muted">
          <p className="text-pretty">Source of the lessons.</p>
          <ul className="mt-3 flex flex-col gap-2">
            {lessons.map((lesson) => (
              <li key={lesson.id}>
                <a
                  href={lesson.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-border underline-offset-4 hover:text-fg hover:decoration-fg"
                >
                  {lesson.repo}
                </a>
              </li>
            ))}
            <li>
              <a
                href="https://github.com/mikepattyn/learn"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-border underline-offset-4 hover:text-fg hover:decoration-fg"
              >
                mikepattyn/learn
              </a>
            </li>
          </ul>
        </footer>
      </main>
    </div>
  );
}
