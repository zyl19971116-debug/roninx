"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { roninAssets } from "@/data/roninAssets";
import type { Rarity } from "@/data/rarity";

export function CrateArt({ large = false, opened = false }: { rarity?: Rarity; large?: boolean; opened?: boolean }) {
  const [missing, setMissing] = useState(false);
  const src = opened ? roninAssets.crate.open : roninAssets.crate.closed;
  if (missing) return <span className="asset-missing">ASSET MISSING</span>;
  return <motion.img className={`crate-art ${large ? "large" : ""}`} src={src} alt={opened ? "Opened RONIN crate" : "Closed RONIN crate"} loading="eager" draggable={false} onError={() => { console.error(`Missing RONIN X asset: ${src}`); setMissing(true); }} animate={{ y: [0, -6, 0] }} transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}/>;
}
