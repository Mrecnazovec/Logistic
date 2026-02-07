# COMMANDS.md

This file describes the commands that the agent must execute when the user types:  
`use command <commandName> <value?>`  
If a command is not found, the agent must reply:  
**"Command not found in COMMANDS.md."**

---

## Command: commit

### Usage

`use command commit "<description>"`  
Where `<description>` is the user-provided commit message.

### Agent Actions

1. Execute the following Git commands:
   npm run lint
   npm run build
   git add .
   git commit -m "<description>"
   git push
2. After pushing:

- The agent must detect which files were added or changed.
- If any of those files fall under the categories that must be documented in `DOCS.md`  
  (hooks, utils, services, enums, types, regex patterns, components, stores),  
  then the agent must update `DOCS.md`.

3. Updating `DOCS.md` includes:

- Adding entries for newly created utilities/hooks/services/types/enums/regex/components/stores.
- Updating entries when functionality has changed.
- Removing entries when the corresponding source files were deleted.

4. Format of every `DOCS.md` entry must be strictly one line:

- Name - short description (what it does, what parameters it takes)

---

## Command: refactor

### Usage

`use command refactor <path?>`

- `<path>` is optional.
- If provided -> the agent refactors only that specific file or directory.
- If not provided -> the agent refactors the entire project.

### Refactoring Rules (AGENTS.md + current constraints)

1. Goal: make code shorter and simpler without changing behavior - minimal layers, straightforward JSX, keep type safety.
2. No more than two local helper functions per component. If you need more, move logic into child components/`lib`/`hooks`/`services` as appropriate.
3. Drop `useMemo`/`useCallback` unless needed for heavy work, effect dependencies, or real rerender prevention.
4. Skip data "normalization" and extra intermediate arrays/constants when simple `map/filter` and inline conditions/JSX are enough.
5. Format values (dates, prices, etc.) at the usage site or minimally locally; don't create extra formatters just for cosmetics.
6. File layout: `"use client"`, imports, types/interfaces, shared constants, then the component with hooks at the top and `return` with no important logic after it. One component per file (tiny skeletons are fine).
7. Always use shadcn/ui or existing `/src/components/ui/` components. Follow shared rules (enums/types/regex) and update DOCS.md when entities are added/removed/renamed.
8. Remove dead code and duplication. Keep code concise but readable.
9. After refactor, run `npm run lint` and `npm run build` and fix issues.
10. In the response, give a brief description of changes and note any DOCS.md updates (if applicable).

---

## Unknown Command Behavior

If the user runs:
`use command somethingElse`

The agent must respond:

- Command "somethingElse" not found in COMMANDS.md.

## Command: gen-types

### Usage

`use command gen-types`

### Agent Actions

1. Execute the following commands:
   `npm run gen:types`

2. After updating:

- The agent must detect which methods were added or changed.

- If new endpoints are added, create new services and hooks. If existing ones have changed, modify the existing services and hooks as needed. Then add or modify the usage of services and hooks in the application. Then document the new elements (hooks, utils, services, enums, types, regex patterns, components, stores) in `DOCS.md`.

3. Updating `DOCS.md` includes:

- Adding entries for newly created utilities/hooks/services/types/enums/regex/components/stores.
- Updating entries when functionality has changed.
- Removing entries when the corresponding source files were deleted.

4. Format of every `DOCS.md` entry must be strictly one line:

- Name - short description (what it does, what parameters it takes)

---

## Command: check

### Usage

`use command check`

### Agent Actions

1. Execute the following commands:
   `npm run lint`
   `npm run build`

2. Fix any problems if there are any.

---

## Command: locale

`use command locale <folder>`

### Agent Actions

- You need to create a "locale" folder in this folder with locale files. You need to upload all the text from the files in the specified folder to it in both locales (en, ru), and then insert the locale system (`i18n`) into the files.

Make distinctions between files, for example, by leaving a comment indicating which file the locale applies to.

---

## Command: decomposing

### Usage

`use command decomposing <path>`

- `<path>` is required.
- The agent scans the folder recursively.
- A file is considered "monolithic" if it has **more than 200 lines of code**.

### Agent Actions

1. Scan all `*.tsx` files inside `<path>` recursively.
2. Detect candidate entry files:
   - Must contain `"use client"`.
   - Must be **> 200 LOC**.
3. For each detected client monolith (example: `AnnouncementsPage.tsx` located next to `page.tsx`):
   - Create a Next.js route group folder next to it: `(<EntryName>)` (example: `(AnnouncementsPage)`).
   - Move the client monolith file into the route group folder and keep the same component export name.
   - Keep `page.tsx` server-only:
     - Update its import to the moved component (example: `./(AnnouncementsPage)/AnnouncementsPage`).
     - Do NOT add `"use client"` to `page.tsx`.
     - Do NOT change `generateMetadata` behavior.
4. Split the moved client component into micro-modules inside the route group folder, preserving behavior and UI:
   - `ui/` – TSX markup pieces (sections, panels, tables, empty/error states). UI components must be mostly presentational and accept data via props.
   - `hooks/` – page-specific hooks (data/state orchestration). Keep hooks focused and typed.
   - `lib/` – pure helpers (formatters, mappers, small utilities). No React inside.
   - `guards/` – logical checks and predicates (permissions, conditions, validators).
   - `constants/` – constants/config for the page (filters, limits, labels, default values).
   - Optional: `types/` – only if the feature truly needs local types.
5. The moved `<EntryName>.tsx` becomes a thin composer:
   - No heavy logic in JSX.
   - Prefer composing `ui/*` components + `hooks/*`.
   - Follow existing project conventions and use shadcn/ui or existing `/src/components/ui` components.
6. Maintain strict boundaries:
   - `ui/` must not call API/services directly.
   - `lib/` must be pure (no React, no side effects).
   - Keep server/client boundary intact (do not accidentally pull client-only code into `page.tsx`).
7. Add an `index.ts` barrel inside the route group folder if it simplifies imports (recommended, not mandatory).
8. Remove dead code and duplication only when clearly unused.
9. Run and fix:
   - `npm run lint`
   - `npm run build`
10. Update `DOCS.md` after successful build:
    - Add entries for newly created hooks/utils/services/enums/types/regex/components/stores.
    - Update entries when functionality changed.
    - Remove entries when corresponding files were deleted.
    - Every entry must be a single line:
      - `Name - short description (what it does, what parameters it takes)`

---