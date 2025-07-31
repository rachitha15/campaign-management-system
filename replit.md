# Campaign Management System

## Overview

This is a full-stack campaign management application built with Express.js, React, and PostgreSQL. The system allows users to create and manage campaigns, with specialized workflows for one-time campaigns including data source management, burn rules configuration, and CSV file processing.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack architecture with clear separation between client and server components:

- **Frontend**: React with TypeScript, using Vite for development and building
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query for server state management

## Key Components

### Backend Architecture
- **Express Server** (`server/index.ts`): Main server entry point with middleware setup
- **Routes** (`server/routes.ts`): API endpoints for campaign management and file uploads
- **Storage Layer** (`server/storage.ts`): Abstract storage interface with in-memory implementation
- **Database Schema** (`shared/schema.ts`): Drizzle ORM schema definitions

### Frontend Architecture
- **React Router**: Uses Wouter for client-side routing
- **Component Structure**: Organized into UI components, pages, and feature-specific components
- **State Management**: TanStack Query for API calls and caching
- **Form Handling**: React Hook Form with Zod validation

### Database Design
The system uses four main entities:
- **Users**: Authentication and user management
- **Campaigns**: Core campaign data with type and status
- **Burn Rules**: Campaign-specific expiry and validation rules
- **Customers**: Campaign participant data with CSV import support

## Data Flow

1. **Campaign Creation**: Users create campaigns through a modal interface
2. **One-time Campaign Flow**: Multi-step wizard for data source, burn rules, and review
3. **File Upload**: CSV file processing with validation and error handling
4. **Data Storage**: Processed data stored in PostgreSQL via Drizzle ORM
5. **Real-time Updates**: Query invalidation for immediate UI updates

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI component primitives
- **multer**: File upload handling
- **csv-parser**: CSV file processing

### Development Dependencies
- **Vite**: Frontend build tool with React plugin
- **TypeScript**: Type safety across the stack
- **Tailwind CSS**: Utility-first styling
- **ESBuild**: Server bundling for production

## Deployment Strategy

### Development
- Vite dev server for frontend with HMR
- TSX for running TypeScript server directly
- Shared types between client and server

### Production Build
- **Frontend**: Vite builds to `dist/public`
- **Backend**: ESBuild bundles server to `dist/index.js`
- **Database**: Drizzle migrations in `migrations/` directory
- **Static Serving**: Express serves built frontend in production

### Configuration
- Environment-based configuration
- PostgreSQL connection via DATABASE_URL
- Replit-specific plugins for development environment
- Path aliases for clean imports (@, @shared, @assets)

The architecture prioritizes developer experience with hot reloading, type safety, and clear separation of concerns while maintaining production readiness with optimized builds and proper error handling.