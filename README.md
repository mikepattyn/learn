# Learn

Small AWS lessons. One step at a time. Written to be safe for ADHD brains: one screen, no streaks, no quizzes, nothing that expires.

This repository is the **classroom website** (Angular 22 CSR) and the markdown curriculum.

## Run the classroom

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

```bash
npm test
npm run build
npm run preview
```

Progress and prefs stay in the browser. Nothing is sent to a server.

## The path

**First contact email** — scaffold an umbrella, send mail with `Mikepattyn.Email`, then wire `Mikepattyn.Contact.Api` as an API Gateway Lambda.

| # | Lesson | Source |
|---|--------|--------|
| 1 | [Scaffold a new umbrella](curriculum/01-scaffold-the-umbrella.md) | [mikepattyn/.cursor](https://github.com/mikepattyn/.cursor) |
| 2 | [Send mail with Mikepattyn.Email](curriculum/02-the-email-package.md) | [mikepattyn/Mikepattyn.Email](https://github.com/mikepattyn/Mikepattyn.Email) |
| 3 | [Wire Contact.Api on Lambda](curriculum/03-contact-api-lambda.md) | [mikepattyn/Mikepattyn.Contact.Api](https://github.com/mikepattyn/Mikepattyn.Contact.Api) |

How the room is supposed to feel: [curriculum/00-how-this-works.md](curriculum/00-how-this-works.md).

Interactive copies of the same lessons live in [`src/app/features/classroom/domain/lessons/`](src/app/features/classroom/domain/lessons/).

## Add a lesson

Use the Cursor skill [`add-learn-lesson`](https://github.com/mikepattyn/.cursor/blob/main/skills/add-learn-lesson/SKILL.md). A copy is in [`.cursor/skills/add-learn-lesson/`](.cursor/skills/add-learn-lesson/).

## Classroom rules

- One step. Not a wall of docs.
- Still motion unless you ask for a little.
- No quizzes. No punishing streaks.
- An 8-minute timer, visual only.
- You park whenever you want. The step will wait.

## License

MIT. See [LICENSE](LICENSE).
