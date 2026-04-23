import { Drop } from "@/lib/supabase";
import { TagColor } from "@/lib/tagColors";

export const normTag = (t?: string | null) => (t ?? "").trim().toLowerCase();

export type TagSummary = {
  key: string;          // lowercase
  display: string;      // most common original casing
  color: TagColor;      // most common color
  count: number;
};

export const summarizeTags = (drops: Drop[]): TagSummary[] => {
  const map = new Map<string, { displays: Map<string, number>; colors: Map<string, number>; count: number }>();
  for (const d of drops) {
    const k = normTag(d.tag);
    if (!k) continue;
    const entry = map.get(k) ?? { displays: new Map(), colors: new Map(), count: 0 };
    entry.count += 1;
    entry.displays.set(d.tag!, (entry.displays.get(d.tag!) ?? 0) + 1);
    if (d.tag_color) entry.colors.set(d.tag_color, (entry.colors.get(d.tag_color) ?? 0) + 1);
    map.set(k, entry);
  }
  const pickTop = <T,>(m: Map<T, number>, fallback: T): T => {
    let best: T = fallback; let bn = -1;
    m.forEach((v, k) => { if (v > bn) { bn = v; best = k; } });
    return best;
  };
  return Array.from(map.entries())
    .map(([key, e]) => ({
      key,
      display: pickTop(e.displays, key),
      color: pickTop(e.colors, "blue") as TagColor,
      count: e.count,
    }))
    .sort((a, b) => b.count - a.count);
};
