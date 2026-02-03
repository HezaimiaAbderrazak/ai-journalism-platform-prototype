## Project Summary
Sada Intelligence Platform is a next-generation professional journalism platform powered by AI. It includes tools for AI-assisted content generation, automated fact-checking, data journalism, and live citizen reporting. The platform aims to empower journalists with cutting-edge technology while maintaining high standards of truth and ethics.

## Tech Stack
- Frontend: Next.js 15+, React, Tailwind CSS, Framer Motion, Lucide React
- Database & Auth: Supabase (implied)
- AI: Google Gemini (via AI SDK)
- UI Components: Radix UI, Shadcn UI

## Architecture
- `src/app`: Next.js App Router pages and API routes.
- `src/components/smart-press`: Core platform components (AI Studio, Fact Checker, etc.).
- `src/context`: Global state management (Articles, Live Reports).
- `src/hooks`: Custom React hooks.
- `src/lib`: Utility functions and shared logic.

## User Preferences
- Language: Arabic (Primary), French, English.
- Layout: RTL (Right-to-Left).
- Design Style: Professional, High-tech, Advanced Studio Aesthetics.

## Project Guidelines
- No comments in code unless explicitly requested.
- Use `useEffect` and `useState` with consistent imports.
- Follow Shadcn UI and Tailwind CSS patterns.

## Common Patterns
- Real-time updates for live reporting.
- AI-driven summaries and verdicts.
- Expanded/Fullscreen modes for media content (Live Studio Mode).
- Breaking news marquees and exclusive content badges.
