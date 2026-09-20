"use client";

import { useState } from "react";
import type { GameItem } from "@/data/items";

export function EquipmentArt({ item, size = 180 }: { item: GameItem; size?: number }) {
  const [missing, setMissing] = useState(false);
  if (missing) return <span className="asset-missing">ASSET MISSING</span>;
  return <img className={`equipment-art equipment-${item.category.toLowerCase()}`} src={item.image} width={size} height={size} loading={size >= 280 ? "eager" : "lazy"} alt={item.name} onError={() => { console.error(`Missing RONIN X asset: ${item.image}`); setMissing(true); }}/>
}

export const HelmetArt = EquipmentArt;
export const KatanaArt = EquipmentArt;
export const ArmorArt = EquipmentArt;
export const CoreArt = EquipmentArt;
export const AccessoryArt = EquipmentArt;
