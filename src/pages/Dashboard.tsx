import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { TopBar } from "@/components/TopBar";
import { DropCard } from "@/components/DropCard";
import { useAuth } from "@/contexts/AuthContext";
import { Drop, supabase } from "@/lib/supabase";
import { calculateStreak, getLevel, SUCCESS_MESSAGES, XP_PER_DROP } from "@/lib/xp";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { Droplets, Link as LinkIcon, Tag, Flame, Sparkles } from "lucide-react";
import { TAG_COLORS, TagColor, getTagColor } from "@/lib/tagColors";
import { summarizeTags } from "@/lib/tagUtils";
import { EditDropDialog } from "@/components/EditDropDialog";

const Dashboard = () => {
  const { user } = useAuth();
  const [drops, setDrops] = useState<Drop[]>([]);
  const [content, setContent] = useState("");
  const [link, setLink] = useState("");
  const [tag, setTag] = useState("");
  const [tagColor, setTagColor] = useState<TagColor>("blue");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Drop | null>(null);
  const [showSuggest, setShowSuggest] = useState(false);
  const tagInputRef = useRef<HTMLDivElement>(null);

  const loadDrops = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("drops")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setDrops((data as Drop[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    loadDrops();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Close suggestions on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (tagInputRef.current && !tagInputRef.current.contains(e.target as Node)) {
        setShowSuggest(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const tagSummaries = useMemo(() => summarizeTags(drops), [drops]);
  const tagSuggestions = useMemo(() => {
    const q = tag.trim().toLowerCase();
    if (!q) return [];
    return tagSummaries.filter((t) => t.key.includes(q) && t.key !== q).slice(0, 5);
  }, [tag, tagSummaries]);

  const pickSuggestion = (s: { display: string; color: TagColor }) => {
    setTag(s.display);
    setTagColor(s.color);
    setShowSuggest(false);
  };

  const xp = drops.length * XP_PER_DROP;
  const streak = calculateStreak(drops);
  const lvl = getLevel(xp);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !content.trim()) return;
    setBusy(true);
    const { data, error } = await supabase
      .from("drops")
      .insert({
        user_id: user.id,
        content: content.trim(),
        link: link.trim() || null,
        tag: tag.trim() || null,
        tag_color: tag.trim() ? tagColor : null,
      })
      .select()
      .single();
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setDrops((d) => [data as Drop, ...d]);
    setContent("");
    setLink("");
    setTag("");
    setTagColor("blue");
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.65 },
      colors: ["#FFD84D", "#6EC1FF", "#5DDBA9"],
    });
    toast.success(SUCCESS_MESSAGES[Math.floor(Math.random() * SUCCESS_MESSAGES.length)]);
  };

  return (
    <div className="min-h-screen bg-sun relative">
      <div className="pointer-events-none fixed inset-0 bg-dots opacity-40" />
      <TopBar xp={xp} streak={streak} />
      <main className="relative container max-w-3xl py-8 space-y-8">
        {/* Greeting */}
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <p className="font-hand text-2xl text-muted-foreground">
              {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
            </p>
            <h1 className="font-display text-4xl sm:text-5xl">
              What's the <span className="ink-underline">drop</span> today?
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-full bg-foreground text-background text-xs font-extrabold flex items-center gap-1.5 shadow-soft">
              <Flame className="h-3.5 w-3.5 text-primary" /> {streak} day{streak === 1 ? "" : "s"}
            </span>
            <span className="px-3 py-1.5 rounded-full bg-success/50 text-foreground text-xs font-extrabold flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> {xp} XP
            </span>
          </div>
        </div>

        {/* Level progress */}
        <div className="rounded-3xl bg-card border border-border p-5 shadow-paper">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-sm font-bold flex items-center gap-2">
              <span className="inline-flex w-7 h-7 rounded-xl bg-primary/30 items-center justify-center font-display">{lvl.level}</span>
              {lvl.name}
            </span>
            <span className="font-hand text-lg text-muted-foreground">{xp} / {lvl.nextAt} XP</span>
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-success transition-all duration-700"
              style={{ width: `${lvl.progress}%` }}
            />
          </div>
        </div>

        {/* Input area */}
        <form onSubmit={onSubmit} className="relative rounded-[2rem] bg-card border border-border p-6 shadow-paper space-y-4 bg-notebook">
          <span className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-extrabold uppercase tracking-wider shadow-soft">
            Today's drop
          </span>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Today I learned…"
            rows={4}
            className="w-full font-hand text-2xl rounded-2xl border-0 bg-transparent px-2 py-3 outline-none resize-none transition placeholder:text-muted-foreground/60 leading-snug"
            required
          />
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="Attach a link"
                className="w-full rounded-2xl border border-border bg-background pl-9 pr-4 py-2.5 outline-none focus:ring-4 focus:ring-secondary/30 focus:border-secondary transition text-sm"
              />
            </div>
            <div className="relative" ref={tagInputRef}>
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={tag}
                onChange={(e) => { setTag(e.target.value); setShowSuggest(true); }}
                onFocus={() => setShowSuggest(true)}
                placeholder="Tag it (Cooking, Tech…)"
                maxLength={24}
                autoComplete="off"
                className="w-full rounded-2xl border border-border bg-background pl-9 pr-4 py-2.5 outline-none focus:ring-4 focus:ring-secondary/30 focus:border-secondary transition text-sm"
              />
              {showSuggest && tagSuggestions.length > 0 && (
                <div className="absolute z-20 left-0 right-0 mt-1 rounded-2xl border border-border bg-popover shadow-paper p-1.5 max-h-60 overflow-auto">
                  <span className="block px-2 pt-1 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Your tags</span>
                  {tagSuggestions.map((s) => {
                    const c = getTagColor(s.color);
                    return (
                      <button
                        type="button"
                        key={s.key}
                        onMouseDown={(e) => { e.preventDefault(); pickSuggestion(s); }}
                        className="w-full flex items-center gap-2 px-2 py-1.5 rounded-xl text-left text-sm hover:bg-muted transition"
                      >
                        <span className={`inline-block h-3 w-3 rounded-full ${c.dot}`} />
                        <span className={`px-2 py-0.5 rounded-full ${c.bg} ${c.text} text-xs font-bold uppercase tracking-wider`}>
                          {s.display}
                        </span>
                        <span className="ml-auto text-xs text-muted-foreground">{s.count}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          {tag.trim() && (
            <div className="flex items-center gap-2 flex-wrap pl-1">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-1">Color</span>
              {TAG_COLORS.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setTagColor(c.id)}
                  title={c.label}
                  aria-label={`Pick ${c.label}`}
                  className={`h-7 w-7 rounded-full ${c.dot} border-2 transition ${
                    tagColor === c.id ? "border-foreground scale-110 shadow-soft" : "border-transparent hover:scale-105"
                  }`}
                />
              ))}
            </div>
          )}
          <button
            type="submit"
            disabled={busy || !content.trim()}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-foreground text-background font-extrabold text-lg py-4 shadow-sticker hover:-translate-y-0.5 active:translate-y-0 transition disabled:opacity-50 disabled:translate-y-0"
          >
            <Droplets className="h-5 w-5" />
            Drop it!
          </button>
        </form>

        {/* Recent drops */}
        <section>
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-display text-2xl">Recent drops</h2>
            <span className="font-hand text-lg text-muted-foreground">your last 5 ↓</span>
          </div>
          {loading ? (
            <p className="text-muted-foreground">Loading…</p>
          ) : drops.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-border p-10 text-center">
              <p className="font-hand text-3xl mb-2">An empty page!</p>
              <p className="text-muted-foreground">Your first drop is waiting up there ☝️</p>
            </div>
          ) : (
            <div className="space-y-3">
              {drops.slice(0, 5).map((d) => (
                <div key={d.id} className="animate-drop-bounce">
                  <DropCard drop={d} onEdit={setEditing} />
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <EditDropDialog
        drop={editing}
        open={!!editing}
        onOpenChange={(o) => !o && setEditing(null)}
        onSaved={(u) => setDrops((arr) => arr.map((x) => (x.id === u.id ? u : x)))}
        onDeleted={(id) => setDrops((arr) => arr.filter((x) => x.id !== id))}
      />
    </div>
  );
};

export default Dashboard;