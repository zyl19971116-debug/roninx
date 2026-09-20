"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RoninCharacter } from "@/components/art/RoninCharacter";
import { CinematicBackground } from "@/components/effects/CinematicBackground";
import { EquipmentArt } from "@/components/art/EquipmentArt";
import { byId, type Category, type GameItem } from "@/data/items";
import { rarityMeta } from "@/data/rarity";
import { usePlayerStore } from "@/store/playerStore";

const slots: { label: string; category: Category; wide?: boolean }[] = [
  { label: "HELMET", category: "HELMET" },
  { label: "ARMOR", category: "ARMOR" },
  { label: "WEAPON", category: "KATANA" },
  { label: "CORE", category: "CORE" },
  { label: "BACK ITEM", category: "BACK", wide: true },
];

export default function CharacterPage() {
  const inventory = usePlayerStore((state) => state.inventory);
  const equipped = usePlayerStore((state) => state.equippedItems);
  const equip = usePlayerStore((state) => state.equip);
  const pushToast = usePlayerStore((state) => state.pushToast);
  const [active, setActive] = useState<Category | null>(null);
  const [preview, setPreview] = useState<GameItem | null>(null);

  const equippedItems = useMemo(() => slots.map(({ category }) => equipped[category] ? byId(equipped[category]!) : undefined).filter(Boolean) as GameItem[], [equipped]);
  const choices = useMemo(() => {
    if (!active) return [];
    return [...new Set(inventory)].map(byId).filter((item): item is GameItem => Boolean(item && item.category === active));
  }, [inventory, active]);
  const totals = useMemo(() => ({
    attack: 210 + equippedItems.reduce((sum, item) => sum + item.attack, 0),
    defense: 170 + equippedItems.reduce((sum, item) => sum + item.defense, 0),
    energy: 120 + equippedItems.reduce((sum, item) => sum + item.luck * 3, 0),
    critical: 5 + equippedItems.reduce((sum, item) => sum + item.luck, 0),
    speed: 4 + Math.round(equippedItems.reduce((sum, item) => sum + item.speed, 0) / 5),
  }), [equippedItems]);

  useEffect(() => {
    equippedItems.forEach((item) => { const image = new Image(); image.src = item.image; });
  }, [equippedItems]);

  const openSelector = (category: Category) => {
    setActive(category);
    setPreview(equipped[category] ? byId(equipped[category]!) ?? null : null);
  };
  const apply = () => {
    if (!preview) return;
    equip(preview.id);
    setActive(null);
    setPreview(null);
  };

  return <section className="character-v2"><CinematicBackground mode="minimal"/>
    <aside className="character-info-v2">
      <header><small>LOADOUT // LIVE SYNC</small><h1>CHARACTER</h1><p>SAME SOUL. HIGHER GROUND.</p></header>
      <div className="character-id-v2"><i>◇</i><span><b>RONIN #01821</b><small>FIGHT. COLLECT. EVOLVE.</small></span></div>
      <div className="core-stats-v2"><h2>CORE STATS</h2>{[
        ["ATTACK", totals.attack], ["DEFENSE", totals.defense], ["ENERGY", totals.energy], ["CRITICAL", `${totals.critical}%`], ["SPEED", `${totals.speed}%`],
      ].map(([label, value]) => <div key={label}><span>{label}</span><b>{value}</b></div>)}</div>
      <Link className="view-inventory-v2" href="/inventory">VIEW INVENTORY <b>→</b></Link>
      <blockquote>“A HIGHER SELF<br/>IN A BROKEN WORLD.”</blockquote>
    </aside>

    <main className="character-hero-v2">
      <div className="character-halo-v2"/><div className="ground-ring-v2"><i/><i/></div>
      <RoninCharacter variant="shadow"/>
    </main>

    <aside className="loadout-v2">
      <header><h2>EQUIPMENT</h2><span>LOADOUT 1⌄</span></header>
      <div className="loadout-grid-v2">{slots.map(({ label, category, wide }) => { const item = equipped[category] ? byId(equipped[category]!) : undefined; return <button className={`loadout-card-v2 ${wide ? "wide" : ""}`} key={category} onClick={() => openSelector(category)} style={{ "--rarity": item ? rarityMeta[item.rarity].color : "#555", "--glow": item ? rarityMeta[item.rarity].glow : "transparent" } as React.CSSProperties}><span>{label}</span><i>›</i><div>{item ? <EquipmentArt item={item} size={wide ? 175 : 120}/> : <b className="empty-slot-v2">EMPTY</b>}</div><strong>{item?.name ?? "SELECT EQUIPMENT"}</strong><small>{item?.rarity ?? "EMPTY"}</small></button>; })}</div>
      <button className="save-loadout-v2" onClick={() => pushToast("LOADOUT SAVED")}>◇ &nbsp; SAVE LOADOUT</button><p>EQUIP. ADAPT. SURVIVE.</p>
    </aside>

    <AnimatePresence>{active && <motion.div className="equipment-selector-v2" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 220 }}>
      <header><div><small>OWNED EQUIPMENT</small><h2>SELECT {slots.find((slot) => slot.category === active)?.label}</h2></div><button onClick={() => { setActive(null); setPreview(null); }}>CLOSE ×</button></header>
      <div className="selector-items-v2">{choices.map((item) => <button className={preview?.id === item.id ? "selected" : ""} key={item.id} onClick={() => setPreview(item)} style={{ "--rarity": rarityMeta[item.rarity].color, "--glow": rarityMeta[item.rarity].glow } as React.CSSProperties}><div><EquipmentArt item={item} size={92}/></div><span><b>{item.name}</b><small>{item.rarity}</small></span>{equipped[active] === item.id && <i>EQUIPPED</i>}</button>)}{choices.length === 0 && <p className="selector-empty-v2">NO OWNED GEAR IN THIS SLOT</p>}</div>
      {preview && <div className="selector-preview-v2"><div><EquipmentArt item={preview} size={125}/></div><section><small>{preview.rarity}</small><h3>{preview.name}</h3><p>ATK {preview.attack} &nbsp; DEF {preview.defense} &nbsp; SPD {preview.speed}</p></section></div>}
      <button className="selector-equip-v2" disabled={!preview || equipped[active] === preview.id} onClick={apply}>{preview && equipped[active] === preview.id ? "EQUIPPED" : "EQUIP"}</button>
    </motion.div>}</AnimatePresence>
  </section>;
}
