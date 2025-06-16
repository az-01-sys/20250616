# Expense Management Application

## Overview

This is a modern web application for managing personal expenses, built with a React frontend and Express backend. The application allows users to track their spending by category, view expense statistics, and manage their financial records. The application is designed with a focus on Japanese localization and uses modern web technologies for a responsive user experience.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Radix UI primitives with shadcn/ui design system
- **Styling**: Tailwind CSS with CSS variables for theming
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React for consistent iconography

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API
- **Database ORM**: Drizzle ORM with PostgreSQL support
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Validation**: Zod schemas shared between frontend and backend
- **Session Management**: Express sessions with PostgreSQL store

### Development Environment
- **Platform**: Replit with Node.js 20, Web, and PostgreSQL 16 modules
- **Package Manager**: npm
- **TypeScript**: Strict mode enabled with modern ESNext target
- **Development Server**: Hot reload with Vite middleware integration

## Key Components

### Database Schema
- **Expenses Table**: Core entity storing expense records
  - ID (serial primary key)
  - Amount (integer, stored in smallest currency unit)
  - Description (text)
  - Category (text with predefined options)
  - Date (timestamp with default to current time)

### API Endpoints
- `GET /api/expenses` - Retrieve all expenses
- `GET /api/expenses/:id` - Retrieve single expense
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update existing expense
- `DELETE /api/expenses/:id` - Delete expense

### UI Components
- **ExpenseDashboard**: Main dashboard with expense overview
- **ExpenseForm**: Form for creating/editing expenses
- **ExpenseList**: Filterable list of expenses with search and category filters
- **ExpenseStats**: Statistics and analytics dashboard

### Storage Layer
- **Interface-based Storage**: IStorage interface for flexibility
- **Memory Storage**: Development/testing implementation
- **Database Storage**: Production implementation with Drizzle ORM

## Data Flow

1. **User Interaction**: User interacts with React components
2. **Form Validation**: Client-side validation using Zod schemas
3. **API Requests**: TanStack Query manages API calls to Express backend
4. **Server Validation**: Server validates requests using shared Zod schemas
5. **Database Operations**: Drizzle ORM handles database interactions
6. **Response Handling**: Data flows back through the stack with proper error handling
7. **UI Updates**: React Query automatically updates UI with new data

## External Dependencies

### Frontend Dependencies
- **UI Framework**: React 18 with TypeScript support
- **State Management**: @tanstack/react-query for server state
- **UI Components**: Complete Radix UI component suite
- **Form Handling**: react-hook-form with @hookform/resolvers
- **Validation**: zod for schema validation
- **Styling**: tailwindcss with class-variance-authority
- **Utilities**: clsx, date-fns for date formatting

### Backend Dependencies
- **Database**: @neondatabase/serverless for PostgreSQL connection
- **ORM**: drizzle-orm with drizzle-zod for type-safe database operations
- **Session Management**: connect-pg-simple for PostgreSQL session store
- **Validation**: Shared Zod schemas from frontend

### Development Dependencies
- **Build Tools**: Vite with React plugin and TypeScript support
- **Development**: tsx for TypeScript execution, esbuild for production builds
- **Database Tools**: drizzle-kit for schema migrations

## Deployment Strategy

### Development Mode
- **Command**: `npm run dev`
- **Process**: tsx runs TypeScript server directly with hot reload
- **Port**: 5000 for backend, Vite dev server integrated
- **Database**: Uses environment variable DATABASE_URL

### Production Build
- **Frontend Build**: `vite build` creates optimized static assets
- **Backend Build**: `esbuild` bundles server code for Node.js
- **Output**: `dist/` directory with both frontend and backend assets
- **Start Command**: `npm run start` runs bundled production server

### Replit Configuration
- **Target**: Autoscale deployment
- **Port Mapping**: Internal port 5000 → External port 80
- **Build Process**: Automated build on deployment
- **Environment**: PostgreSQL 16 module provides database

## Changelog

```
Changelog:
- June 16, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```