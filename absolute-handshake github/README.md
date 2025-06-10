# Absolute Handshake

Absolute Handshake is a React + Supabase escrow-style handshake platform. It enables users to authenticate, send verifiable messages (handshakes), and build trusted digital agreements.

## Features

- Email-based auth (via Supabase)
- Realtime message storage
- Simple and elegant UI with Tailwind and shadcn/ui
- Ready for deployment on Vercel

## Setup

1. Run `npm install`
2. Create a `.env.local` file:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```
3. Run the dev server:
```bash
npm run dev
```

## License

MIT
