"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CinematicBackground } from "@/components/effects/CinematicBackground";
import { EquipmentArt } from "@/components/art/EquipmentArt";
import { byId, type Category, type GameItem } from "@/data/items";
import { rarities, rarityMeta, type Rarity } from "@/data/rarity";
import { usePlayerStore } from "@/store/playerStore";

const filters: { label: string; value: Category | "ALL" }[] = [
  { label: "ALL", value: "ALL" }, { label: "WEAPONS", value: "KATANA" }, { label: "HELMETS", value: "HELMET" },
  { label: "ARMORS", value: "ARMOR" }, { label: "CORES", value: "CORE" }, { label: "BACK ITEMS", value: "BACK" },
];
type OwnedItem = { item: GameItem; quantity: number; newest: number };

export default function InventoryPage() {
  const owned = usePlayerStore((state) => state.inventory);
  const equipped = usePlayerStore((state) => state.equippedItems);
  const equip = usePlayerStore((state) => state.equip);
  const [category, setCategory] = useState<Category | "ALL">("ALL");
  const [rarity, setRarity] = useState<Rarity | "ALL">("ALL");
  const [sort, setSort] = useState("NEWEST");
  const [query, setQuery] = useState("");
  const [detail, setDetail] = useState<GameItem | null>(null);

  const entries = useMemo(() => {
    const map = new Map<string, OwnedItem>();
    owned.forEach((id, index) => {
      const item = byId(id);
      if (!item) return;
      const current = map.get(id);
      map.set(id, current ? { ...current, quantity: current.quantity + 1, newest: index } : { item, quantity: 1, newest: index });
    });
    return [...map.values()].filter(({ item }) => category === "ALL" || item.category === category)
      .filter(({ item }) => rarity === "ALL" || item.rarity === rarity)
      .filter(({ item }) => item.name.toLowerCase().includes(query.trim().toLowerCase()))
      .sort((a, b) => sort === "RARITY" ? rarityMeta[b.item.rarity].rank - rarityMeta[a.item.rarity].rank : b.newest - a.newest);
  }, [owned, category, rarity, query, sort]);

  return <section className="inventory-v1"><CinematicBackground mode="minimal"/>
    <header className="inventory-hero"><div><small>RX VAULT // PERSONAL LOADOUT</small><h1>INVENTORY</h1><p>COLLECT. EQUIP. TRADE.</p></div><div><b>{owned.length}</b><span>TOTAL ITEMS</span><b>{entries.length}</b><span>VISIBLE TYPES</span></div></header>
    <div className="inventory-controls"><div className="inventory-tabs">{filters.map((filter) => <button key={filter.value} className={category === filter.value ? "active" : ""} onClick={() => setCategory(filter.value)}>{filter.label}</button>)}</div><div className="inventory-tools"><label><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search inventory..."/></label><select value={rarity} onChange={(event) => setRarity(event.target.value as Rarity | "ALL")}><option value="ALL">All rarities</option>{rarities.map((entry) => <option key={entry}>{entry}</option>)}</select><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="NEWEST">Newest</option><option value="RARITY">Rarity</option></select></div></div>
    <div className="inventory-compact-grid">{entries.map(({ item, quantity }) => { const isEquipped = equipped[item.category] === item.id; return <motion.article className="inventory-card" key={item.id} style={{ "--rarity": rarityMeta[item.rarity].color, "--glow": rarityMeta[item.rarity].glow } as React.CSSProperties} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} onClick={() => setDetail(item)}><div className="inventory-image"><EquipmentArt item={item} size={155}/>{quantity > 1 && <b className="quantity-badge">×{quantity}</b>}{isEquipped && <i className="inventory-equipped">EQUIPPED</i>}</div><div className="inventory-card-copy"><small style={{ color: rarityMeta[item.rarity].color }}>{item.rarity}</small><h2>{item.name}</h2><span>{item.category === "KATANA" ? "WEAPON" : item.category === "BACK" ? "BACK ITEM" : item.category}</span><div><button className={isEquipped ? "active" : ""} onClick={(event) => { event.stopPropagation(); equip(item.id); }}>{isEquipped ? "EQUIPPED" : "EQUIP"}</button><span className="inventory-owned-label">OWNED ×{quantity}</span></div></div></motion.article>; })}</div>
    {entries.length === 0 && <div className="inventory-empty">NO OWNED ITEMS MATCH THESE FILTERS</div>}
    <AnimatePresence>{detail && <motion.div className="item-detail compact-detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><button className="panel-close" onClick={() => setDetail(null)}>CLOSE ×</button><div className="detail-art" style={{ "--rarity": rarityMeta[detail.rarity].color } as React.CSSProperties}><EquipmentArt item={detail} size={330}/></div><div className="detail-copy"><small>{detail.rarity} // {detail.id}</small><h2>{detail.name}</h2><p>{detail.description}</p><div className="big-stats"><span><small>ATTACK</small><b>{detail.attack}</b></span><span><small>DEFENSE</small><b>{detail.defense}</b></span><span><small>SPEED</small><b>{detail.speed}</b></span><span><small>LUCK</small><b>{detail.luck}</b></span></div><p>OWNER // RONIN #01821</p><div className="detail-actions"><button className="btn primary" onClick={() => equip(detail.id)}>EQUIP</button></div></div></motion.div>}</AnimatePresence>
  </section>;
}
