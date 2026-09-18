import { AlertTriangle, ArrowUpRight, Info } from "lucide-react";
import { CodeBlock } from "@/components/code-block";
import { FlowRow } from "@/components/flow-row";
import type { Block } from "@/lib/lessons/types";

function Paragraph({ text }: { text: string }) {
  return <p className="text-pretty text-fg leading-relaxed">{text}</p>;
}

export function StepBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="flex flex-col gap-5">
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;
        switch (block.type) {
          case "p":
            return <Paragraph key={key} text={block.text} />;
          case "code":
            return <CodeBlock key={key} lang={block.lang} file={block.file} content={block.content} />;
          case "list":
            return (
              <ul key={key} className="flex flex-col gap-2">
                {block.items.map((item) => (
                  <li key={item} className="flex gap-3 text-pretty leading-relaxed">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );
          case "caution":
            return (
              <aside
                key={key}
                className="flex gap-3 rounded-xl bg-caution-bg px-4 py-3 text-caution-fg shadow-border"
              >
                <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                <p className="text-pretty text-sm leading-relaxed">{block.text}</p>
              </aside>
            );
          case "note":
            return (
              <aside key={key} className="flex gap-3 rounded-xl bg-surface px-4 py-3 text-muted shadow-border">
                <Info className="mt-0.5 size-4 shrink-0" />
                <p className="text-pretty text-sm leading-relaxed">{block.text}</p>
              </aside>
            );
          case "flow":
            return <FlowRow key={key} nodes={block.nodes} />;
          case "kv":
            return (
              <dl key={key} className="flex flex-col divide-y divide-border rounded-xl bg-surface shadow-border">
                {block.rows.map((row) => (
                  <div key={row.key} className="grid gap-1 px-4 py-3 sm:grid-cols-[minmax(10rem,14rem)_1fr] sm:gap-4">
                    <dt className="font-mono text-xs text-fg">{row.key}</dt>
                    <dd className="text-sm text-pretty text-muted leading-relaxed">{row.value}</dd>
                  </div>
                ))}
              </dl>
            );
          case "link":
            return (
              <a
                key={key}
                href={block.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 w-fit items-center gap-2 rounded-lg px-1 text-sm font-medium text-fg underline decoration-border underline-offset-4 hover:decoration-fg"
              >
                {block.label}
                <ArrowUpRight className="size-4" />
              </a>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
