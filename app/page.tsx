"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { usePlayerStore } from "@/store/playerStore";
import { items } from "@/data/items";
import styles from "./home.module.css";

const baseImage = "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260831_115955_2a9adb39-5e9b-4ced-96e2-6900eabe3de9.png&w=1920&q=85";
const revealImage = "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260831_123709_183f0065-efb2-4bb2-a849-13aaa5af2f3f.png&w=1920&q=85";
const showcaseIds = ["helmet-shadow-mask", "armor-shadow", "weapon-neon-katana", "core-solar", "back-ronin-pack"];
const showcase = showcaseIds.map((id) => items.find((item) => item.id === id)!).filter(Boolean);

function Words({ children, start = 0 }: { children: string; start?: number }) {
  return <>{children.split(/\s+/).map((word, index) => <span className={styles.pullWord} style={{ animationDelay: `${(start + index) * .1}s` }} key={`${word}-${index}`}>{word}</span>)}</>;
}

export default function HomePage() {
  const revealRef = useRef<HTMLDivElement>(null);
  const [showcaseIndex, setShowcaseIndex] = useState(0);
  const router = useRouter();
  const pushToast = usePlayerStore((state) => state.pushToast);

  useEffect(() => {
    const revealAt = (clientX: number, clientY: number) => {
      const layer = revealRef.current;
      if (!layer) return;
      const rect = layer.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const radius = window.innerWidth < 480 ? 120 : window.innerWidth < 720 ? 160 : 260;
      const mask = `radial-gradient(circle ${radius}px at ${x}px ${y}px, #fff 0%, #fff 40%, rgba(255,255,255,0.75) 60%, rgba(255,255,255,0.4) 75%, rgba(255,255,255,0.12) 88%, transparent 100%)`;
      layer.style.webkitMaskImage = mask;
      layer.style.maskImage = mask;
    };
    const mouse = (event: MouseEvent) => revealAt(event.clientX, event.clientY);
    const touch = (event: TouchEvent) => { const point = event.touches[0]; if (point) revealAt(point.clientX, point.clientY); };
    window.addEventListener("mousemove", mouse);
    window.addEventListener("touchmove", touch, { passive: true });
    return () => { window.removeEventListener("mousemove", mouse); window.removeEventListener("touchmove", touch); };
  }, []);
  useEffect(() => { const timer = window.setInterval(() => setShowcaseIndex((index) => (index + 1) % showcase.length), 4200); return () => window.clearInterval(timer); }, []);
  const featured = showcase[showcaseIndex];

  return <section className={styles.hero}>
    <div className={`${styles.heroImage} ${styles.baseImage}`} style={{ backgroundImage: `url('${baseImage}')` }}/>
    <div ref={revealRef} className={`${styles.heroImage} ${styles.revealImage}`} style={{ backgroundImage: `url('${revealImage}')` }}/>
    <div className={styles.heroUi}>
      <div className={styles.heroLeft}>
        <section className={styles.heroCopy} aria-labelledby="hero-title">
          <small className={`${styles.eyebrow} ${styles.fadeUp}`}>DISCIPLINE CREATES FREEDOM</small>
          <h1 id="hero-title" className={styles.wordsVisible}>
            <span className={styles.pullLine}><Words>A NEW</Words></span>
            <span className={`${styles.pullLine} ${styles.orangeLine}`}><Words start={2}>DAWN</Words></span>
          </h1>
          <p className={`${styles.intro} ${styles.fadeUp} ${styles.delay05}`}>A new generation of digital Ronin.<br/>Open crates.<br/>Collect equipment.<br/>Build your identity.</p>
          <div className={`${styles.ctaRow} ${styles.fadeUp} ${styles.delay065}`}>
            <Link className={styles.primaryCta} href="/crates">OPEN CRATE <span>→</span></Link>
            <button className={styles.secondaryCta} type="button" onClick={() => pushToast("TRAILER SIGNAL // MOVE CURSOR TO REVEAL NIGHTFALL")}><span>▶</span> WATCH TRAILER</button>
          </div>
          <small className={`${styles.socialLabel} ${styles.fadeUp} ${styles.delay075}`}>MORE THAN A BOX</small>
          <div className={`${styles.iconRow} ${styles.fadeUp} ${styles.delay065}`}>
            <a className={styles.iconBtn} href="https://x.com/RB_RoninX" target="_blank" rel="noopener noreferrer" aria-label="Follow RONIN X on X">𝕏</a>
            <button className={styles.iconBtn} type="button" aria-label="Inventory" onClick={() => router.push("/inventory")}>◉</button>
            <button className={styles.iconBtn} type="button" aria-label="Market" onClick={() => router.push("/market")}>➤</button>
          </div>
        </section>
        <article className={styles.productCard} style={{ "--item-accent": featured.visualConfig.accent } as React.CSSProperties}>
          <div className={styles.productThumb} key={featured.id}><img src={featured.image} alt={featured.name} loading="eager"/></div>
          <div className={styles.productBody}><h2>{featured.name}</h2><b className={styles.rarity}>{featured.rarity}</b><p>ATK +{featured.attack} &nbsp; DEF +{featured.defense}</p></div>
          <Link className={styles.cartBtn} href="/inventory">VIEW ITEM</Link>
        </article>
      </div>
    </div>
  </section>;
}
