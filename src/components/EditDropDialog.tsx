import { FormEvent, useEffect, useState } from "react";
import { Drop, supabase } from "@/lib/supabase";
import { TAG_COLORS, TagColor } from "@/lib/tagColors";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Link as LinkIcon, Tag, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Props = {
  drop: Drop | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: (updated: Drop) => void;
  onDeleted?: (id: string) => void;
};

export const EditDropDialog = ({ drop, open, onOpenChange, onSaved, onDeleted }: Props) => {
  const [content, setContent] = useState("");
  const [link, setLink] = useState("");
  const [tag, setTag] = useState("");
  const [tagColor, setTagColor] = useState<TagColor>("blue");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (drop) {
      setContent(drop.content);
      setLink(drop.link ?? "");
      setTag(drop.tag ?? "");
      setTagColor((drop.tag_color as TagColor) ?? "blue");
    }
  }, [drop?.id]);

  if (!drop) return null;

  const onSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setBusy(true);
    const { data, error } = await supabase
      .from("drops")
      .update({
        content: content.trim(),
        link: link.trim() || null,
        tag: tag.trim() || null,
        tag_color: tag.trim() ? tagColor : null,
      })
      .eq("id", drop.id)
      .select()
      .single();
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    onSaved(data as Drop);
    toast.success("Drop updated ✏️");
    onOpenChange(false);
  };

  const onDelete = async () => {
    if (!confirm("Delete this drop forever?")) return;
    setBusy(true);
    const { error } = await supabase.from("drops").delete().eq("id", drop.id);
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    onDeleted?.(drop.id);
    toast.success("Drop deleted");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Edit drop</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSave} className="space-y-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full font-hand text-xl rounded-2xl border border-border bg-background px-3 py-2 outline-none focus:ring-4 focus:ring-secondary/30 focus:border-secondary transition resize-none"
            required
          />
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
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="Tag"
              maxLength={24}
              className="w-full rounded-2xl border border-border bg-background pl-9 pr-4 py-2.5 outline-none focus:ring-4 focus:ring-secondary/30 focus:border-secondary transition text-sm"
            />
          </div>
          {tag.trim() && (
            <div className="flex items-center gap-2 flex-wrap">
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
          <DialogFooter className="gap-2 sm:gap-2">
            <button
              type="button"
              onClick={onDelete}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-2xl px-4 py-2.5 text-sm font-bold text-destructive hover:bg-destructive/10 transition disabled:opacity-50 mr-auto"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </button>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-2xl px-4 py-2.5 text-sm font-bold hover:bg-muted transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy || !content.trim()}
              className="rounded-2xl px-5 py-2.5 text-sm font-extrabold bg-foreground text-background shadow-sticker hover:-translate-y-0.5 transition disabled:opacity-50"
            >
              Save
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
