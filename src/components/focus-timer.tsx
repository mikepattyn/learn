import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

const FOCUS_SECONDS = 8 * 60;

function format(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function FocusTimer() {
  const [remaining, setRemaining] = useState(FOCUS_SECONDS);
  const [running, setRunning] = useState(false);
  const [ended, setEnded] = useState(false);
  const endedRef = useRef(false);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setRemaining((value) => {
        if (value <= 1) {
          window.clearInterval(id);
          setRunning(false);
          if (!endedRef.current) {
            endedRef.current = true;
            setEnded(true);
          }
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  function reset() {
    endedRef.current = false;
    setEnded(false);
    setRunning(false);
    setRemaining(FOCUS_SECONDS);
  }

  const ratio = remaining / FOCUS_SECONDS;

  return (
    <div className="flex items-center gap-2">
      <div
        className="relative grid size-11 place-items-center"
        role="timer"
        aria-label={`Focus timer ${format(remaining)}`}
      >
        <svg viewBox="0 0 36 36" className="absolute inset-0 size-11 -rotate-90" aria-hidden="true">
          <circle cx="18" cy="18" r="15" fill="none" className="stroke-border" strokeWidth="2.5" />
          <circle
            cx="18"
            cy="18"
            r="15"
            fill="none"
            className="stroke-accent"
            strokeWidth="2.5"
            strokeDasharray={`${ratio * 94.2} 94.2`}
            strokeLinecap="round"
          />
        </svg>
        <span className="relative font-mono text-[0.65rem] tabular-nums text-muted">{format(remaining)}</span>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-11"
        onClick={() => setRunning((value) => !value)}
        aria-label={running ? "Pause timer" : "Start 8 minute focus timer"}
      >
        {running ? <Pause className="size-4" /> : <Play className="size-4" />}
      </Button>
      {remaining !== FOCUS_SECONDS ? (
        <Button type="button" variant="ghost" size="icon" className="size-11" onClick={reset} aria-label="Reset timer">
          <RotateCcw className="size-4" />
        </Button>
      ) : null}
      {ended ? (
        <p className="hidden max-w-[12rem] text-xs leading-snug text-muted sm:block">
          Pause if you want. The step will wait.
        </p>
      ) : null}
    </div>
  );
}
