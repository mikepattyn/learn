# Lesson 1 — Scaffold a new umbrella

Source: [mikepattyn/.cursor](https://github.com/mikepattyn/.cursor)  
Skill: `scaffold-umbrella-with-turbo-and-pnpm`  
About 14 minutes. Eight steps. Tick one, then stop if you want.

## 1. What this skill is

The skill lives in mikepattyn/.cursor. Its name is scaffold-umbrella-with-turbo-and-pnpm. It builds a catalog-driven umbrella: Turborepo, pnpm, a context map, ADRs, Diátaxis docs, Docker Compose, and TypeScript CDK that only imports DNS and TLS.

It is explicit-invocation only. Cursor will not start it because you mentioned monorepos, CDK, or frameworks. You have to call it.

Do **not** run this skill against the mikepattyn or pattynologies checkouts. Read those for shape. Never copy .NET CDK, gitlinks, or real `Constants.Deployment` values.

## 2. Put the skill where Cursor can see it

Clone the repo, then copy one folder — the skill itself — into your Cursor skills shelf. Do not copy the whole `.cursor` git repo into a product repo.

```bash
git clone https://github.com/mikepattyn/.cursor.git ~/.cursor-skills-src

mkdir -p ~/.cursor/skills
cp -R ~/.cursor-skills-src/skills/scaffold-umbrella-with-turbo-and-pnpm \
  ~/.cursor/skills/scaffold-umbrella-with-turbo-and-pnpm
```

A project-local copy also works: `<repo>/.cursor/skills/scaffold-umbrella-with-turbo-and-pnpm`. User-level is enough for greenfield work.

You should now see `SKILL.md`, `reference.md`, `assets/`, and `scripts/` inside that skill folder. If `SKILL.md` is missing, Cursor cannot invoke it.

## 3. Invoke it on purpose

In a Cursor agent chat, type the skill name. That is the start. Do not paste the SKILL.md at it. Do not ask it to “make a monorepo like Mike’s.”

```
/scaffold-umbrella-with-turbo-and-pnpm

Generate a new umbrella at ~/src/my-app.
Topology: web-bff-service.
Frontend: react-app. BFF: express-bff. Service: python-api.
AWS region: eu-west-1.
```

Modes:

- `generate` — default. Empty folder. Write files.
- `resume` — continue from `scaffold.manifest.yaml`. Will not overwrite your edits.
- `validate-only` — run `verify-scaffold.mjs` and stop.
- `explain` — print the plan. Write nothing.

If the folder already has files, the skill refuses unless you chose resume and a matching manifest is there.

## 4. Pick a topology first

Answer topology before frameworks. If you already said `web-bff-service` in the invoke message, it should not ask again.

| Topology | Meaning |
|----------|---------|
| `web-only` | Frontend + CDK hosting. No BFF, no microservice. |
| `web-bff-service` | Recommended quick-start. UI, thin BFF, calculator service. |
| `direct-api` | API without a BFF in front. |
| `worker-queue` | Background work, not a website. |
| `library` | A package, not an app. |
| `multiplatform` | Adds mobile or desktop. Confirm native toolchains first. |

For `web-bff-service` you then pick one frontend, one BFF, and one service. Optional extras (worker, CLI, Expo, Tauri) stay off unless you ask.

Defaults: new empty folder, umbrella name = folder name, `example.com`, region `eu-west-1`, packages private.

## 5. Read the preview, then the context map

Before any files, the skill prints topology, template ids, destinations, ports, commands, and native warnings. Check the derived names too.

Example from `My App`: folder `my-app`, npm scope `@my-app`, .NET namespace `MyApp`, Java package `com.myapp`.

Say proceed only if those look right. Next it writes a `CONTEXT-MAP.md` and waits. Review that map. Implementation must not start until you have.

If you rubber-stamp the map, you still own the layout. This is the last quiet moment before a lot of files appear.

## 6. Let the eleven phases run

After the map, the skill copies its own project skills, writes ADRs and Diátaxis docs, then the Turbo/pnpm umbrella, then the selected templates, Compose, and TypeScript CDK.

- Install project skills into `.cursor/skills/` — not this scaffold skill itself.
- ADR 0001 for Turbo + pnpm + CDK. ADR 0002 when a persist path exists.
- Leaves get `package.json`. Grouping folders do not.
- JS apps join the pnpm graph. FastAPI, ASP.NET, Python, Rust, Go stay outside it.
- CDK is import-only DNS/TLS. Hosting is private S3 + CloudFront. It does not `cdk deploy` unless you ask.

`Constants.Deployment.ts` is gitignored. The committed file is the `.example`. It holds account, region, zone id, cert ARN. Never access keys.

## 7. What should exist when it finishes

For the recommended `web-bff-service` you get a calculator example: rules package, UI package, app, BFF, service, OpenAPI contract, Compose, and CDK.

```
my-app/
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
  scaffold.manifest.yaml
```

The UI computes locally. Persist is best-effort through the BFF. CDK does not deploy the BFF or the microservice.

Flow: UI `:4200` → BFF `:3000` → Service `:8081` → SQLite file on a volume.

## 8. Verify, then leave it alone

When the phases complete, verification is one script. Green means the catalog destinations exist, healthchecks are filled, and JS leaves are in the Turbo graph.

```bash
node scripts/verify-scaffold.mjs .
node scripts/repo.mjs check
node scripts/repo.mjs dev:web
```

- Commit only when you ask for a commit.
- Never push unless you ask.
- Do not nest this tree inside the Portfolio remote.
- Resume later with the same skill if a phase died mid-run.

That is the scaffold. Park here. The next lesson sits the Email library next to Contact.Api so a form can actually send mail.
