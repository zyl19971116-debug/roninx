"use client";

import { useMemo, useState } from "react";
import { CinematicBackground } from "@/components/effects/CinematicBackground";
import { EquipmentArt } from "@/components/art/EquipmentArt";
import { items, type Category } from "@/data/items";
import { rarities, rarityMeta, type Rarity } from "@/data/rarity";

const categoryFilters: { label: string; category: Category | "ALL"; count: number }[] = [
  { label: "ALL", category: "ALL", count: 26 },
  { label: "WEAPONS", category: "KATANA", count: 6 },
  { label: "HELMETS", category: "HELMET", count: 5 },
  { label: "ARMORS", category: "ARMOR", count: 5 },
  { label: "CORES", category: "CORE", count: 5 },
  { label: "BACK ITEMS", category: "BACK", count: 5 },
];
const pageSize = 20;

export default function MarketPage() {
  const [category, setCategory] = useState<Category | "ALL">("ALL");
  const [selectedRarities, setSelectedRarities] = useState<Rarity[]>([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("RARITY");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => items.filter((item) => item.listed)
    .filter((item) => category === "ALL" || item.category === category)
    .filter((item) => selectedRarities.length === 0 || selectedRarities.includes(item.rarity))
    .filter((item) => item.name.toLowerCase().includes(query.trim().toLowerCase()))
    .sort((a, b) => sort === "RARITY" ? rarityMeta[b.rarity].rank - rarityMeta[a.rarity].rank : a.name.localeCompare(b.name)), [category, selectedRarities, query, sort]);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pages);
  const visible = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const reset = () => { setCategory("ALL"); setSelectedRarities([]); setQuery(""); setSort("RARITY"); setPage(1); };
  const toggleRarity = (rarity: Rarity) => { setSelectedRarities((current) => current.includes(rarity) ? current.filter((entry) => entry !== rarity) : [...current, rarity]); setPage(1); };

  return <section className="market-v1"><CinematicBackground mode="market"/>
    <header className="market-hero"><div><small>RX EQUIPMENT ARCHIVE</small><h1>MARKETPLACE</h1><p>DISCOVER. COLLECT. EVOLVE.</p></div><span>Preview the complete RONIN X equipment collection.</span></header>
    <div className="market-layout">
      <aside className="market-filters">
        <div className="filter-heading"><h2>FILTERS</h2><button onClick={reset}>CLEAR</button></div>
        <section><h3>CATEGORY</h3>{categoryFilters.map((filter) => <button key={filter.label} className={category === filter.category ? "active" : ""} onClick={() => { setCategory(filter.category); setPage(1); }}><span>{filter.label}</span><b>{filter.count}</b></button>)}</section>
        <section><h3>RARITY</h3>{rarities.map((rarity) => <label key={rarity}><input type="checkbox" checked={selectedRarities.includes(rarity)} onChange={() => toggleRarity(rarity)}/><i style={{ background: rarityMeta[rarity].color }}/><span>{rarity}</span></label>)}</section>
        <button className="clear-filters" onClick={reset}>CLEAR FILTERS</button>
      </aside>
      <div className="market-content">
        <div className="market-preview-notice"><i/><div><b>MARKET PREVIEW</b><strong>TRADING COMING SOON</strong><p>Equipment purchasing and trading are temporarily unavailable. The RONIN X Marketplace will open in a future update.</p></div></div>
        <div className="market-toolbar"><label><span>⌕</span><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search items..."/></label><div><span>{filtered.length} ITEMS</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="RARITY">Rarity</option><option value="NAME">Name</option></select></div></div>
        <div className="market-compact-grid">{visible.map((item) => <article className="market-card" key={item.id} style={{ "--rarity": rarityMeta[item.rarity].color, "--glow": rarityMeta[item.rarity].glow } as React.CSSProperties}><div className="market-image"><EquipmentArt item={item} size={165}/></div><div className="market-card-copy"><small style={{ color: rarityMeta[item.rarity].color }}>{item.rarity}</small><h2>{item.name}</h2><span>{item.category === "KATANA" ? "WEAPON" : item.category === "BACK" ? "BACK ITEM" : item.category}</span><div><b>NOT TRADABLE YET</b></div></div></article>)}</div>
        {visible.length === 0 && <div className="market-empty">NO LISTINGS MATCH THESE FILTERS</div>}
        <footer className="market-pagination"><span>Showing {filtered.length ? (safePage - 1) * pageSize + 1 : 0}–{Math.min(safePage * pageSize, filtered.length)} of {filtered.length} items</span><div><button disabled={safePage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>‹</button>{Array.from({ length: pages }, (_, index) => <button className={safePage === index + 1 ? "active" : ""} key={index} onClick={() => setPage(index + 1)}>{index + 1}</button>)}<button disabled={safePage === pages} onClick={() => setPage((value) => Math.min(pages, value + 1))}>›</button></div></footer>
      </div>
    </div>
  </section>;
}
