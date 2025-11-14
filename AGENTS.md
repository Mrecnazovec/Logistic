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
- After changes use `npm run lint` to check correctness


