import { FormEvent, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Droplets, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const { signIn, signUp, user } = useAuth();
  const nav = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const SPECIALS = "!@#$%^&*()_+-=[]{};:,.<>?";
  const validatePassword = (pw: string): string | null => {
    if (pw.length < 6) return "Password must be at least 6 characters.";
    if (!/[A-Z]/.test(pw)) return "Password needs at least one uppercase letter.";
    if (!/[0-9]/.test(pw)) return "Password needs at least one number.";
    if (!/[!@#$%^&*()_+\-=\[\]{};:,.<>?]/.test(pw))
      return `Password needs one special character (${SPECIALS}).`;
    return null;
  };

  const checks = {
    len: password.length >= 6,
    upper: /[A-Z]/.test(password),
    num: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};:,.<>?]/.test(password),
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (mode === "signup") {
      const err = validatePassword(password);
      if (err) { toast.error(err); return; }
    }
    setBusy(true);
    const { error } = mode === "signin" ? await signIn(email, password) : await signUp(email, password);
    setBusy(false);
    if (error) {
      if (/confirm/i.test(error)) {
        toast.error("Please confirm your email first — check your inbox 📬");
      } else {
        toast.error(error);
      }
    } else if (mode === "signup") {
      toast.success("Check your email to confirm — then come back and sign in! 📬");
      setMode("signin");
    } else {
      nav("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-sun relative overflow-hidden flex items-center justify-center px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-50" />
      <div className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 rounded-full bg-primary/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-secondary/30 blur-3xl" />

      <div className="w-full max-w-md relative">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-foreground transition mb-6">
          <ArrowLeft className="h-4 w-4" /> Back home
        </Link>
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary shadow-sticker rotate-[-6deg]">
            <Droplets className="h-6 w-6 text-primary-foreground" />
          </span>
          <span className="font-display text-3xl">LearnDrops</span>
        </Link>

        <div className="bg-card rounded-[2rem] p-8 shadow-paper border border-border relative">
          <span className="absolute -top-3 left-8 px-3 py-1 rounded-full bg-success text-success-foreground text-xs font-bold uppercase tracking-wider shadow-soft">
            {mode === "signin" ? "Welcome back" : "Free forever"}
          </span>
          <h1 className="font-display text-3xl mb-1 mt-2">
            {mode === "signin" ? "Hey, you're back." : "Hello, learner!"}
          </h1>
          <p className="font-hand text-xl text-muted-foreground mb-6">
            {mode === "signin" ? "Pick up right where you left off." : "Let's catch some daily drops."}
          </p>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-bold block mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:ring-4 focus:ring-primary/30 focus:border-primary transition"
                placeholder="you@learning.dev"
              />
            </div>
            <div>
              <label className="text-sm font-bold block mb-1.5">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:ring-4 focus:ring-primary/30 focus:border-primary transition"
                placeholder="••••••••"
              />
              {mode === "signup" && (
                <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                  {[
                    { ok: checks.len, label: "6+ characters" },
                    { ok: checks.upper, label: "1 uppercase" },
                    { ok: checks.num, label: "1 number" },
                    { ok: checks.special, label: "1 special (!@#$…)" },
                  ].map((c) => (
                    <li key={c.label} className={`flex items-center gap-1.5 font-semibold ${c.ok ? "text-success" : "text-muted-foreground"}`}>
                      <span className={`inline-block h-2 w-2 rounded-full ${c.ok ? "bg-success" : "bg-muted-foreground/40"}`} />
                      {c.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-2xl bg-foreground text-background font-extrabold py-3.5 shadow-sticker hover:-translate-y-0.5 active:translate-y-0 transition disabled:opacity-60 disabled:translate-y-0"
            >
              {busy ? "…" : mode === "signin" ? "Sign me in" : "Create my account"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {mode === "signin" ? "New here?" : "Already have an account?"}{" "}
            <button
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="font-bold text-secondary hover:underline"
            >
              {mode === "signin" ? "Create one" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;