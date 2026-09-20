"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { CinematicBackground } from "@/components/effects/CinematicBackground";
import { CrateArt } from "@/components/art/CrateArt";
import { CrateOpeningSequence, type CrateState } from "@/components/crates/CrateOpeningSequence";
import { crates, dropRates, type Crate } from "@/data/crates";
import { items, type Category, type GameItem } from "@/data/items";
import { rarities, rarityMeta, type Rarity } from "@/data/rarity";
import { openCrateDrop } from "@/lib/dropEngine";
import { usePlayerStore } from "@/store/playerStore";

const categories: Category[] = ["KATANA", "HELMET", "ARMOR", "CORE", "BACK"];
const features = [["▧", "RANDOM EQUIPMENT", "Weapons, helmets, armors, cores, or back items."], ["☆", "ALL RARITIES", "From Common to Mythic."], ["⌃", "BUILD YOUR RONIN", "Every crate brings you closer to legend."]];

export default function CratesPage() {
  const router = useRouter();
  const crate = crates[0];
  const [reward, setReward] = useState<GameItem | null>(null);
  const [crateState, setCrateState] = useState<CrateState>("IDLE");
  const [assetsReady, setAssetsReady] = useState(false);
  const [freeOpen, setFreeOpen] = useState(false);
  const [forcedRarity, setForcedRarity] = useState<Rarity | "RANDOM">("RANDOM");
  const [forcedCategory, setForcedCategory] = useState<Category | "RANDOM">("RANDOM");
  const wallet = usePlayerStore((state) => state.wallet);
  const crateBalance = usePlayerStore((state) => state.crateBalance);
  const connectWallet = usePlayerStore((state) => state.connectWallet);
  const consumeCrate = usePlayerStore((state) => state.consumeCrate);
  const claimReward = usePlayerStore((state) => state.claimReward);
  const equip = usePlayerStore((state) => state.equip);
  const pushToast = usePlayerStore((state) => state.pushToast);
  const dailyClaimAt = usePlayerStore((state) => state.dailyClaimAt);
  const supplyClaims = usePlayerStore((state) => state.supplyClaims);
  const milestoneClaims = usePlayerStore((state) => state.milestoneClaims);
  const claimDailyCrate = usePlayerStore((state) => state.claimDailyCrate);
  const claimSupplyCrate = usePlayerStore((state) => state.claimSupplyCrate);
  const claimMilestoneCrate = usePlayerStore((state) => state.claimMilestoneCrate);

  useEffect(() => { let live = true; Promise.all(items.map((item) => new Promise<void>((resolve) => { const image = new Image(); image.onload = image.onerror = () => resolve(); image.src = item.image; }))).then(() => { if (live) setAssetsReady(true); }); return () => { live = false; }; }, []);
  const chooseReward = () => { const pool = process.env.NODE_ENV === "development" ? items.filter((item) => (forcedRarity === "RANDOM" || item.rarity === forcedRarity) && (forcedCategory === "RANDOM" || item.category === forcedCategory)) : []; return pool[Math.floor(Math.random() * pool.length)] ?? openCrateDrop(crate.rarity); };
  const beginOpen = () => {
    if (!wallet) { connectWallet(); return; }
    if (!assetsReady) { pushToast("LOADING REWARD ASSETS"); return; }
    if (crateBalance < 1) { setFreeOpen(true); return; }
    const next = chooseReward(); setReward(next);
    if (!consumeCrate()) { setCrateState("ERROR"); return; }
    setCrateState("OPENING"); window.setTimeout(() => setCrateState("REVEAL"), 3150);
  };
  const claim = () => { if (!reward || crateState !== "REVEAL") return; claimReward(reward); setCrateState("CLAIMED"); };
  const another = () => { setReward(null); setCrateState("READY"); if (crateBalance < 1) setFreeOpen(true); };
  const dailyReady = wallet ? Date.now() - (dailyClaimAt[wallet] ?? 0) >= 86_400_000 : false;
  const starterClaimed = wallet ? true : false;

  return <section className="crates-v2"><CinematicBackground mode="industrial"/>
    <div className={`crate-idle-v2 ${crateState === "OPENING" ? "dimmed" : ""}`}>
      <aside className="crate-info-v2"><small>RONIN X SUPPLY DROP</small><h1>CRATES</h1><p>OPEN. COLLECT. EVOLVE.</p><section><h2>RONIN CRATE</h2><span>Contains one random RONIN X equipment item.</span><h3>DROP RATES</h3>{Object.entries(dropRates.EPIC).map(([rarity, rate]) => <div className="drop-row-v2" key={rarity} style={{ "--rate-color": rarityMeta[rarity as Rarity].color } as React.CSSProperties}><b>{rarity}</b><i><em style={{ width: `${rate}%` }}/></i><strong>{rate}%</strong></div>)}</section><blockquote>HIGHER GEAR.<br/>A STRONGER TOMORROW.</blockquote></aside>
      <main className="crate-hero-v2"><div className="crate-halo-v2"/><div className="crate-platform-v2"><i/></div><motion.div animate={{ y: [0, -7, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}><CrateArt rarity={crate.rarity} large/></motion.div><p>ONE CRATE. A THOUSAND POSSIBILITIES.</p></main>
      <aside className="crate-status-v2"><section><header><i>▧</i><h2>CRATE STATUS</h2></header><div><small>CRATES OWNED</small><b>{String(crateBalance).padStart(2, "0")}</b><span>RONIN CRATE</span></div><button className="open-crate-v2" onClick={beginOpen}>{!wallet ? "CONNECT WALLET" : "▧  OPEN CRATE"}</button><button className="more-crates-v2" onClick={() => setFreeOpen(true)}>GET MORE CRATES</button><footer><i>▣</i><span><b>MORE CRATES. MORE POSSIBILITIES.</b>Collect. Upgrade. Dominate.</span></footer></section>
        {process.env.NODE_ENV === "development" && <div className="dev-roll-controls"><small>DEV // FORCE NEXT REWARD</small><select value={forcedRarity} onChange={(event) => setForcedRarity(event.target.value as Rarity | "RANDOM")}><option>RANDOM</option>{rarities.map((entry) => <option key={entry}>{entry}</option>)}</select><select value={forcedCategory} onChange={(event) => setForcedCategory(event.target.value as Category | "RANDOM")}><option>RANDOM</option>{categories.map((entry) => <option key={entry}>{entry}</option>)}</select></div>}</aside>
      <div className="crate-features-v2">{features.map(([icon, title, copy]) => <article key={title}><i>{icon}</i><span><b>{title}</b><small>{copy}</small></span></article>)}</div>
    </div>
    <AnimatePresence>{freeOpen && <motion.div className="free-crate-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setFreeOpen(false)}><motion.section initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} onClick={(event) => event.stopPropagation()}><button className="panel-close" onClick={() => setFreeOpen(false)}>CLOSE ×</button><small>FREE CRATE REWARDS</small><h2>GET MORE CRATES</h2><div className="free-drop-list"><article><span><b>STARTER DROP</b><small>10 RONIN CRATES // ONE TIME PER WALLET</small></span><strong>{starterClaimed ? "CLAIMED" : "CONNECT"}</strong></article><article><span><b>DAILY DROP</b><small>ONE FREE CRATE EVERY 24 HOURS</small></span><button disabled={!dailyReady} onClick={claimDailyCrate}>{dailyReady ? "CLAIM" : "COOLDOWN"}</button></article><article><span><b>FREE SUPPLY DROP</b><small>LIMITED PROTOTYPE DROP</small></span><button disabled={wallet ? supplyClaims[wallet] : true} onClick={claimSupplyCrate}>{wallet && supplyClaims[wallet] ? "CLAIMED" : "CLAIM"}</button></article><article><span><b>MILESTONE REWARDS</b><small>OPEN YOUR FIRST CRATE</small></span><button disabled={wallet ? milestoneClaims[`${wallet}:first-open`] : true} onClick={() => claimMilestoneCrate("first-open")}>{wallet && milestoneClaims[`${wallet}:first-open`] ? "CLAIMED" : "CLAIM"}</button></article><article><span><b>EVENT DROPS</b><small>FUTURE COMMUNITY EVENTS</small></span><strong>LOCKED</strong></article></div></motion.section></motion.div>}</AnimatePresence>
    {reward && <CrateOpeningSequence crate={crate} reward={reward} state={crateState} crateBalance={crateBalance} onClaim={claim} onAnother={another} onInventory={() => router.push("/inventory")} onEquip={() => equip(reward.id)}/>} 
  </section>;
}
