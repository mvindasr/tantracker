# TanTracker

[![Framework: TanStack](https://img.shields.io/badge/framework-tanstack-blue.svg)](https://tanstack.com/)
[![types: typescript](https://img.shields.io/badge/types-typescript-blue.svg)](https://www.typescriptlang.org)
[![Style: TailwindCSS](https://img.shields.io/badge/style-tailwindcss-blue.svg)](https://tailwindcss.com/docs/installation)
[![Style: ShadCN/ui](https://img.shields.io/badge/style-shadCN-blue.svg)](https://ui.shadcn.com/)
[![package manager: npm](https://img.shields.io/badge/package_manager-npm-blue.svg)](https://www.npmjs.com/)
[![DB: PostgreSQL](https://img.shields.io/badge/database-postgresql-blue.svg)](https://www.postgresql.org/)
[![ORM: Drizzle](https://img.shields.io/badge/orm-drizzle-blue.svg)](https://orm.drizzle.team/)
[![Validation: Zod](https://img.shields.io/badge/validation-zod-blue.svg)](https://zod.dev/)
[![Authentication: Clerk](https://img.shields.io/badge/authentication-clerk-blue.svg)](https://clerk.dev/)

---

**TanTracker** is a powerful and user-friendly income and expense tracking application designed to help users manage their finances efficiently. With TanTracker, users can log their income and expenses, view detailed reports, and manage their accounts with ease. The application leverages modern web development technologies to provide a seamless and responsive user experience.

![TanTracker Screenshot](./public/assets/TanTracker.png)

---

## Installation

To get started with this project, follow these steps:

1. Clone this repository to your local machine:

```bash
git clone https://github.com/mvindasr/tantracker.git
```

2. Navigate to the project directory

```bash
cd tantracker
```

3. Install all dependencies

```bash
pnpm install
```

4. Setup .env file

Create a `.env` file in the `root` of the project. You can do it by copying the `.env.example` file:

```bash
cp ./.env.example ./.env
```

> The command assumes an unix environment where the `cp` command is available.

Once you have the `.env` file, add the environment variable values in the file.

```env
CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
CLERK_SECRET_KEY=your-clerk-secret-key
DATABASE_URL=your-database-url
```

## Usage

Once you have set up the project and installed the dependencies, you can run the application locally:

```bash
npm run dev
```

This command will start the development server, and you can access the application at http://localhost:3000/.
