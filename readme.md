# Baby Bootcamp

Baby Bootcamp is a companion tool to support parents who follow Suzy Giordano's popular sleep-training method outlined in *Twelve Hours' Sleep by Twelve Weeks Old: A Step-by-Step Plan for Baby Sleep Success*.

The app automates the tracking and calculations needed to gradually eliminate night feedings, making it easier for (likely sleep-deprived!) parents to implement this critical component of Giordano's sleep plan.

## Features

- **User Authentication**: Secure JWT-based authentication with bcrypt password hashing for account management
- **Weekly Feeding Calendar**: Interactive calendar view displaying feeding schedules across a weekly timeline
- **Feeding Block Management**: Create and track scheduled feeding times
- **Feeding Entry Logging**: Record individual feeding sessions with volume amounts in ounces
- **Automated Volume Reduction**: Implements the "3-day block" elimination algorithm where feeding volumes automatically decrease by 0.5 oz every 3 days
- **Smart Baseline Adjustment**: Automatically adjusts baseline feeding volumes when baby naturally consumes less than the scheduled amount
- **One Block Elimination at a Time**: Mark one feeding block for elimination while tracking volumes for other feeding sessions
- **Timezone-Aware Tracking**: Uses Luxon for accurate timezone handling across different locations
- **Modal Editing**: Edit feeding entries through intuitive modal dialogs

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Build tool and development server
- **Material UI (MUI)** - Component library
- **React Router** - Client-side routing
- **Luxon** - Timezone-aware date handling
- **JWT Decode** - Token management

### Backend
- **Node.js/Express** - REST API server
- **TypeScript** - Type-safe development
- **Drizzle ORM** - Database operations
- **PostgreSQL** - Relational database
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **JSON Schema** - Request validation

### Testing
- **Vitest** - Unit and integration testing
- **React Testing Library** - Frontend component testing
- **Supertest** - Backend API testing

## Prerequisites

Before running this project locally, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)
- **PostgreSQL** (v14 or higher)

## Directions to Run Locally

### 1. Clone the Repository

```bash
gh repo clone aubrey-sherman/baby-bootcamp
cd baby-bootcamp
```

### 2. Backend Setup

#### Install Dependencies

```bash
cd backend
npm install
```

#### Create Environment File

Create a `.env` file in the `backend` directory:

```bash
# Environment
NODE_ENV=development

# Server
PORT=3001

# JWT Secret Key
SECRET_KEY=your-secret-key-here

# CORS
CORS_ALLOW_ORIGIN=http://localhost:5173

# Database URLs
LOCAL_DATABASE_URL=postgresql:///baby_bootcamp
PRODUCTION_DATABASE_URL=postgresql:///baby_bootcamp
```

#### Create Local Database

```bash
createdb baby_bootcamp
```

#### Run Database Migrations

```bash
npx drizzle-kit migrate
```

#### Build and Start Backend Server

```bash
npm run build
npm start
```

The backend API will run on `http://localhost:3001`

### 3. Frontend Setup

Open a new terminal window and navigate to the frontend directory:

#### Install Dependencies

```bash
cd frontend
npm install
```

#### Create Environment File

Create a `.env` file in the `frontend` directory:

```bash
# Backend API URL
VITE_BASE_URL=http://localhost:3001
```

#### Start Frontend Development Server

```bash
npm start
```

The app will automatically open in your default browser at `http://localhost:5173`, courtesy of Vite's development server!

## Project Structure

```
baby-bootcamp/
├── backend/              # Express.js API server
│   ├── src/
│   │   ├── db/          # Drizzle ORM models and schemas
│   │   ├── routes/      # API route handlers
│   │   ├── middleware/  # Express middleware (auth, validation)
│   │   ├── helpers/     # Business logic (block elimination)
│   │   └── jsonSchema/  # Request validation schemas
│   ├── drizzle/         # Database migrations
│   └── dist/            # Compiled TypeScript output
│
└── frontend/            # React + Vite application
    ├── src/
    │   ├── api/         # API client
    │   ├── components/  # React components
    │   └── types.ts     # TypeScript type definitions
    └── dist/            # Production build output
```

## Available Commands

### Backend Commands

Run these commands from the `backend` directory:

| Command                    | Description                          |
|----------------------------|--------------------------------------|
| `npm start`                | Start production server              |
| `npm run build`            | Compile TypeScript to dist/          |
| `npm test`                 | Run Vitest tests                     |
| `npm test:cov`             | Run tests with coverage              |
| `npx drizzle-kit migrate`  | Apply database migrations            |

### Frontend Commands

Run these commands from the `frontend` directory:

| Command         | Description                      |
|-----------------|----------------------------------|
| `npm start`     | Start Vite dev server (port 5173)|
| `npm run build` | Build production bundle          |
| `npm test`      | Run Vitest tests                 |
| `npm test:cov`  | Run tests with coverage          |

## Testing

Both frontend and backend use Vitest for testing.

Run tests from the respective directories:

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

For test coverage reports:

```bash
npm test:cov
```

## Development Workflow

- **TypeScript checking**: Use `npx tsc --noEmit` for quick type validation
- **Dev mode**: Use `npm start` in the frontend directory for hot module reloading
- **Production builds**: Only run `npm run build` when preparing for deployment
- **Database changes**: Create new migrations in the `backend/drizzle` directory


## Timezone Handling

All feeding times are timezone-aware:
- Frontend detects user timezone using Luxon
- Timezone sent in API headers (`x-user-timezone`)
- Backend stores times in UTC, converts for display

## Credits

This project uses React JS Starter code with customizations by Joel Burton (joel@rithmschool.com), based on the Vite Template React, which is built and maintained by [Safdar Jamal](https://safdarjamal.github.io). [The React JS Starter project](https://github.com/rithmschool/start/tree/main/js/react) is licensed under the terms of the [MIT license](https://github.com/SafdarJamal/vite-template-react/blob/main/LICENSE).
