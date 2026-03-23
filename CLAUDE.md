# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Vine of Time** is a multi-perspective event recording platform built with Next.js 15 App Router, featuring internationalization (i18n), user authentication (NextAuth.js), and rich data models for events, perspectives, timelines, storymaps, and collections.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Neon (via Prisma ORM)
- **Authentication**: NextAuth.js (Google OAuth only)
- **Storage**: Vercel Blob for image uploads
- **Styling**: Tailwind CSS
- **Internationalization**: next-intl
- **Rich Text**: TinyMCE, Lexical editor (in progress)
- **Maps**: Leaflet

## Common Development Tasks

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Runs the development server at `http://localhost:3000`. Note: `reactStrictMode` is disabled in `next.config.js` to prevent useEffect double execution.

### Build and Production
```bash
npm run build    # Build for production
npm start        # Start production server
```

### Linting
```bash
npm run lint
```

### Database Operations
```bash
npx prisma generate      # Generate Prisma client after schema changes
npx prisma migrate dev   # Create and apply migrations in development
npx prisma studio        # Open database GUI
npx prisma db push       # Sync schema without migrations (dev only)
```

### Post-install Script
The project has a postinstall hook that runs `prisma generate` and `node ./scripts/postinstall.js`. This runs automatically after `npm install`.

## Project Architecture

### Directory Structure

- `app/[locale]/` - Next.js App Router pages with locale-based routing (supports `zh`, `en`)
  - Uses `next-intl` for internationalization
  - Layout and pages are nested under locale dynamic segment
- `app/api/` - API route handlers organized by domain:
  - `auth/` - NextAuth.js callback routes
  - `events/` - Event CRUD operations
  - `storymap/` - Storymap management
  - `timeline/` - Timeline operations
  - `storage/` - Vercel Blob upload endpoints
  - `userKey/` - Encryption key management
  - `component/` - Component-specific APIs (e.g., MapComponent config)
- `components/` - React components:
  - `common/` - Shared UI components (buttons, dialogs, etc.)
  - `features/` - Feature-specific components organized by domain (events, timeline, storymap, map, collection, share, analytics, editor, tab)
  - `tiptap-*` - Rich text editor components
- `db/` - Database layer:
  - `schema.prisma` - Data model definitions
  - `access/` - Data access functions (one file per model type)
- `lib/` - Core utilities:
  - `db.ts` - Prisma client singleton
  - `auth.ts` - NextAuth configuration and callbacks
  - `api.ts` - API client wrapper
- `i18n/` - Internationalization:
  - `messages/` - Translation JSON files for each locale
  - `routing.ts` - Locale routing configuration
- `hooks/` - Custom React hooks
- `utils/` - General utility functions
- `scripts/` - Build and utility scripts
- `public/` - Static assets

### Data Model Highlights (Prisma)

Key models:
- **User** - User accounts (from NextAuth)
- **Event** - Core event entity with title, description, date, image, tags, and geographic data
- **Perspective** - Alternative narratives/viewpoints for events (belongs to event + user)
- **Timeline** - User-created timelines grouping events
- **TimelineEvent** - Junction table for timeline-event ordering
- **collection** + **collection_event** - User collections (favorites) of events
- **storymap** + **storymap_event** - Storymaps combining events with map narratives
- **user_key** - User encryption keys

### Internationalization

- Supported locales: `zh` (default), `en`
- Configured in `i18n/routing.ts`
- Middleware (`middleware.ts`) routes based on locale
- Translation files in `i18n/messages/{locale}/` organized by `common/`, `components/`, `pages/`

### Authentication Flow

- NextAuth.js configured in `lib/auth.ts`
- Google OAuth only (GitHub was removed)
- Callbacks:
  - `signIn`: Downloads user avatar to Vercel Blob, creates default collection
  - `session`: Ensures session includes user ID and Blob-stored avatar URL
  - `jwt`: Token management
- Custom sign-in page at `app/[locale]/auth/signin/page.tsx`
- Protected routes use server-side session checks

### API Design

API routes follow RESTful patterns:
- `GET /api/events` - List events
- `POST /api/events` - Create event
- `GET /api/events/[id]` - Get event detail
- `PUT/DELETE /api/events/[id]` - Update/delete event
- Similar patterns for timelines, storymaps, collections, perspectives

### Styling

- Tailwind CSS with config in `tailwind.config.js`
- Global styles in `app/[locale]/globals.css`
- Component styles use Tailwind utility classes
- Custom component classes defined in `styles/`

### Important Configuration

- **next.config.js**: Uses `next-intl` plugin, configures remote image patterns for Google avatars and Vercel Blob, disables React strict mode.
- **tsconfig.json**: Path alias `@/*` points to project root
- **Environment variables** (see `.env`):
  - `NEXTAUTH_URL`, `NEXTAUTH_SECRET`
  - `DATABASE_URL` (Neon PostgreSQL)
  - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
  - `NEXT_PUBLIC_GA_MEASUREMENT_ID` (optional)
  - `BLOB_READ_WRITE_TOKEN` (Vercel Blob)

## File Patterns and Conventions

- Components: PascalCase filenames (e.g., `EventCard.tsx`)
- Utility files: camelCase (e.g., `api.ts`)
- API routes: directory structure matches URL path
- Database access functions reside in `db/access/{model}.ts`
- Translations organized by feature domain

## Testing

No test files present in the project yet. If adding tests:
- Use Jest or Vitest with React Testing Library
- Place `*.test.tsx`/`*.test.ts` alongside files or in `__tests__/` directories
- Include API route tests, component tests, and utility tests

## Deployment

- Optimized for Vercel
- Build command: `npm run build`
- Ensure all environment variables are set in Vercel dashboard
- Database must be accessible (Neon PostgreSQL)
- Vercel Blob storage must be configured

## Notes and Gotchas

- `reactStrictMode: false` is set in `next.config.js` to avoid double useEffect execution in development
- Image remote patterns configured for Google avatars and Vercel Blob; add new hosts if needed
- The project uses locale-based routing; all pages are under `app/[locale]/`
- Prisma client is singleton using global variable to avoid hot reload issues
- Google OAuth avatar is downloaded and stored in Vercel Blob on first sign-in
- Default collection is auto-created for each new user

## Memory References

For architectural decisions and debugging patterns, see memory files:
- Database design patterns
- Authentication flow details
- Internationalization setup
- Deployment configuration
