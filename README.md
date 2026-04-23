# 💧 LearnDrops

A simple, cozy web app for tracking what you learn each day.
Write one small thing, stay consistent, and watch your knowledge grow over time.

## ✨ Features

- 📝 Add one daily learning entry
- 🔗 Optional link and tag for each entry
- 📚 View your past entries in a clean history
- 🔥 Track your daily streak
- 🔐 Secure authentication with Supabase

## 🛠️ Tech Stack

- ⚛️ React 18 + Vite 5 + TypeScript
- 🎨 Tailwind CSS
- 🧱 shadcn/ui
- 🗄️ Supabase (Auth + Postgres + RLS)

## 🚀 Getting Started

### 1. Clone & install

```bash
git clone https://github.com/sarah-elbahloul/learn-drops.git
cd learn-drops
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

```env
VITE_SUPABASE_URL=https://<YOUR_PROJECT_REF>.supabase.co
VITE_SUPABASE_ANON_KEY=<YOUR_SUPABASE_ANON_KEY>
```

Find these in your Supabase dashboard → **Project Settings → API**.

### 3. Set up the database

Run this in the Supabase **SQL Editor**:

```sql
create table public.drops (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  link text,
  tag text,
  tag_color text,
  created_at timestamptz not null default now()
);

alter table public.drops enable row level security;

create policy "Users manage own drops" on public.drops
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index drops_user_created_idx
  on public.drops (user_id, created_at desc);

-- Allow users to delete their own account from Settings
create or replace function public.delete_my_account()
returns void language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'Not authenticated'; end if;
  delete from auth.users where id = auth.uid();
end;
$$;
grant execute on function public.delete_my_account() to authenticated;
```

Then add your dev URL (e.g. `http://localhost:5173`) in:
**Authentication → URL Configuration**

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and add your first drop 💧

## 📜 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run tests |

## 🗂️ Project Structure

```
src/
├── assets/
├── components/
├── contexts/
├── hooks/
├── lib/
├── pages/
└── index.css
```

## 💡 Idea

LearnDrops is built around one simple idea:

> small things learned daily → meaningful progress over time

No pressure, no noise—just showing up and writing one thing.

## 📄 License

MIT