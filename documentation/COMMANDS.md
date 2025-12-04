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

- Name – short description (what it does, what parameters it takes)

---

## Command: refactor

### Usage

`use command refactor <path?>`

- `<path>` is optional.
- If provided → the agent refactors only that specific file or directory.
- If not provided → the agent refactors the entire project.

### Refactoring Rules (based on AGENTS.md)

1. A component must not contain more than **two helper functions**.
2. If a component has more:

- Extract extra functions into:
  - separate subcomponents (UI-related logic),
  - `lib/` (pure utilities or formatters),
  - `hooks/` (stateful or reusable React logic),
  - `services/` (API calls or business logic).

3. After extraction:

- Fix imports in the original component.
- Ensure strong TypeScript typing.
- If a new helper/hook/service was created, add its entry to `DOCS.md`.

4. The agent must also:

- Ensure usage of shadcn/ui or existing `/src/components/ui/` components.
- Remove dead code, unused variables, and duplicated logic.
- Improve code readability and structure:
  - Simplify conditions,
  - Split oversized JSX into smaller subcomponents,
  - Improve naming consistency.

5. After the refactor, the agent must internally “run” (simulate):

- `npm run lint`
- `npm run build`
  And resolve any issues.

6. The agent must provide:

- A clear explanation of performed changes,
- Before/after code blocks (when needed),
- Extracted helper components or utils,
- Any updates made to `DOCS.md`.

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

- Name – short description (what it does, what parameters it takes)

---

## Command: check

### Usage

`use command check`

### Agent Actions

1. Execute the following commands:
   `npm run lint`
   `npm run build`

2. Fix any problems if there are any.
