import type { EngineEvent } from "./types";

export function totalXp(events: EngineEvent[]) {
  return events.reduce((sum, e) => sum + e.xp, 0);
}

// Streamo's level curve, lifted as-is: level 2 at 100 XP, level 3 at 400, level 4 at 900
export function xpToLevel(xp: number) {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export function nextLevelAt(level: number) {
  return level * level * 100;
}
