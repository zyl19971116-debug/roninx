import type { Rarity } from "@/data/rarity";

export const forgeCosts: Record<Rarity, number> = { COMMON: 150, RARE: 500, EPIC: 1800, LEGENDARY: 6000, MYTHIC: 0 };
export const burnScrap: Record<Rarity, number> = { COMMON: 50, RARE: 125, EPIC: 350, LEGENDARY: 900, MYTHIC: 2500 };
