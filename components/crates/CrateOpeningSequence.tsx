"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CrateArt } from "@/components/art/CrateArt";
import { EquipmentArt } from "@/components/art/EquipmentArt";
import type { Crate } from "@/data/crates";
import type { GameItem } from "@/data/items";
import { rarityMeta } from "@/data/rarity";

export type CrateState = "IDLE" | "READY" | "OPENING" | "REVEAL" | "CLAIMED" | "ERROR";

export function CrateOpeningSequence({ crate, reward, state, crateBalance, onClaim, onAnother, onInventory, onEquip }: { crate: Crate; reward: GameItem; state: CrateState; crateBalance: number; onClaim: () => void; onAnother: () => void; onInventory: () => void; onEquip: () => void }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    if (state !== "OPENING") return;
    setPhase(0);
    const timers = [400, 800, 1300, 1800, 2100, 2250].map((ms, index) => window.setTimeout(() => setPhase(index + 1), ms));
    return () => timers.forEach(window.clearTimeout);
  }, [state, reward.id]);
  const meta = rarityMeta[reward.rarity];
  const revealed = state === "REVEAL" || state === "CLAIMED";
  return <motion.div className={`opening-overlay ${reward.rarity === "MYTHIC" ? "mythic" : ""}`} style={{ "--rarity": meta.color, "--glow": meta.glow } as React.CSSProperties} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <div className="opening-vignette"/><div className="scanlines"/>
    <div className="reward-stage">
      <motion.div className={`opening-crate phase-${phase} ${revealed ? "crate-revealed" : ""}`} initial={{ y: -360, scale: .72 }} animate={{ y: revealed ? 150 : 80, scale: revealed ? .78 : 1, rotate: state === "OPENING" && phase >= 2 && phase < 6 ? [0, -2, 2, -1, 0] : 0 }} transition={{ y: { type: "spring", damping: 16, stiffness: 100 }, scale: { type: "spring", damping: 16, stiffness: 100 }, rotate: { duration: .45, ease: "easeInOut" } }}><CrateArt rarity={crate.rarity} large opened={phase >= 6 || revealed}/><div className="scan-beam"/></motion.div>
      <AnimatePresence>{state === "OPENING" && phase >= 5 && <motion.div className="opening-flash" initial={{ opacity: 0, scale: .2 }} animate={{ opacity: [0, 1, 0], scale: 2 }} transition={{ duration: .75 }}/>}</AnimatePresence>
      {revealed && <section className="reward-reveal-v1">
        <div className="reward-glow-v1"/><small>{reward.rarity}</small><h1>{reward.name}</h1>
        <div className="reward-art-v1"><EquipmentArt item={reward} size={400}/></div>
        <div className="reward-meta-v1"><b>{reward.category === "KATANA" ? "WEAPON" : reward.category === "BACK" ? "BACK ITEM" : reward.category}</b><span>ATK +{reward.attack}</span><span>DEF +{reward.defense}</span></div>
        {state === "REVEAL" ? <button className="btn primary reward-claim" onClick={onClaim}>CLAIM ITEM</button> : <><strong className="acquired-label">ITEM ACQUIRED</strong><div className="reward-actions"><button className="btn primary" onClick={onEquip}>EQUIP NOW</button><button className="btn" onClick={onAnother}>{crateBalance > 0 ? "OPEN ANOTHER" : "GET MORE CRATES"}</button><button className="text-btn" onClick={onInventory}>VIEW INVENTORY</button></div></>}
      </section>}
    </div>
    <p className="sequence-label">{state === "OPENING" ? phase < 2 ? "GLOW CHARGE" : phase < 4 ? "SEALS UNLOCKING" : "SIGNATURE FOUND" : state === "REVEAL" ? "REWARD READY // CLAIM REQUIRED" : "ITEM SECURED"}</p>
  </motion.div>;
}
