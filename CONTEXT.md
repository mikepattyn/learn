# Learn classroom

Public ADHD-safe classroom. Own npm package in this git submodule (`https://github.com/mikepattyn/learn.git`). Compose serves it on `:3000`. It is not a `@pattynologies/angular` project.

## Language

**Track**:
Ordered path of lessons. Today: `first-contact-email`.
_Avoid_: course, curriculum folder as the runtime catalog

**Lesson**:
One sitting. 6–8 steps. Public source repo.
_Avoid_: quiz, streak, expiry

**Step**:
One idea on screen. Ticked on this device.
_Avoid_: page, slide

**Park**:
Leave a step. It waits. Home continue uses last lesson/step.
_Avoid_: abandon, fail

## Seams

Public seams under test: lesson catalog, progress storage, lesson player.

Prefs, skip link, header, and the 8-minute visual timer are classroom chrome, not catalog.

## Local

```bash
npm install
npm test
npm run build
npm run dev
```
