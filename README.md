# Logistic Project

Next.js 16 + React 19 интерфейс для управления логистическими процессами: панели, формы и таблицы из dashboard-а работают поверх backend-а, а схемы API синхронизируются в `src/shared/types/api.ts`. Проект собирает UI на shadcn/ui и Tailwind, использует React Query для работы с серверным состоянием и строгую типизацию TypeScript.

## Скрипты

| Скрипт | Назначение |
| --- | --- |
| `npm run dev` | Локальный дев-сервер Next.js |
| `npm run build` | Продакшн-сборка приложения |
| `npm run start` | Старт собранного приложения на порту `3002` |
| `npm run lint` | Проверка кода ESLint |
| `npm run gen:types` | Генерация клиентских типов из OpenAPI схемы |

## Runtime зависимости

| Пакет | Для чего нужен |
| --- | --- |
| `next` | Фреймворк и рендеринг приложения |
| `react`, `react-dom` | UI-движок и рендерер |
| `next-devtools-mcp` | Девтулы для Next.js в MCP окружении |
| `axios` | HTTP-клиент для вызова API |
| `@tanstack/react-query` | Серверное состояние, запросы и кэш |
| `@tanstack/react-table` | Табличные данные в dashboard |
| `zustand` | Легковесное клиентское состояние |
| `react-hook-form` | Формы и валидации |
| `react-day-picker` | Компоненты выбора дат |
| `date-fns` | Утилиты работы с датами |
| `react-hot-toast` | Toast-уведомления |
| `nextjs-toploader` | Прогресс-бар при навигации |
| `js-cookie` | Работа с cookie в браузере |
| `@floating-ui/dom` | Позиционирование поповеров и тултипов |
| `shadcn/ui`, `cmdk`, `class-variance-authority`, `clsx`, `tailwind-merge` | Библиотеки дизайн-системы и утилиты классов |
| `@tailwindcss/typography` | Tailwind пресет типографики |
| `lucide-react` | Иконки |
| `@radix-ui/react-*` (checkbox, dialog, dropdown-menu, label, popover, radio-group, select, slot, tabs, toggle, tooltip) | Аксессибл-примитивы для компонентов интерфейса |
| `@tiptap/*` (core, extensions, pm, react, starter-kit) | Редактор контента и все расширения (heading, highlight, link, placeholder, text-align, youtube) |

## DevDependencies

| Пакет | Для чего нужен |
| --- | --- |
| `typescript` | Язык и проверки типов |
| `@types/node`, `@types/react`, `@types/react-dom`, `@types/js-cookie` | Тайпинги для TS |
| `eslint`, `eslint-config-next`, `@eslint/eslintrc` | Линтинг и правила |
| `tailwindcss`, `@tailwindcss/postcss`, `tailwind-scrollbar`, `tw-animate-css` | Настройка Tailwind и анимаций |
| `openapi-typescript` | Генерация типов API |

## Архитектура

- **Frontend**: корень репозитория, Next.js App Router, shadcn/ui компоненты (`src/components/ui`).  
- **Типы API**: актуализируются в `src/shared/types/api.ts` через OpenAPI схему.  