import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type CodeBlockProps = {
  lang: string;
  file?: string;
  content: string;
};

export function CodeBlock({ lang, file, content }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <figure className="overflow-hidden rounded-xl bg-code shadow-border">
      <figcaption className="flex items-center justify-between gap-3 border-b border-fg/10 px-3 py-2">
        <span className="truncate font-mono text-xs text-code-muted">
          {file ?? lang}
        </span>
        <Button
          type="button"
          variant="quiet"
          size="icon"
          className="size-9 text-code-muted hover:text-code-fg hover:bg-fg/5"
          onClick={() => void copy()}
          aria-label={copied ? "Copied" : "Copy code"}
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        </Button>
      </figcaption>
      <pre className="max-h-[min(24rem,70vh)] overflow-auto px-4 py-3 text-[0.8125rem] leading-relaxed text-code-fg">
        <code className="font-mono">{content}</code>
      </pre>
    </figure>
  );
}
