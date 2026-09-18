import * as Dialog from "@radix-ui/react-dialog";
import { Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePrefs, type Motion, type Theme, type TypeSize } from "@/lib/prefs";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/cn";

function Choice<T extends string>({
  label,
  value,
  current,
  onChange,
}: {
  label: string;
  value: T;
  current: T;
  onChange: (value: T) => void;
}) {
  const selected = value === current;
  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={cn(
        "min-h-11 rounded-lg px-3 text-sm transition-[background-color,box-shadow,color] duration-(--motion-quick)",
        selected ? "bg-accent text-accent-fg" : "bg-surface text-fg shadow-border hover:shadow-border-hover",
      )}
      aria-pressed={selected}
    >
      {label}
    </button>
  );
}

export function PrefsSheet() {
  const theme = usePrefs((s) => s.theme);
  const typeSize = usePrefs((s) => s.typeSize);
  const motion = usePrefs((s) => s.motion);
  const setTheme = usePrefs((s) => s.setTheme);
  const setTypeSize = usePrefs((s) => s.setTypeSize);
  const setMotion = usePrefs((s) => s.setMotion);
  const resetAll = useProgress((s) => s.resetAll);

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button type="button" variant="ghost" size="icon" aria-label="Classroom settings">
          <Settings className="size-4" />
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-ink/40 data-[state=open]:animate-[fade-in_var(--motion-fast)_var(--ease-smooth-out)]" />
        <Dialog.Content
          className="fixed top-1/2 left-1/2 z-50 w-[min(28rem,calc(100vw-1.5rem))] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-bg p-5 shadow-border focus:outline-none"
          aria-describedby={undefined}
        >
          <div className="mb-4 flex items-start justify-between gap-3">
            <Dialog.Title className="text-lg font-medium tracking-tight">How this room feels</Dialog.Title>
            <Dialog.Close asChild>
              <Button type="button" variant="ghost" size="icon" className="size-10" aria-label="Close">
                <X className="size-4" />
              </Button>
            </Dialog.Close>
          </div>
          <div className="flex flex-col gap-5">
            <fieldset className="flex flex-col gap-2">
              <legend className="text-xs font-medium tracking-wide text-muted uppercase">Light</legend>
              <div className="flex gap-2">
                <Choice<Theme> label="Paper" value="paper" current={theme} onChange={setTheme} />
                <Choice<Theme> label="Ink" value="ink" current={theme} onChange={setTheme} />
              </div>
            </fieldset>
            <fieldset className="flex flex-col gap-2">
              <legend className="text-xs font-medium tracking-wide text-muted uppercase">Type size</legend>
              <div className="flex gap-2">
                <Choice<TypeSize> label="Comfortable" value="comfortable" current={typeSize} onChange={setTypeSize} />
                <Choice<TypeSize> label="Large" value="large" current={typeSize} onChange={setTypeSize} />
              </div>
            </fieldset>
            <fieldset className="flex flex-col gap-2">
              <legend className="text-xs font-medium tracking-wide text-muted uppercase">Motion</legend>
              <div className="flex gap-2">
                <Choice<Motion> label="Still" value="reduce" current={motion} onChange={setMotion} />
                <Choice<Motion> label="A little" value="a-little" current={motion} onChange={setMotion} />
              </div>
              <p className="text-sm text-muted text-pretty">Still is the default. Nothing here blinks or streaks.</p>
            </fieldset>
            <div className="border-t border-border pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  if (window.confirm("Clear all lesson ticks? The steps stay. Only your checks go.")) {
                    resetAll();
                  }
                }}
              >
                Clear my ticks
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
