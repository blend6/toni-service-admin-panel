# Auto Elektro Toni Servis – ECU File Transfer (admin panel)

Vue 3 + Vite + Tailwind + Supabase. Hosting: Netlify.

## 1. Supabase
1. Krijo projekt të ri (plani Free).
2. SQL Editor: ekzekuto `supabase/schema.sql` (para cron-it ndrysho PROJECT_REF dhe SECRET).
3. Authentication > Sign In / Providers > Email: fik "Allow new users to sign up" dhe "Confirm email".
4. Authentication > Users > Add user: krijo 2 llogaritë me email `username@toni.local` dhe fjalëkalimin e zgjedhur (shëno "Auto Confirm User").
5. Edge Function: `supabase functions deploy cleanup --no-verify-jwt` dhe `supabase secrets set CRON_SECRET=SECRET` (e njëjta vlerë si te SQL).

## 2. Lokal
```
cp .env.example .env     # vendos URL dhe anon key nga Project Settings > API
npm install
npm run dev
```

## 3. Netlify
Lidh repo-n; build `npm run build`, publish `dist`. Shto të dyja variablat VITE_SUPABASE_* te Site settings > Environment variables.
Te login shkruan vetëm `username` (jo emailin e plotë).
