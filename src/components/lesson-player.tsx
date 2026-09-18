import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Circle, RotateCcw } from "lucide-react";
import { FocusTimer } from "@/components/focus-timer";
import { StepBlocks } from "@/components/step-blocks";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { adjacentSteps, nextLesson } from "@/lib/lessons/catalog";
import type { Lesson, Step } from "@/lib/lessons/types";
import { isStepDone, useProgress } from "@/lib/progress";

type LessonPlayerProps = {
  lesson: Lesson;
  step: Step;
};

export function LessonPlayer({ lesson, step }: LessonPlayerProps) {
  const navigate = useNavigate();
  const completed = useProgress((s) => s.completed);
  const markDone = useProgress((s) => s.markDone);
  const unmark = useProgress((s) => s.unmark);
  const setLast = useProgress((s) => s.setLast);
  const resetLesson = useProgress((s) => s.resetLesson);
  const doneIds = completed[lesson.id] ?? [];
  const done = isStepDone(completed, lesson.id, step.id);
  const { index, prev, next } = adjacentSteps(lesson, step.id);
  const following = nextLesson(lesson.id);
  const total = lesson.steps.length;
  const currentNumber = index + 1;
  const lessonComplete = doneIds.length === total;

  function go(lessonId: string, stepId: string) {
    setLast(lessonId, stepId);
    void navigate({ to: "/lesson/$lessonId/$stepId", params: { lessonId, stepId } });
  }

  function completeAndAdvance() {
    markDone(lesson.id, step.id);
    if (next) {
      go(lesson.id, next.id);
      return;
    }
    if (following) {
      go(following.id, following.steps[0].id);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 pb-28 sm:pb-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/"
          className="inline-flex min-h-11 items-center gap-2 text-sm text-muted hover:text-fg"
        >
          <ArrowLeft className="size-4" />
          Park and go home
        </Link>
        <FocusTimer />
      </div>

      <div>
        <p className="text-xs font-medium tracking-wide text-muted uppercase">
          Lesson {lesson.number} · Step {currentNumber} of {total}
        </p>
        <h1 className="mt-2 text-3xl font-medium tracking-tight text-balance text-fg sm:text-4xl">{step.title}</h1>
        <p className="mt-3 max-w-prose text-pretty text-muted leading-relaxed">
          <span className="font-medium text-fg">Why. </span>
          {step.why}
        </p>
      </div>

      <div className="h-1 overflow-hidden rounded-full bg-surface">
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-(--motion-fast) ease-(--ease-smooth-out)"
          style={{ width: `${(currentNumber / total) * 100}%` }}
        />
      </div>

      <details className="rounded-xl bg-surface px-4 py-2 shadow-border">
        <summary className="min-h-11 cursor-pointer list-none py-2 text-sm text-muted [&::-webkit-details-marker]:hidden">
          All steps in this lesson
        </summary>
        <ol className="flex flex-col gap-1 pb-3">
          {lesson.steps.map((item, itemIndex) => {
            const itemDone = isStepDone(completed, lesson.id, item.id);
            const current = item.id === step.id;
            return (
              <li key={item.id}>
                <Link
                  to="/lesson/$lessonId/$stepId"
                  params={{ lessonId: lesson.id, stepId: item.id }}
                  onClick={() => setLast(lesson.id, item.id)}
                  className={cn(
                    "flex min-h-11 items-center gap-3 rounded-lg px-2 text-sm",
                    current ? "bg-bg text-fg" : "text-muted hover:text-fg",
                  )}
                >
                  {itemDone ? (
                    <Check className="size-4 text-accent" />
                  ) : (
                    <Circle className="size-4" />
                  )}
                  <span>
                    {itemIndex + 1}. {item.title}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </details>

      <StepBlocks blocks={step.blocks} />

      <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {prev ? (
            <Button type="button" variant="secondary" onClick={() => go(lesson.id, prev.id)}>
              <ArrowLeft className="size-4" />
              Back
            </Button>
          ) : (
            <Button type="button" variant="secondary" asChild>
              <Link to="/">Home</Link>
            </Button>
          )}
          {done ? (
            <Button type="button" variant="quiet" onClick={() => unmark(lesson.id, step.id)}>
              Uncheck this step
            </Button>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          {done && next ? (
            <Button type="button" onClick={() => go(lesson.id, next.id)}>
              Next step
              <ArrowRight className="size-4" />
            </Button>
          ) : done && following ? (
            <Button type="button" onClick={() => go(following.id, following.steps[0].id)}>
              Next lesson
              <ArrowRight className="size-4" />
            </Button>
          ) : done && lessonComplete ? (
            <Button type="button" asChild>
              <Link to="/">Done. Go home</Link>
            </Button>
          ) : (
            <Button type="button" onClick={completeAndAdvance}>
              I did this
              <Check className="size-4" />
            </Button>
          )}
        </div>
      </div>

      {lessonComplete ? (
        <p className="text-sm text-muted text-pretty">
          Lesson {lesson.number} is ticked. Nothing expires. You can walk it again whenever you want.
        </p>
      ) : null}

      <button
        type="button"
        className="inline-flex min-h-11 w-fit items-center gap-2 text-xs text-muted hover:text-fg"
        onClick={() => resetLesson(lesson.id)}
      >
        <RotateCcw className="size-3.5" />
        Reset this lesson
      </button>
    </div>
  );
}
