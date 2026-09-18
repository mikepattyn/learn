import { ArrowRight } from "lucide-react";
import type { FlowNode } from "@/lib/lessons/types";

export function FlowRow({ nodes }: { nodes: FlowNode[] }) {
  return (
    <ol className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-stretch">
      {nodes.map((node, index) => (
        <li key={node.label} className="flex flex-1 items-stretch gap-2 min-w-[7.5rem]">
          <div className="flex flex-1 flex-col justify-center rounded-xl bg-surface px-3 py-3 shadow-border">
            <span className="text-sm font-medium text-fg">{node.label}</span>
            {node.hint ? <span className="mt-0.5 font-mono text-xs text-muted">{node.hint}</span> : null}
          </div>
          {index < nodes.length - 1 ? (
            <span className="hidden self-center text-muted sm:flex" aria-hidden="true">
              <ArrowRight className="size-4" />
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
