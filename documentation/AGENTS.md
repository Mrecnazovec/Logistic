# AGENTS.md for LogisticProject

## Project Overview

This project is a web application with a React frontend, a Node.js backend using Express, and a PostgreSQL database.

- **Frontend:** Located in the root directory.
- **Backend:** Located in the `https://kad-one.com/api`.
- **Database schemas:** Defined in `/src/shared/types/api.ts`.

## Development Environment Tips

- To install frontend dependencies run `npm install`.
- Use `npm run dev` to start the development servers.

## Code Style and Conventions

- Use Prettier for code formatting.
- Variable names should be camelCase.
- Function names should be descriptive and follow camelCase.
- Use existing components from `/src/components/ui/`. If the required component is not available, create it using shadcn/ui. If such a component is not in the library, only then create a custom one.

## Specific Task Instructions

- Rely on api.ts when interacting with the backend
- For UI changes, prioritize accessibility and responsive design.
- When refactoring, aim for clear, modular code and update relevant documentation.
- Always use shadcn/ui components
- Use strict mode typescript
- After changes use `npm run lint` and `npm run build` to check correctness
- After making changes, check the spelling of words; there should be no incomprehensible characters left in the files.
- Never use hieroglyphs or obscure symbols. Use only Cyrillic and Latin scripts.

- All interfaces, types and enums that can be used **globally** (for example, exported from `api.ts`) must be moved into the **`shared`** folder and re-exported from there.
- Use consistent structure:

  - `shared/enums` for enums.
  - `shared/types` for types and interfaces.
  - `shared/regex` for regular expressions.

- Enum example: `shared/enums/PriceCurrency.enum.ts`.
- Type example: `shared/types/Offer.interface.ts`.

- A single React component must not contain more than 2 helper functions (local pure helpers inside the same file).
- If you need more than 2 helpers:
  - Decompose the logic:
    - Move UI-related parts into child components in `components/`.
    - Move pure logic into utilities/hooks/services in lib/, hooks/ or services/ (see rules below).
  - Helper functions should be:
    - Small.
    - Focused on a single responsibility.
    - Typed explicitly in TypeScript.
- Always use shadcn/ui components as a base for UI when possible.

- If a component needs a utility / service / hook / formatter:

  - First check `documentation/DOCS.md`
    - If such a helper already exists, use it. Do not duplicate functionality.
  - If there is no suitable helper in `documentation/DOCS.md`:
    - Create a new helper in the lib folder (or hooks / services if appropriate).
    - Immediately add a short description entry for this helper into DOCS.md (see format below).

- Placement guidelines:
  - `lib/` – pure utilities, formatters, common helpers.
  - `hooks/` – React hooks.
  - `services/` – API/services layer, business logic, data fetching abstractions.

## `documentation/DOCS.md` Requirements

- `documentation/DOCS.md` is the single source of truth for all reusable project units.
- It must contain entries for:
  - All hooks from `hooks/`.
  - All helper functions from `lib/`.
  - All existing services from `services/`.
  - All enums from `shared/enums/`.
  - All interfaces and types from `shared/types/`.
  - All regex patterns from `shared/regex/`.
  - All components from `components/`.
  - All stores from `stores/`.

## `documentation/DOCS.md` Entry Format

- Each entry in `documentation/DOCS.md` must follow the format
  - Name of util / service / hook / formatter / enum / regex / component / store – short description (what it does, what props/params it takes).
  - One line per entity, very short, but clear.
  - Examples:
    - useOffersList – React hook that loads and filters offers list by status and pagination params.
- Whenever you add, rename or remove any helper/hook/service/enum/type/regex/component/store, you must update DOCS.md accordingly.

## Command System (`documentation/COMMANDS.md`)

- When the user inputs in chat: `use command <value>` you must:
  - Look up the corresponding command in `documentation/COMMANDS.md`.
  - Execute the command with the provided <value> according to its definition.
- If the command with the given name (or alias) is not found in `documentation/COMMANDS.md`, respond that the command is not defined in `documentation/COMMANDS.md` and no action can be taken.
