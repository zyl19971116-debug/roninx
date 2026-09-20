import { dropRates } from "@/data/crates";
import { items, type GameItem } from "@/data/items";
import type { Rarity } from "@/data/rarity";

export function rollRarity(crateRarity: Rarity, random = Math.random): Rarity {
  const roll = random() * 100;
  let cursor = 0;
  for (const [rarity, chance] of Object.entries(dropRates[crateRarity])) {
    cursor += chance ?? 0;
    if (roll <= cursor) return rarity as Rarity;
  }
  return Object.keys(dropRates[crateRarity]).at(-1) as Rarity;
}

export function openCrateDrop(crateRarity: Rarity, random = Math.random): GameItem {
  const rarity = rollRarity(crateRarity, random);
  const pool = items.filter((item) => item.rarity === rarity);
  return pool[Math.floor(random() * pool.length)];
}
