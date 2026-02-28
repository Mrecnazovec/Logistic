# Logistic Project

Frontend приложение для платформы логистики: кабинеты для клиентов, перевозчиков и логистов, доски грузов и заказов, предложения и договоренности, уведомления и профиль.

## Основные возможности

- Аутентификация, регистрация, восстановление доступа.
- Управление грузами: публикация, обновление, приглашения, видимость.
- Работа с предложениями: создание, встречные предложения, приглашения, статусы.
- Заказы: создание, статусы, документы, приглашения водителей.
- Договоренности, рейтинги, платежи.
- Уведомления и аналитика профиля.
- Гео подсказки городов и стран.
- Мультиязычность через i18n.
- Realtime обновления через WebSocket (грузы и уведомления).
- Интеграция с backend на микросервисной архитектуре (домены: auth, loads, offers, orders, payments, ratings, agreements, notifications, support).

## Технологии

- Next.js 16 (App Router), React 19, TypeScript.
- Tailwind CSS и shadcn/ui, Radix UI, Vaul.
- React Query, Zustand.
- React Hook Form, Tiptap editor.
- Axios, date-fns.
- OpenAPI типы: `src/shared/types/api.ts`.

## Используемые библиотеки

| Библиотека | Назначение |
| --- | --- |
| `next` | Next.js фреймворк и App Router. |
| `react`, `react-dom` | Базовый UI рендеринг. |
| `@tanstack/react-query` | Запросы, кэш и мутации API. |
| `@tanstack/react-table` | Таблицы, сортировка и пагинация. |
| `tailwind-merge`, `clsx` | Склейка классов Tailwind. |
| `class-variance-authority` | Варианты классов для компонентов. |
| `cmdk` | Командная палитра. |
| `@radix-ui/react-*` | Низкоуровневые доступные UI примитивы. |
| `@floating-ui/dom` | Позиционирование поповеров и тултипов. |
| `vaul` | Drawer панели. |
| `react-day-picker` | Выбор дат. |
| `react-hook-form` | Формы и валидация. |
| `react-hot-toast` | Toast уведомления. |
| `nextjs-toploader` | Индикатор загрузки маршрутов. |
| `lucide-react` | Иконки. |
| `recharts` | Графики и чарты. |
| `date-fns` | Работа с датами. |
| `dompurify` | Очистка HTML. |
| `input-otp` | Ввод одноразовых кодов. |
| `js-cookie` | Работа с cookies. |
| `@tiptap/*` | Редактор текста (Tiptap). |
| `axios` | HTTP клиент. |
| `zustand` | Глобальные сторы. |

## Команды

| Скрипт | Назначение |
| --- | --- |
| `npm run dev` | Запуск dev сервера Next.js |
| `npm run build` | Production сборка |
| `npm run start` | Запуск production на порту `3002` |
| `npm run lint` | Проверка ESLint |
| `npm run gen:types` | Генерация типов из OpenAPI в `src/shared/types/api.ts` |

## Структура проекта

- `src/app` - роуты и страницы (App Router).
- `src/components` - UI компоненты и составные виджеты, включая `src/components/ui`.
- `src/hooks` - React hooks для запросов и бизнес логики.
- `src/services` - слой API сервисов.
- `src/lib` - утилиты и форматтеры.
- `src/shared` - общие типы, enums и regex.
- `src/i18n` - локализация, сообщения и helpers.
- `src/store` - Zustand хранилища.
- `src/config` - конфигурация приложения.
- `src/api` - API helpers и прокси.

## Доменные модули (на основе `documentation/DOCS.md`)

- `Auth` - вход/выход, регистрация, смена роли, восстановление доступа, верификация.
- `Me` - профиль, аналитика, обновление данных, подтверждение email.
- `Loads` - CRUD грузов, публичные/личные выборки, приглашения, видимость, отмена/обновление.
- `Offers` - офферы, встречные предложения, приглашения, статусы и логи.
- `Orders` - CRUD заказов, инвайты, подтверждение условий, статусы, документы, история.
- `Payments` - получение и подтверждение оплат по ролям.
- `Ratings` - рейтинги пользователей и агрегаты.
- `Agreements` - список/детали договоренностей и действия accept/reject.
- `Notifications` - список, mark-as-read, детали и realtime синхронизация.
- `Support` - обращения в поддержку и консультации.

## Realtime (WebSocket)

- Базовый WS-клиент: `src/services/ws.service.ts`.
- Хук грузов: `src/hooks/queries/loads/useLoadsPublicRealtime.ts`.
  - Логирует все входящие/исходящие сообщения (`[loads ws][in|out]`).
  - При входящем `action` из набора `create | update | remove` инвалидирует запросы грузов.
- Хук уведомлений: `src/hooks/queries/notifications/useNotificationsRealtime.ts`.
  - Логирует все входящие/исходящие сообщения (`[notifications ws][in|out]`).
  - При входящем `event` или `action` (включая `type: "event"` форматы) инвалидирует `['notifications']`.
- Хедер: `src/components/layouts/dashboard-layout/Header.tsx`.
  - На realtime событие уведомлений обновляет список/счетчик и проигрывает звук `public/sounds/notification.mp3`.

## Документация

- `documentation/DOCS.md` - единый справочник по hooks, services, utils, enums, types, regex, components и stores.
- `documentation/COMMANDS.md` - доступные команды для агента.
- `documentation/AGENTS.md` - правила разработки и соглашения проекта.

## CI/CD в GitHub Actions

- `CI`: `.github/workflows/ci.yml`
  - Запускается на `pull_request` и `push` в `main`.
  - Выполняет `npm ci`, `npm run lint`, `npm run build`.
- `CD`: `.github/workflows/cd.yml`
  - Запускается на `push` в `main` и вручную (`workflow_dispatch`).
  - Собирает Docker-образ из `Dockerfile` и пушит в `ghcr.io/<owner>/<repo>`.
  - Теги образа: `latest` и короткий `sha` коммита.

### Что включить в репозитории GitHub

- Repository Settings -> Actions -> General: разрешить запуск workflows.
- Repository Settings -> Actions -> General -> Workflow permissions:
  - выбрать `Read and write permissions` (нужно для push в GHCR).
- Packages: убедиться, что для `ghcr.io` у репозитория есть право записи.

### Как использовать образ

- После merge в `main` образ будет доступен по имени:
  - `ghcr.io/<owner>/<repo>:latest`
  - `ghcr.io/<owner>/<repo>:<short-sha>`
