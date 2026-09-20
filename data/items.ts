import type { Rarity } from "./rarity";
import { roninAssets } from "./roninAssets";

export type Category = "HELMET" | "ARMOR" | "KATANA" | "BACK" | "CORE";
export type GameItem = {
  id: string;
  name: string;
  category: Category;
  rarity: Rarity;
  image: string;
  description: string;
  attack: number;
  defense: number;
  speed: number;
  luck: number;
  value: number;
  marketPrice: number;
  owner: string;
  listed: boolean;
  visualConfig: { variant: number; accent: string };
};

const accents: Record<Rarity, string> = { COMMON: "#b8bec7", RARE: "#3d8cff", EPIC: "#a25cff", LEGENDARY: "#ff8a1f", MYTHIC: "#f12f45" };
const rank: Record<Rarity, number> = { COMMON: 1, RARE: 2, EPIC: 3, LEGENDARY: 4, MYTHIC: 5 };

function item(id: string, name: string, category: Category, rarity: Rarity, image: string, variant: number): GameItem {
  const tier = rank[rarity];
  return {
    id, name, category, rarity, image,
    description: `Official RONIN X ${category.toLowerCase()} equipment. Authenticated for the RX-01821 arsenal.`,
    attack: tier * 6 + (variant % 7),
    defense: tier * 5 + (variant % 5),
    speed: tier * 4 + (variant % 6),
    luck: tier * 2 + (variant % 4),
    value: tier * tier * 520 + variant * 90,
    marketPrice: tier * tier * 520 + variant * 90,
    owner: `0x${String(1821 + variant).padStart(4, "0")}…RONIN`,
    listed: true,
    visualConfig: { variant, accent: accents[rarity] },
  };
}

export const items: GameItem[] = [
  item("weapon-neon-katana", "NEON KATANA", "KATANA", "LEGENDARY", roninAssets.weapons.neonKatana, 1),
  item("weapon-shadow-katana", "SHADOW KATANA", "KATANA", "EPIC", roninAssets.weapons.shadowKatana, 2),
  item("weapon-void-blade", "VOID BLADE", "KATANA", "EPIC", roninAssets.weapons.voidBlade, 3),
  item("weapon-solar-katana", "SOLAR KATANA", "KATANA", "RARE", roninAssets.weapons.solarKatana, 4),
  item("weapon-ash-blade", "ASH BLADE", "KATANA", "RARE", roninAssets.weapons.ashBlade, 5),
  item("weapon-ronin-katana", "RONIN KATANA", "KATANA", "COMMON", roninAssets.weapons.roninKatana, 6),
  item("helmet-shadow-mask", "SHADOW MASK", "HELMET", "LEGENDARY", roninAssets.helmets.shadowMask, 7),
  item("helmet-oni", "ONI HELMET", "HELMET", "MYTHIC", roninAssets.helmets.oni, 8),
  item("helmet-void", "VOID HELMET", "HELMET", "EPIC", roninAssets.helmets.void, 9),
  item("helmet-tactical", "TACTICAL HELMET", "HELMET", "RARE", roninAssets.helmets.tactical, 10),
  item("helmet-ronin", "RONIN HELMET", "HELMET", "COMMON", roninAssets.helmets.ronin, 11),
  item("armor-shadow", "SHADOW ARMOR", "ARMOR", "LEGENDARY", roninAssets.armors.shadow, 12),
  item("armor-oni", "ONI ARMOR", "ARMOR", "EPIC", roninAssets.armors.oni, 13),
  item("armor-tactical", "TACTICAL ARMOR", "ARMOR", "RARE", roninAssets.armors.tactical, 14),
  item("armor-nomad", "NOMAD ARMOR", "ARMOR", "RARE", roninAssets.armors.nomad, 15),
  item("armor-ronin", "RONIN ARMOR", "ARMOR", "COMMON", roninAssets.armors.ronin, 16),
  item("core-solar", "SOLAR CORE", "CORE", "LEGENDARY", roninAssets.cores.solar, 17),
  item("core-void", "VOID CORE", "CORE", "EPIC", roninAssets.cores.void, 18),
  item("core-cyber", "CYBER CORE", "CORE", "RARE", roninAssets.cores.cyber, 19),
  item("core-fusion", "FUSION CORE", "CORE", "RARE", roninAssets.cores.fusion, 20),
  item("core-basic", "BASIC CORE", "CORE", "COMMON", roninAssets.cores.basic, 21),
  item("back-ronin-pack", "RONIN PACK", "BACK", "LEGENDARY", roninAssets.backItems.roninPack, 22),
  item("back-void-wings", "VOID WINGS", "BACK", "EPIC", roninAssets.backItems.voidWings, 23),
  item("back-tactical-pack", "TACTICAL PACK", "BACK", "RARE", roninAssets.backItems.tacticalPack, 24),
  item("back-energy-tank", "ENERGY TANK", "BACK", "RARE", roninAssets.backItems.energyTank, 25),
  item("back-sheath-pack", "SHEATH PACK", "BACK", "COMMON", roninAssets.backItems.sheathPack, 26),
];

export const demoInventoryIds = [
  "weapon-ronin-katana", "helmet-ronin", "armor-ronin", "core-basic", "back-sheath-pack",
  "weapon-solar-katana", "helmet-tactical", "armor-tactical", "core-cyber", "back-tactical-pack",
  "weapon-shadow-katana", "helmet-void", "armor-oni", "helmet-shadow-mask", "helmet-oni",
];

export const byId = (id: string) => items.find((entry) => entry.id === id);
