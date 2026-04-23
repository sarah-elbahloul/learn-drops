export type TagColor = "blue" | "pink" | "green" | "amber" | "violet" | "coral";

export const TAG_COLORS: { id: TagColor; label: string; bg: string; text: string; bar: string; dot: string }[] = [
  { id: "blue",   label: "Sky",    bg: "bg-[hsl(205_100%_90%)]", text: "text-[hsl(205_70%_25%)]", bar: "bg-[hsl(205_85%_65%)]", dot: "bg-[hsl(205_85%_65%)]" },
  { id: "pink",   label: "Blossom",bg: "bg-[hsl(340_100%_92%)]", text: "text-[hsl(340_60%_30%)]", bar: "bg-[hsl(340_80%_70%)]", dot: "bg-[hsl(340_80%_70%)]" },
  { id: "green",  label: "Mint",   bg: "bg-[hsl(150_70%_88%)]",  text: "text-[hsl(150_50%_22%)]", bar: "bg-[hsl(150_60%_55%)]", dot: "bg-[hsl(150_60%_55%)]" },
  { id: "amber",  label: "Honey",  bg: "bg-[hsl(40_100%_85%)]",  text: "text-[hsl(30_70%_28%)]",  bar: "bg-[hsl(40_95%_60%)]",  dot: "bg-[hsl(40_95%_60%)]" },
  { id: "violet", label: "Lilac",  bg: "bg-[hsl(265_85%_92%)]",  text: "text-[hsl(265_50%_32%)]", bar: "bg-[hsl(265_70%_70%)]", dot: "bg-[hsl(265_70%_70%)]" },
  { id: "coral",  label: "Coral",  bg: "bg-[hsl(15_100%_88%)]",  text: "text-[hsl(15_70%_28%)]",  bar: "bg-[hsl(15_85%_65%)]",  dot: "bg-[hsl(15_85%_65%)]" },
];

export const getTagColor = (id?: string | null) => {
  return TAG_COLORS.find((c) => c.id === id) ?? TAG_COLORS[0];
};
