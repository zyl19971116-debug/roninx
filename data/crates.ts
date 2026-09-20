import type { Rarity } from "./rarity";
import type { Category } from "./items";

export type Crate = { id: string; name: string; rarity: Rarity; price: number; description: string };

export const dropRates: Record<Rarity, Partial<Record<Rarity, number>>> = {
  COMMON: { COMMON: 70, RARE: 25, EPIC: 5 },
  RARE: { COMMON: 25, RARE: 55, EPIC: 18, LEGENDARY: 2 },
  EPIC: { COMMON: 50, RARE: 30, EPIC: 14, LEGENDARY: 5, MYTHIC: 1 },
  LEGENDARY: { EPIC: 55, LEGENDARY: 40, MYTHIC: 5 },
  MYTHIC: { EPIC: 20, LEGENDARY: 55, MYTHIC: 25 },
};

export const equipmentDropRates: Partial<Record<Category, number>> = {
  KATANA: 24,
  HELMET: 22,
  ARMOR: 20,
  CORE: 18,
  BACK: 16,
};

export const crates: Crate[] = [
  { id: "ronin-crate", name: "RONIN", rarity: "EPIC", price: 2000, description: "One sealed Ronin arsenal containing weapons, helmets, armor, cores, and back equipment." },
];
