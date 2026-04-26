import { Link } from "react-router-dom";
import { Droplets, Sparkles, Flame, BookHeart, ArrowRight, Quote } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Github, Linkedin, AtSign } from "lucide-react";

const Index = () => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-sun relative overflow-hidden">
      {/* paper grain backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-60" />
      <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary/30 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -left-32 w-80 h-80 rounded-full bg-secondary/30 blur-3xl" />

      <header className="relative container max-w-6xl flex items-center justify-between py-6">
        <div className="flex items-center gap-2 font-extrabold text-xl">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-primary shadow-sticker rotate-[-4deg]">
            <Droplets className="h-5 w-5 text-primary-foreground" />
          </span>
          <span className="font-display text-2xl">LearnDrops</span>
        </div>
        <nav className="flex items-center gap-2">
          <a href="#how" className="hidden sm:inline-block text-sm font-bold px-4 py-2 rounded-full hover:bg-muted transition">
            How it works
          </a>
          <Link
            to={user ? "/dashboard" : "/login"}
            className="text-sm font-bold px-4 py-2 rounded-full bg-foreground text-background hover:scale-105 transition"
          >
            {user ? "Open app →" : "Log in"}
          </Link>
        </nav>
      </header>

      <main className="relative container max-w-6xl pt-10 pb-24">
        <section className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-foreground text-background text-xs font-bold uppercase tracking-[0.15em] mb-6">
              <Sparkles className="h-3 w-3" /> A pocket-sized learning ritual
            </span>
            <h1 className="font-display text-[3.25rem] sm:text-7xl lg:text-[5.5rem] leading-[0.92] mb-6">
              Catch your daily{" "}
              <span className="ink-underline italic">drops</span>{" "}
              <br className="hidden sm:block" />
              of <span className="font-hand text-secondary text-[1.15em] align-baseline">knowledge.</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-xl leading-relaxed">
              Jot down one thing you learned today — a coding trick, an omelette tip, a weird history fact.
              Tiny wins, stacked daily, become a whole new you. 🌱
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to={user ? "/dashboard" : "/login"}
                className="group inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-primary text-primary-foreground font-extrabold text-lg shadow-sticker hover:-translate-y-0.5 active:translate-y-0 transition-transform"
              >
                <Droplets className="h-5 w-5" />
                Start Dropping
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
              </Link>
              <span className="font-hand text-2xl text-muted-foreground rotate-[-4deg]">
                ← takes 10 seconds, promise
              </span>
            </div>

            <div className="mt-10 flex items-center gap-5 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                {["🦊","🐼","🐙","🦉"].map((e) => (
                  <span key={e} className="w-9 h-9 rounded-full bg-card border-2 border-background flex items-center justify-center text-lg shadow-soft">{e}</span>
                ))}
              </div>
              <p>Joined by curious humans dropping <strong className="text-foreground">12,400+</strong> tiny lessons.</p>
            </div>
          </div>

          {/* Notebook mock */}
          <div className="lg:col-span-5 relative">
            <div className="relative rotate-[2deg] hover:rotate-0 transition-transform duration-500">
              <div className="tape bg-card border border-border rounded-3xl shadow-paper p-6 bg-notebook">
                <div className="flex items-center justify-between mb-4 pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Today · Tue</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-success/40 text-xs font-bold">+10 XP</span>
                </div>
                <p className="font-hand text-3xl leading-snug mb-4">
                  TIL: octopuses have three hearts and blue blood. Two pump to gills, one to body. Wild.
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-secondary/40 text-xs font-bold uppercase tracking-wide">Biology</span>
                  <span className="text-xs text-muted-foreground">just now</span>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-8 rotate-[-6deg] bg-primary text-primary-foreground rounded-2xl px-4 py-2 shadow-sticker font-extrabold text-sm">
                🔥 5-day streak!
              </div>
              <div className="absolute -top-6 -right-6 rotate-[8deg] bg-secondary text-secondary-foreground rounded-2xl px-4 py-2 shadow-sticker font-extrabold text-sm">
                Lvl 3 · Curious Cat
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="mt-32">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <h2 className="font-display text-4xl sm:text-5xl max-w-xl">
              Three small moves. <span className="font-hand text-secondary">Zero pressure.</span>
            </h2>
            <span className="font-hand text-2xl text-muted-foreground">no streak shame here →</span>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { icon: Droplets, title: "Drop a thought", body: "One sentence. One link. One tag. That's the whole ritual.", rot: "-rotate-1", bg: "bg-primary/20" },
              { icon: Flame, title: "Stack the streak", body: "Earn XP, climb goofy levels — from Newborn Sponge to Galaxy Brain.", rot: "rotate-1", bg: "bg-secondary/30" },
              { icon: BookHeart, title: "Re-live the journey", body: "Filter by tag and watch your curiosity map itself out over time.", rot: "-rotate-1", bg: "bg-success/30" },
            ].map(({ icon: I, title, body, rot, bg }, i) => (
              <div key={title} className={`relative rounded-3xl bg-card p-7 shadow-paper border border-border ${rot} hover:rotate-0 transition-transform`}>
                <span className={`inline-flex w-12 h-12 rounded-2xl ${bg} items-center justify-center mb-4 shadow-soft`}>
                  <I className="h-6 w-6" />
                </span>
                <span className="absolute top-5 right-6 font-hand text-3xl text-muted-foreground/60">0{i+1}</span>
                <h3 className="text-xl mb-2 font-display">{title}</h3>
                <p className="text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Quote / testimonial */}
        <section className="mt-32 relative">
          <div className="max-w-3xl mx-auto bg-card border border-border rounded-[2rem] p-10 sm:p-14 shadow-paper bg-notebook relative overflow-hidden">
            <Quote className="absolute -top-2 -left-2 h-24 w-24 text-primary/40" />
            <p className="font-display text-2xl sm:text-3xl leading-snug relative">
              "I used to forget everything I read. Now I drop one tiny thing each night and somehow,
              <span className="ink-underline"> I'm building a brain library.</span>"
            </p>
            <div className="mt-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center text-xl">🦉</span>
              <div>
                <p className="font-bold text-sm">Maya, 312-day streaker</p>
                <p className="text-xs text-muted-foreground font-hand text-base">favorite tag: kitchen science</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="mt-32 text-center">
          <h2 className="font-display text-4xl sm:text-6xl mb-4">
            Your <span className="ink-underline">first drop</span> is one click away.
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
            Free forever. Cozy by design. Pinky-promise no notification spam.
          </p>
          <Link
            to={user ? "/dashboard" : "/login"}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-foreground text-background font-extrabold text-lg shadow-sticker hover:-translate-y-0.5 transition"
          >
            <Droplets className="h-5 w-5" />
            Start Dropping
          </Link>
        </section>
      </main>

    <footer className="relative container max-w-6xl py-10 text-center text-sm text-muted-foreground border-t border-border">
      
      <p className="font-hand text-2xl">
        Built by Sarah, for curious minds. A tiny habit I’m building, join in!
      </p>

      <div className="flex justify-center gap-6 mt-6">
        <a
          href="https://github.com/sarah-elbahloul/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="hover:text-foreground transition-colors"
        >
          <Github size={20} />
        </a>

        <a
          href="https://www.linkedin.com/in/sarah-elbahloul/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="hover:text-foreground transition-colors"
        >
          <Linkedin size={20} />
        </a>

        <a
          href="mailto:sa.albahloul@gmail.com"
          aria-label="Email"
          className="hover:text-foreground transition-colors"
        >
          <AtSign size={20} />
        </a>
      </div>

      <p className="mt-6 text-xs opacity-70">
        © {new Date().getFullYear()} Sarah Elbahloul
      </p>
    </footer>
    </div>
  );
};

export default Index;
