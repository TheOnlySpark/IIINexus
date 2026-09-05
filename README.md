
# III Nexus

III Nexus is a centralized portal that allows members to securely authenticate and access various III applications and modules from a single dashboard. 

The application serves as a launchpad for services such as:
- **Clubspace**: For community clubs and organizations.
- **Canteen**: For community dining and ordering.
- **AI Content Detector**: A utility for content integrity.
- **Skiptray**: A community logistics tool.

## Features
- **Secure Authentication**: Uses Supabase for robust email/password user authentication.
- **Protected Dashboard**: Ensures only logged-in members can access the available modules.
- **Neo-Brutalist UI**: A sleek, modern user interface built with Tailwind CSS.

## Tech Stack
- Next.js (App Router)
- React
- Tailwind CSS
- Supabase

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```

2. Set up your environment variables:
   Create a `.env.local` file at the root of the project and add your Supabase credentials. (You can refer to `.env.example` if available).
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
