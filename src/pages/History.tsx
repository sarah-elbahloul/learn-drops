import { useEffect, useMemo, useState } from "react";
import { TopBar } from "@/components/TopBar";
import { DropCard } from "@/components/DropCard";
import { useAuth } from "@/contexts/AuthContext";
import { Drop, supabase } from "@/lib/supabase";
import { calculateStreak, XP_PER_DROP } from "@/lib/xp";
import { toast } from "sonner";
import { summarizeTags, normTag } from "@/lib/tagUtils";
import { TAG_COLORS, TagColor, getTagColor } from "@/lib/tagColors";
import { EditDropDialog } from "@/components/EditDropDialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Palette } from "lucide-react";

const History = () => {
  const { user } = useAuth();
  const [drops, setDrops] = useState<Drop[]>([]);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Drop | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data, error } = await supabase
        .from("drops")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) toast.error(error.message);
      setDrops((data as Drop[]) ?? []);
      setLoading(false);
    })();
  }, [user?.id]);

  const xp = drops.length * XP_PER_DROP;
  const streak = calculateStreak(drops);

  const tagSummaries = useMemo(() => summarizeTags(drops), [drops]);
  const filtered = activeTag ? drops.filter((d) => normTag(d.tag) === activeTag) : drops;

  const recolorTag = async (tagKey: string, color: TagColor) => {
    if (!user) return;
    const ids = drops.filter((d) => normTag(d.tag) === tagKey).map((d) => d.id);
    if (ids.length === 0) return;
    const prev = drops;
    setDrops((arr) => arr.map((d) => (ids.includes(d.id) ? { ...d, tag_color: color } : d)));
    const { error } = await supabase
      .from("drops")
      .update({ tag_color: color })
      .in("id", ids);
    if (error) {
      setDrops(prev);
      toast.error(error.message);
    } else {
      toast.success(`Recolored "${tagKey}" 🎨`);
    }
  };

  return (
    <div className="min-h-screen bg-sun relative">
      <div className="pointer-events-none fixed inset-0 bg-dots opacity-40" />
      <TopBar xp={xp} streak={streak} />
      <main className="relative container max-w-3xl py-8">
        <p className="font-hand text-2xl text-muted-foreground">a little museum of your curiosity</p>
        <h1 className="font-display text-5xl mb-3">My <span className="ink-underline">Journey</span></h1>
        <p className="text-muted-foreground mb-8">
          <strong className="text-foreground">{drops.length}</strong> drop{drops.length === 1 ? "" : "s"} captured · {tagSummaries.length} topic{tagSummaries.length === 1 ? "" : "s"} explored. Keep going. 🌱
        </p>

        {tagSummaries.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8 p-4 rounded-3xl bg-card border border-border shadow-paper">
            <span className="w-full text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
              Filter by topic <span className="font-normal normal-case tracking-normal text-muted-foreground/70">· click 🎨 to recolor</span>
            </span>
            <button
              onClick={() => setActiveTag(null)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition ${
                activeTag === null
                  ? "bg-foreground text-background shadow-sticker"
                  : "bg-muted hover:bg-secondary/30"
              }`}
            >
              All · {drops.length}
            </button>
            {tagSummaries.map((s) => {
              const c = getTagColor(s.color);
              const active = activeTag === s.key;
              return (
                <div key={s.key} className={`inline-flex items-center rounded-full ${c.bg} ${c.text} ${active ? "shadow-sticker ring-2 ring-foreground" : ""} transition`}>
                  <button
                    onClick={() => setActiveTag(active ? null : s.key)}
                    className="pl-4 pr-2 py-1.5 text-sm font-bold uppercase tracking-wider"
                  >
                    {s.display} <span className="opacity-70 normal-case">· {s.count}</span>
                  </button>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        className="pr-3 pl-1 py-1.5 opacity-70 hover:opacity-100 transition"
                        aria-label={`Change color of ${s.display}`}
                        title="Change color"
                      >
                        <Palette className="h-3.5 w-3.5" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-2 rounded-2xl">
                      <div className="flex items-center gap-1.5">
                        {TAG_COLORS.map((tc) => (
                          <button
                            key={tc.id}
                            onClick={() => recolorTag(s.key, tc.id)}
                            title={tc.label}
                            aria-label={`Pick ${tc.label}`}
                            className={`h-6 w-6 rounded-full ${tc.dot} border-2 transition ${
                              s.color === tc.id ? "border-foreground scale-110" : "border-transparent hover:scale-105"
                            }`}
                          />
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              );
            })}
          </div>
        )}

        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : filtered.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-border p-10 text-center">
            <p className="font-hand text-3xl mb-2">Nothing here yet!</p>
            <p className="text-muted-foreground">Go drop something — anything counts.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((d) => (
              <DropCard key={d.id} drop={d} onEdit={setEditing} />
            ))}
          </div>
        )}
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

export default History;