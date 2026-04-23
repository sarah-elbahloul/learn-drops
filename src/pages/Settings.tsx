import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { TopBar } from "@/components/TopBar";
import { toast } from "sonner";
import { Mail, Lock, Trash2, ArrowLeft, ShieldAlert } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const SPECIALS = "!@#$%^&*()_+-=[]{};:,.<>?";
const validatePassword = (pw: string): string | null => {
  if (pw.length < 6) return "Password must be at least 6 characters.";
  if (!/[A-Z]/.test(pw)) return "Password needs at least one uppercase letter.";
  if (!/[0-9]/.test(pw)) return "Password needs at least one number.";
  if (!/[!@#$%^&*()_+\-=\[\]{};:,.<>?]/.test(pw))
    return `Password needs one special character (${SPECIALS}).`;
  return null;
};

const Settings = () => {
  const { user, signOut } = useAuth();
  const nav = useNavigate();

  const [newEmail, setNewEmail] = useState("");
  const [emailBusy, setEmailBusy] = useState(false);

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [pwBusy, setPwBusy] = useState(false);

  const [confirmText, setConfirmText] = useState("");
  const [delBusy, setDelBusy] = useState(false);

  const checks = {
    len: newPw.length >= 6,
    upper: /[A-Z]/.test(newPw),
    num: /[0-9]/.test(newPw),
    special: /[!@#$%^&*()_+\-=\[\]{};:,.<>?]/.test(newPw),
  };

  const onChangeEmail = async (e: FormEvent) => {
    e.preventDefault();
    if (!newEmail || newEmail === user?.email) {
      toast.error("Enter a new email different from your current one.");
      return;
    }
    setEmailBusy(true);
    const { error } = await supabase.auth.updateUser(
      { email: newEmail },
      { emailRedirectTo: `${window.location.origin}/dashboard` }
    );
    setEmailBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Confirmation links sent to both your old and new email 📬");
      setNewEmail("");
    }
  };

  const onChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    const err = validatePassword(newPw);
    if (err) { toast.error(err); return; }
    if (!user?.email) { toast.error("No email on account."); return; }

    setPwBusy(true);
    // Re-authenticate by signing in with current password
    const { error: reauthErr } = await supabase.auth.signInWithPassword({
      email: user.email, password: currentPw,
    });
    if (reauthErr) {
      setPwBusy(false);
      toast.error("Current password is incorrect.");
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: newPw });
    setPwBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Password updated 🔒");
      setCurrentPw(""); setNewPw("");
    }
  };

  const onDelete = async () => {
    if (!user) return;
    setDelBusy(true);
    // Calls a Postgres RPC `delete_my_account` which removes auth user + cascades drops.
    const { error } = await supabase.rpc("delete_my_account");
    setDelBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Your account was deleted. Take care 🌱");
    await signOut();
    nav("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar xp={0} streak={0} />
      <main className="container max-w-2xl py-8 space-y-6">
        <button
          onClick={() => nav(-1)}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <header>
          <h1 className="font-display text-4xl">Account settings</h1>
          <p className="font-hand text-xl text-muted-foreground mt-1">
            Tidy up your nest 🪺
          </p>
        </header>

        <section className="bg-card rounded-[2rem] p-6 shadow-paper border border-border">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-2xl bg-secondary shadow-sticker">
              <Mail className="h-4 w-4 text-secondary-foreground" />
            </span>
            <h2 className="font-display text-2xl">Change email</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Current: <span className="font-bold text-foreground">{user?.email}</span>
          </p>
          <form onSubmit={onChangeEmail} className="space-y-3">
            <input
              type="email"
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="new@email.com"
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:ring-4 focus:ring-primary/30 focus:border-primary transition"
            />
            <button
              type="submit"
              disabled={emailBusy}
              className="rounded-2xl bg-foreground text-background font-extrabold px-5 py-2.5 shadow-sticker hover:-translate-y-0.5 active:translate-y-0 transition disabled:opacity-60"
            >
              {emailBusy ? "Sending…" : "Send confirmation"}
            </button>
            <p className="text-xs text-muted-foreground">
              You'll get a confirmation link at the new address. Email changes only apply once confirmed.
            </p>
          </form>
        </section>

        <section className="bg-card rounded-[2rem] p-6 shadow-paper border border-border">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-2xl bg-primary shadow-sticker">
              <Lock className="h-4 w-4 text-primary-foreground" />
            </span>
            <h2 className="font-display text-2xl">Change password</h2>
          </div>
          <form onSubmit={onChangePassword} className="space-y-3">
            <div>
              <label className="text-sm font-bold block mb-1.5">Current password</label>
              <input
                type="password"
                required
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:ring-4 focus:ring-primary/30 focus:border-primary transition"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="text-sm font-bold block mb-1.5">New password</label>
              <input
                type="password"
                required
                minLength={6}
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:ring-4 focus:ring-primary/30 focus:border-primary transition"
                placeholder="••••••••"
              />
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
            </div>
            <button
              type="submit"
              disabled={pwBusy}
              className="rounded-2xl bg-foreground text-background font-extrabold px-5 py-2.5 shadow-sticker hover:-translate-y-0.5 active:translate-y-0 transition disabled:opacity-60"
            >
              {pwBusy ? "Updating…" : "Update password"}
            </button>
          </form>
        </section>

        <section className="bg-card rounded-[2rem] p-6 shadow-paper border-2 border-destructive/40">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-2xl bg-destructive shadow-sticker">
              <ShieldAlert className="h-4 w-4 text-destructive-foreground" />
            </span>
            <h2 className="font-display text-2xl">Danger zone</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Deleting your account permanently removes all your drops, tags, and login. This cannot be undone.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="inline-flex items-center gap-2 rounded-2xl bg-destructive text-destructive-foreground font-extrabold px-5 py-2.5 shadow-sticker hover:-translate-y-0.5 active:translate-y-0 transition">
                <Trash2 className="h-4 w-4" /> Delete my account
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-[2rem]">
              <AlertDialogHeader>
                <AlertDialogTitle className="font-display text-2xl">Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete your account and every drop you've ever saved.
                  Type <span className="font-bold text-foreground">DELETE</span> below to confirm.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Type DELETE"
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:ring-4 focus:ring-destructive/30 focus:border-destructive transition"
              />
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setConfirmText("")}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  disabled={confirmText !== "DELETE" || delBusy}
                  onClick={onDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {delBusy ? "Deleting…" : "Yes, delete forever"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </section>
      </main>
    </div>
  );
};

export default Settings;
