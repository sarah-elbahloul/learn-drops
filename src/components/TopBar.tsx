import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getLevel } from "@/lib/xp";
import { Droplets, LogOut, Flame, Settings as SettingsIcon } from "lucide-react";

export const TopBar = ({ xp, streak }: { xp: number; streak: number }) => {
  const { signOut, user } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const lvl = getLevel(xp);

  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-background/75 border-b border-border">
      <div className="container max-w-5xl flex items-center gap-4 py-3">
        <Link to="/dashboard" className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-2xl bg-primary shadow-sticker rotate-[-4deg]">
            <Droplets className="h-5 w-5 text-primary-foreground" />
          </span>
          <span className="font-display text-xl">LearnDrops</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-1 ml-2">
          <Link
            to="/dashboard"
            className={`px-3 py-1.5 rounded-full text-sm font-bold transition ${
              loc.pathname === "/dashboard" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            }`}
          >
            Today
          </Link>
          <Link
            to="/history"
            className={`px-3 py-1.5 rounded-full text-sm font-bold transition ${
              loc.pathname === "/history" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            }`}
          >
            My Journey
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex flex-col items-end leading-tight">
            <span className="text-xs font-semibold text-muted-foreground">Level {lvl.level}</span>
            <span className="text-sm font-bold">{lvl.name} · {xp} XP</span>
          </div>
          <div className="px-3 py-1.5 rounded-full bg-foreground text-background text-sm font-extrabold flex items-center gap-1.5 shadow-soft">
            <Flame className="h-3.5 w-3.5 text-primary" /><span>{streak}</span>
          </div>
          {user && (
            <Link
              to="/settings"
              className={`p-2 rounded-full hover:bg-muted transition ${loc.pathname === "/settings" ? "bg-muted" : ""}`}
              aria-label="Account settings"
              title="Account settings"
            >
              <SettingsIcon className="h-4 w-4" />
            </Link>
          )}
          {user && (
            <button
              onClick={async () => { await signOut(); nav("/"); }}
              className="p-2 rounded-full hover:bg-muted transition"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};