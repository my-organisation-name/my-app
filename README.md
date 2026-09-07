This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Authentication (currently mocked)

There is no real identity provider wired in yet — everything past the home
page is gated behind a **mock** authenticated flow so the app structure can
be built out before Auth0 is integrated.

How it works today:

- `src/lib/auth/mock-auth-context.tsx` provides `MockAuthProvider` and a
  `useAuth()` hook shaped like Auth0's SPA SDK
  (`user`, `isAuthenticated`, `isLoading`, `login`/`loginWithRedirect`,
  `logout`, `getAccessTokenSilently`).
- "Signing in" creates a JWT-shaped token (`src/lib/auth/jwt.ts`) for a
  fixed fake user and stores it in `localStorage` — there is no server
  session and **no cookies are used anywhere in this app**.
- `src/components/auth/RequireAuth.tsx` is a client-side guard: routes
  under `src/app/(protected)/` render nothing and redirect to `/` unless a
  valid, unexpired token is present. This mirrors how
  `@auth0/auth0-react`'s `withAuthenticationRequired` works, since this
  mock is modeled on that SDK rather than the cookie-session
  `@auth0/nextjs-auth0` package.

### Swapping in real Auth0 later

1. Install `@auth0/auth0-react` and configure an Auth0 SPA application.
2. Add `NEXT_PUBLIC_AUTH0_DOMAIN`, `NEXT_PUBLIC_AUTH0_CLIENT_ID`, and
   `NEXT_PUBLIC_AUTH0_REDIRECT_URI` (see `.env.example`) to `.env.local`
   and to the Vercel project's environment variables.
3. Replace `MockAuthProvider` in `src/app/layout.tsx` with the SDK's
   `Auth0Provider`.
4. Replace `RequireAuth` with the SDK's `withAuthenticationRequired` (or
   keep a thin wrapper with the same name backed by the SDK's `useAuth0()`).
5. Replace `useAuth()` call sites with the SDK's `useAuth0()` — the
   returned shape (`user`, `isAuthenticated`, `isLoading`,
   `loginWithRedirect`, `logout`) is intentionally the same.
6. Delete `src/lib/auth/mock-auth-context.tsx` and `src/lib/auth/jwt.ts`.

If server-side session verification turns out to be preferred over a pure
SPA token later, `@auth0/nextjs-auth0` is the alternative path — that
package uses an httpOnly session cookie and Next.js middleware instead,
which is a different shape than what's mocked here.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
