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

- ⚡ React 18 + Vite 5 + TypeScript
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

We have provided the database schema in the `supabase/init.sql` file. 
Open that file, grab the code, and run it in your Supabase SQL Editor.

Then add your dev URL (e.g. `http://localhost:5173`) in:
**Authentication → URL Configuration**

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and add your first drop 💧

## 📜 Scripts

| Command | Description |
| --- | --- |
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