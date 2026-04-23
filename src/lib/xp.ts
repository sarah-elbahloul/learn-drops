import { Drop } from "./supabase";

export const XP_PER_DROP = 10;

const LEVELS = [
  { min: 0, name: "Newborn Sponge" },
  { min: 30, name: "Curious Cat" },
  { min: 100, name: "Trivia Tinkerer" },
  { min: 200, name: "Knowledge Knight" },
  { min: 400, name: "Wisdom Wizard" },
  { min: 800, name: "Galaxy Brain" },
  { min: 1500, name: "Omniscient Otter" },
];

export function getLevel(xp: number) {
  let level = 1;
  let name = LEVELS[0].name;
  let nextAt = LEVELS[1]?.min ?? xp + 100;
  let prevAt = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].min) {
      level = i + 1;
      name = LEVELS[i].name;
      prevAt = LEVELS[i].min;
      nextAt = LEVELS[i + 1]?.min ?? LEVELS[i].min + 500;
    }
  }
  const progress = Math.min(100, Math.round(((xp - prevAt) / (nextAt - prevAt)) * 100));
  return { level, name, nextAt, prevAt, progress };
}

export function calculateStreak(drops: Pick<Drop, "created_at">[]): number {
  if (!drops.length) return 0;
  const days = new Set(
    drops.map((d) => {
      const dt = new Date(d.created_at);
      return `${dt.getFullYear()}-${dt.getMonth()}-${dt.getDate()}`;
    })
  );
  let streak = 0;
  const today = new Date();
  // allow streak to start from yesterday if nothing today yet
  const start = new Date(today);
  const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  if (!days.has(todayKey)) start.setDate(start.getDate() - 1);
  for (let i = 0; i < 365; i++) {
    const k = `${start.getFullYear()}-${start.getMonth()}-${start.getDate()}`;
    if (days.has(k)) {
      streak++;
      start.setDate(start.getDate() - 1);
    } else break;
  }
  return streak;
}

export const SUCCESS_MESSAGES = [
  "Big brain energy! 🧠",
  "Nerd. I like it. 🤓",
  "Another tiny win captured! ✨",
  "Dropped like it's hot. 🔥",
  "Your future self thanks you. 💌",
  "That's a keeper! 📌",
  "Knowledge: +1. Vibes: immaculate.",
  "Tiny brain, big growth. 🌱",
  "Caught one! 🪣",
];