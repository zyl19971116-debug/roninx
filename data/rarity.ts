export const rarities = ["COMMON", "RARE", "EPIC", "LEGENDARY", "MYTHIC"] as const;
export type Rarity = (typeof rarities)[number];

export const rarityMeta: Record<Rarity, { color: string; glow: string; rank: number }> = {
  COMMON: { color: "#b8bec7", glow: "rgba(184,190,199,.35)", rank: 1 },
  RARE: { color: "#3d8cff", glow: "rgba(61,140,255,.45)", rank: 2 },
  EPIC: { color: "#a25cff", glow: "rgba(162,92,255,.48)", rank: 3 },
  LEGENDARY: { color: "#ff8a1f", glow: "rgba(255,138,31,.52)", rank: 4 },
  MYTHIC: { color: "#f12f45", glow: "rgba(241,47,69,.62)", rank: 5 },
};
