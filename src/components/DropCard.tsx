import { formatDistanceToNow } from "date-fns";
import { Drop } from "@/lib/supabase";
import { Link as LinkIcon, Pencil } from "lucide-react";
import { getTagColor } from "@/lib/tagColors";

export const DropCard = ({ drop, onEdit }: { drop: Drop; onEdit?: (drop: Drop) => void }) => {
  const color = getTagColor(drop.tag_color);
  return (
    <div className="group relative rounded-2xl bg-card border border-border p-5 shadow-paper hover:-translate-y-0.5 hover:rotate-[-0.4deg] transition-all">
      <span className={`absolute left-0 top-5 bottom-5 w-1 rounded-r-full ${color.bar} opacity-80 group-hover:opacity-100 transition`} />
      <div className="flex items-start justify-between gap-3 mb-2 pl-2">
        {drop.tag ? (
          <span className={`inline-block px-3 py-1 rounded-full ${color.bg} ${color.text} text-xs font-bold uppercase tracking-wider`}>
            {drop.tag}
          </span>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-1 shrink-0">
          <span className="font-hand text-base text-muted-foreground whitespace-nowrap">
            {formatDistanceToNow(new Date(drop.created_at), { addSuffix: true })}
          </span>
          {onEdit && (
            <button
              onClick={() => onEdit(drop)}
              className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition p-1.5 rounded-full hover:bg-muted"
              aria-label="Edit drop"
              title="Edit"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
      <p className="text-foreground leading-relaxed whitespace-pre-wrap pl-2 text-[1.02rem]">{drop.content}</p>
      {drop.link && (
        <a
          href={drop.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 ml-2 inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:underline break-all"
        >
          <LinkIcon className="h-3.5 w-3.5 shrink-0" />
          {drop.link}
        </a>
      )}
    </div>
  );
};