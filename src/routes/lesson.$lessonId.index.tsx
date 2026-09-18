import { createFileRoute, Navigate } from "@tanstack/react-router";
import { firstIncompleteStep, getLesson } from "@/lib/lessons/catalog";
import { useProgress } from "@/lib/progress";

export const Route = createFileRoute("/lesson/$lessonId/")({
  component: LessonIndex,
});

function LessonIndex() {
  const { lessonId } = Route.useParams();
  const lesson = getLesson(lessonId);
  const completed = useProgress((s) => s.completed);
  const lastStepId = useProgress((s) => s.lastStepId);
  const lastLessonId = useProgress((s) => s.lastLessonId);

  if (!lesson) {
    return <Navigate to="/" />;
  }

  const stored =
    lastLessonId === lesson.id && lastStepId
      ? lesson.steps.find((step) => step.id === lastStepId)
      : undefined;
  const step = stored ?? firstIncompleteStep(lesson, completed[lesson.id] ?? []);

  return <Navigate to="/lesson/$lessonId/$stepId" params={{ lessonId: lesson.id, stepId: step.id }} />;
}
