<div align="center">

# 💧 LearnDrops

### *Catch your daily drops of knowledge.*

A pocket-sized learning ritual. Jot down one thing you learned today —
a coding trick, an omelette tip, a weird history fact. Tiny wins, stacked
daily, become a whole new you. 🌱

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

</div>

---

## ✨ The vibe

LearnDrops is a **cozy, notebook-flavored micro-learning tracker**. No streak
shame, no notification spam — just a warm little corner of the internet where
you drop one tiny thing you learned today and watch your curiosity map itself
out over time.

Think: paper grain, ink underlines, sticker shadows, a friendly handwritten
font, and goofy level names like *Newborn Sponge* and *Galaxy Brain*.

## 🎯 What it does

- 📝 **Drop a thought** — one sentence, one optional link, one tag. That's the whole ritual.
- 🔥 **Stack the streak** — earn XP and climb silly levels as you keep showing up.
- 🏷️ **Filter by tag** — re-live your journey through any topic you've explored.
- 🎉 **Celebrate every win** — confetti, kind toasts, zero pressure.
- 🔐 **Yours alone** — email + password auth, row-level security on every drop.

## 🛠️ Built with

- ⚛️ **React 18 + Vite 5 + TypeScript**
- 🎨 **Tailwind CSS** + custom design system (Fraunces / Caveat / Nunito)
- 🧱 **shadcn/ui** for accessible primitives
- 🗄️ **Supabase** for auth + Postgres + RLS
- 🎊 **canvas-confetti** + **sonner** for the little joys

## 🚀 Getting started

### 1. Clone & install

```bash
git clone https://github.com/<YOUR_GITHUB_USERNAME>/learndrops.git
cd learndrops
npm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env` and fill in your Supabase project keys:

```bash
cp .env.example .env
```

```env
VITE_SUPABASE_URL=https://<YOUR_PROJECT_REF>.supabase.co
VITE_SUPABASE_ANON_KEY=<YOUR_SUPABASE_ANON_KEY>
```

> Find these in your Supabase dashboard → **Project Settings → API**.

### 3. Set up the database

In your Supabase project's **SQL Editor**, run:

```sql
create table public.drops (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  link text,
  tag text,
  created_at timestamptz not null default now()
);

alter table public.drops enable row level security;

create policy "Users manage own drops" on public.drops
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index drops_user_created_idx
  on public.drops (user_id, created_at desc);
```

Then in **Authentication → URL Configuration**, add your dev + prod URLs
(e.g. `http://localhost:5173`) to **Site URL** and **Redirect URLs**.

### 4. Run it

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and drop your first thought. 💧

## 📜 Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |
| `npm run test` | Run the Vitest test suite |

## 🗂️ Project structure

```
src/
├── components/      # DropCard, TopBar, NavLink, ProtectedRoute, ui/
├── contexts/        # AuthContext (Supabase session)
├── lib/             # supabase client, xp + streak logic
├── pages/           # Index (landing), Login, Dashboard, History, NotFound
└── index.css        # Design tokens: colors, shadows, paper textures
```

## 🎨 Design tokens

All colors live as HSL CSS variables in `src/index.css`. The palette:

| Token | Hex | Vibe |
|---|---|---|
| `--background` | `#FFFDF7` | Warm paper |
| `--primary` | `#FFD84D` | Sunny yellow |
| `--secondary` | `#6EC1FF` | Soft sky blue |
| `--success` | `#5DDBA9` | Mint celebration |
| `--foreground` | `#2D2D2D` | Ink charcoal |

## 🗺️ Roadmap

- [ ] Weekly recap emails
- [ ] Public profile pages (opt-in)
- [ ] Export drops as Markdown / JSON
- [ ] Mobile PWA polish

## 🤝 Contributing

PRs welcome — especially new level names, success messages, or tiny
delightful touches. Open an issue first for anything bigger.

## 📄 License

[MIT](LICENSE) © `<YOUR_NAME>`

---

<div align="center">

*Made with 🍯 for tiny daily learners by [@&lt;YOUR_GITHUB_USERNAME&gt;](https://github.com/<YOUR_GITHUB_USERNAME>)*

</div>
