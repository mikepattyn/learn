export type FlowNode = {
  label: string;
  hint?: string;
};

export type Block =
  | { type: "p"; text: string }
  | { type: "code"; lang: string; file?: string; content: string }
  | { type: "list"; items: string[] }
  | { type: "caution"; text: string }
  | { type: "note"; text: string }
  | { type: "flow"; nodes: FlowNode[] }
  | { type: "kv"; rows: { key: string; value: string }[] }
  | { type: "link"; label: string; href: string };

export type Step = {
  id: string;
  title: string;
  why: string;
  minutes: number;
  blocks: Block[];
};

export type Lesson = {
  id: string;
  number: number;
  title: string;
  summary: string;
  minutes: number;
  repo: string;
  repoUrl: string;
  steps: Step[];
};

export type Track = {
  id: string;
  title: string;
  summary: string;
  lessons: Lesson[];
};
