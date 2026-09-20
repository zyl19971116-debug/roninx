"use client";

import { motion } from "framer-motion";
import { EquipmentArt } from "@/components/art/EquipmentArt";
import type { GameItem } from "@/data/items";
import { rarityMeta } from "@/data/rarity";

export function ItemCard({ item, onClick, selected, action }: { item: GameItem; onClick?: () => void; selected?: boolean; action?: React.ReactNode }) {
  const meta = rarityMeta[item.rarity];
  return <motion.article className={`item-card ${selected ? "selected" : ""}`} style={{ "--rarity": meta.color, "--glow": meta.glow } as React.CSSProperties} whileHover={{ y: -5 }} onClick={onClick}>
    <div className="item-art"><EquipmentArt item={item} size={180}/><span>{item.rarity}</span></div>
    <div className="item-info"><small>{item.category} // {item.id}</small>{selected && <em className="equipped-mark">EQUIPPED</em>}<h3>{item.name}</h3><div className="mini-stats"><b>ATK {item.attack}</b><b>DEF {item.defense}</b><b>SPD {item.speed}</b></div><p>{item.value.toLocaleString()} $RON</p>{action}</div>
  </motion.article>;
}
