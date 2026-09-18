import type { Lesson } from "./types";

export const scaffoldLesson: Lesson = {
  id: "scaffold",
  number: 1,
  title: "Scaffold a new umbrella",
  summary: "Invoke the Cursor skill on purpose. Pick a topology. Let it write the repo. Then stop.",
  minutes: 14,
  repo: "mikepattyn/.cursor",
  repoUrl: "https://github.com/mikepattyn/.cursor",
  steps: [
    {
      id: "what",
      title: "What this skill is",
      why: "If you treat it like a chat tip, it will not run — and that is on purpose.",
      minutes: 2,
      blocks: [
        {
          type: "p",
          text: "The skill lives in mikepattyn/.cursor. Its name is scaffold-umbrella-with-turbo-and-pnpm. It builds a catalog-driven umbrella: Turborepo, pnpm, a context map, ADRs, Diátaxis docs, Docker Compose, and TypeScript CDK that only imports DNS and TLS.",
        },
        {
          type: "p",
          text: "It is explicit-invocation only. Cursor will not start it because you mentioned monorepos, CDK, or frameworks. You have to call it.",
        },
        {
          type: "caution",
          text: "Do not run this skill against the mikepattyn or pattynologies checkouts. Read those for shape. Never copy .NET CDK, gitlinks, or real Constants.Deployment values.",
        },
        {
          type: "link",
          label: "Open the skill repo",
          href: "https://github.com/mikepattyn/.cursor",
        },
      ],
    },
    {
      id: "install",
      title: "Put the skill where Cursor can see it",
      why: "Cursor only runs skills that sit in a skills folder it already watches.",
      minutes: 2,
      blocks: [
        {
          type: "p",
          text: "Clone the repo, then copy one folder — the skill itself — into your Cursor skills shelf. Do not copy the whole .cursor git repo into a product repo.",
        },
        {
          type: "code",
          lang: "bash",
          file: "terminal",
          content: `git clone https://github.com/mikepattyn/.cursor.git ~/.cursor-skills-src

mkdir -p ~/.cursor/skills
cp -R ~/.cursor-skills-src/skills/scaffold-umbrella-with-turbo-and-pnpm \\
  ~/.cursor/skills/scaffold-umbrella-with-turbo-and-pnpm`,
        },
        {
          type: "note",
          text: "A project-local copy also works: <repo>/.cursor/skills/scaffold-umbrella-with-turbo-and-pnpm. User-level is enough for greenfield work.",
        },
        {
          type: "p",
          text: "You should now see SKILL.md, reference.md, assets/, and scripts/ inside that skill folder. If SKILL.md is missing, Cursor cannot invoke it.",
        },
      ],
    },
    {
      id: "invoke",
      title: "Invoke it on purpose",
      why: "The skill refuses ambient chat. A slash command is the whole trick.",
      minutes: 1,
      blocks: [
        {
          type: "p",
          text: "In a Cursor agent chat, type the skill name. That is the start. Do not paste the SKILL.md at it. Do not ask it to “make a monorepo like Mike’s.”",
        },
        {
          type: "code",
          lang: "text",
          file: "Cursor chat",
          content: `/scaffold-umbrella-with-turbo-and-pnpm

Generate a new umbrella at ~/src/my-app.
Topology: web-bff-service.
Frontend: react-app. BFF: express-bff. Service: python-api.
AWS region: eu-west-1.`,
        },
        {
          type: "list",
          items: [
            "generate — default. Empty folder. Write files.",
            "resume — continue from scaffold.manifest.yaml. Will not overwrite your edits.",
            "validate-only — run verify-scaffold.mjs and stop.",
            "explain — print the plan. Write nothing.",
          ],
        },
        {
          type: "note",
          text: "If the folder already has files, the skill refuses unless you chose resume and a matching manifest is there.",
        },
      ],
    },
    {
      id: "topology",
      title: "Pick a topology first",
      why: "Every later question depends on this. Changing it later means starting over.",
      minutes: 2,
      blocks: [
        {
          type: "p",
          text: "Answer topology before frameworks. If you already said web-bff-service in the invoke message, it should not ask again.",
        },
        {
          type: "kv",
          rows: [
            { key: "web-only", value: "Frontend + CDK hosting. No BFF, no microservice." },
            { key: "web-bff-service", value: "Recommended quick-start. UI, thin BFF, calculator service." },
            { key: "direct-api", value: "API without a BFF in front." },
            { key: "worker-queue", value: "Background work, not a website." },
            { key: "library", value: "A package, not an app." },
            { key: "multiplatform", value: "Adds mobile or desktop. Confirm native toolchains first." },
          ],
        },
        {
          type: "p",
          text: "For web-bff-service you then pick one frontend, one BFF, and one service. Optional extras (worker, CLI, Expo, Tauri) stay off unless you ask.",
        },
        {
          type: "note",
          text: "Defaults: new empty folder, umbrella name = folder name, example.com, region eu-west-1, packages private.",
        },
      ],
    },
    {
      id: "preview",
      title: "Read the preview, then the context map",
      why: "Two stops exist so you do not get a surprise repo. Both are cheap. Skipping them is expensive.",
      minutes: 2,
      blocks: [
        {
          type: "p",
          text: "Before any files, the skill prints topology, template ids, destinations, ports, commands, and native warnings. Check the derived names too.",
        },
        {
          type: "kv",
          rows: [
            { key: "folder", value: "my-app" },
            { key: "npm scope", value: "@my-app" },
            { key: ".NET namespace", value: "MyApp" },
            { key: "Java package", value: "com.myapp" },
          ],
        },
        {
          type: "p",
          text: "Say proceed only if those look right. Next it writes a CONTEXT-MAP.md and waits. Review that map. Implementation must not start until you have.",
        },
        {
          type: "caution",
          text: "If you rubber-stamp the map, you still own the layout. This is the last quiet moment before a lot of files appear.",
        },
      ],
    },
    {
      id: "phases",
      title: "Let the eleven phases run",
      why: "You do not drive each file. You watch the checklist. Resume uses the same list.",
      minutes: 2,
      blocks: [
        {
          type: "p",
          text: "After the map, the skill copies its own project skills, writes ADRs and Diátaxis docs, then the Turbo/pnpm umbrella, then the selected templates, Compose, and TypeScript CDK.",
        },
        {
          type: "list",
          items: [
            "Install project skills into .cursor/skills/ — not this scaffold skill itself.",
            "ADR 0001 for Turbo + pnpm + CDK. ADR 0002 when a persist path exists.",
            "Leaves get package.json. Grouping folders do not.",
            "JS apps join the pnpm graph. FastAPI, ASP.NET, Python, Rust, Go stay outside it.",
            "CDK is import-only DNS/TLS. Hosting is private S3 + CloudFront. It does not cdk deploy unless you ask.",
          ],
        },
        {
          type: "caution",
          text: "Constants.Deployment.ts is gitignored. The committed file is the .example. It holds account, region, zone id, cert ARN. Never access keys.",
        },
      ],
    },
    {
      id: "tree",
      title: "What should exist when it finishes",
      why: "A missing leaf usually means the wrong topology, not a broken machine.",
      minutes: 2,
      blocks: [
        {
          type: "p",
          text: "For the recommended web-bff-service you get a calculator example: rules package, UI package, app, BFF, service, OpenAPI contract, Compose, and CDK.",
        },
        {
          type: "code",
          lang: "text",
          file: "umbrella layout",
          content: `my-app/
  apps/frontend/<framework>/example-app
  apps/backend/<bff>/example-bff
  apps/backend/<ms>/example-calculator
  packages/frontend/typescript/example-calculator
  packages/frontend/<framework>/example-calculator
  packages/contracts/openapi/calculator-api
  infra/cdk/
  docker/
  docs/adr/   docs/tutorial/   docs/how-to/
  .cursor/skills/
  scaffold.manifest.yaml`,
        },
        {
          type: "flow",
          nodes: [
            { label: "UI", hint: ":4200" },
            { label: "BFF", hint: ":3000" },
            { label: "Service", hint: ":8081" },
            { label: "SQLite file", hint: "volume" },
          ],
        },
        {
          type: "note",
          text: "The UI computes locally. Persist is best-effort through the BFF. CDK does not deploy the BFF or the microservice.",
        },
      ],
    },
    {
      id: "verify",
      title: "Verify, then leave it alone",
      why: "The skill already knows how to check itself. Do not hand-edit fifty files to “tidy up.”",
      minutes: 1,
      blocks: [
        {
          type: "p",
          text: "When the phases complete, verification is one script. Green means the catalog destinations exist, healthchecks are filled, and JS leaves are in the Turbo graph.",
        },
        {
          type: "code",
          lang: "bash",
          file: "umbrella root",
          content: `node scripts/verify-scaffold.mjs .
node scripts/repo.mjs check
node scripts/repo.mjs dev:web`,
        },
        {
          type: "list",
          items: [
            "Commit only when you ask for a commit.",
            "Never push unless you ask.",
            "Do not nest this tree inside the Portfolio remote.",
            "Resume later with the same skill if a phase died mid-run.",
          ],
        },
        {
          type: "p",
          text: "That is the scaffold. Park here. The next lesson sits the Email library next to Contact.Api so a form can actually send mail.",
        },
      ],
    },
  ],
};
