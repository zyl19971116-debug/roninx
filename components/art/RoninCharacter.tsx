"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { roninAssets } from "@/data/roninAssets";

export function RoninCharacter({ compact = false }: { variant?: "default" | "shadow" | "void" | "neon" | "mythic"; compact?: boolean }) {
  const [missing, setMissing] = useState(false);
  if (missing) return <span className="asset-missing">ASSET MISSING</span>;
  return <motion.div className={`ronin-art ${compact ? "compact" : ""}`} animate={{ y: [0, -5, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
    <img src={roninAssets.character.main} alt="RONIN X operator" loading="eager" draggable={false} onError={() => { console.error(`Missing RONIN X asset: ${roninAssets.character.main}`); setMissing(true); }}/>
  </motion.div>;
}
