"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePlayerStore } from "@/store/playerStore";

const links = [["/", "HOME"], ["/crates", "CRATES"], ["/character", "CHARACTER"], ["/inventory", "INVENTORY"], ["/market", "MARKET"]];
type InjectedProvider = { request: (args: { method: string; params?: unknown[] }) => Promise<unknown>; isMetaMask?: boolean; isCoinbaseWallet?: boolean; isOkxWallet?: boolean; isRonin?: boolean; providers?: InjectedProvider[] };
const walletOptions = [
  { id: "metamask", name: "METAMASK", flag: "isMetaMask" },
  { id: "coinbase", name: "COINBASE WALLET", flag: "isCoinbaseWallet" },
  { id: "okx", name: "OKX WALLET", flag: "isOkxWallet" },
  { id: "ronin", name: "RONIN WALLET", flag: "isRonin" },
] as const;

function WalletLogo({ id }: { id: typeof walletOptions[number]["id"] }) {
  if (id === "metamask") return <svg className="wallet-logo" viewBox="0 0 40 40" aria-hidden="true"><rect x="2" y="2" width="36" height="36" rx="10" fill="#fff4e8"/><path fill="#e2761b" d="M8 8l9 6-3 7-6-2zm24 0-9 6 3 7 6-2zM14 21l6 4 6-4-2 10-4 3-4-3z"/><path fill="#763d16" d="M17 14h6l3 7-6 4-6-4z"/><path fill="#f6851b" d="M8 19l6 2 2 10-6-3zm24 0-6 2-2 10 6-3z"/></svg>;
  if (id === "coinbase") return <svg className="wallet-logo" viewBox="0 0 40 40" aria-hidden="true"><rect x="2" y="2" width="36" height="36" rx="11" fill="#0052ff"/><circle cx="20" cy="20" r="11" fill="#fff"/><rect x="15" y="15" width="10" height="10" rx="2" fill="#0052ff"/></svg>;
  if (id === "okx") return <svg className="wallet-logo" viewBox="0 0 40 40" aria-hidden="true"><rect x="2" y="2" width="36" height="36" rx="10" fill="#fff"/><path fill="#050607" d="M9 9h7v7H9zm8 0h7v7h-7zm8 0h7v7h-7zM9 17h7v7H9zm16 0h7v7h-7zM9 25h7v7H9zm8 0h7v7h-7zm8 0h7v7h-7z"/></svg>;
  return <svg className="wallet-logo" viewBox="0 0 40 40" aria-hidden="true"><rect x="2" y="2" width="36" height="36" rx="11" fill="#1273ea"/><path d="M12 29V13c5-4 14-4 17 1v15h-5V17c-2-2-5-2-7-1v13z" fill="#fff"/><path d="M17 20h7l5 9h-6z" fill="#b9d9ff"/></svg>;
}

export function GameShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const wallet = usePlayerStore((state) => state.wallet);
  const walletProvider = usePlayerStore((state) => state.walletProvider);
  const connect = usePlayerStore((state) => state.connectWallet);
  const connectExternal = usePlayerStore((state) => state.connectExternalWallet);
  const disconnect = usePlayerStore((state) => state.disconnectWallet);
  const grantStarterIfEligible = usePlayerStore((state) => state.grantStarterIfEligible);
  const pushToast = usePlayerStore((state) => state.pushToast);
  const [walletModal, setWalletModal] = useState(false);
  const [accountMenu, setAccountMenu] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [connectingId, setConnectingId] = useState<string | null>(null);
  useEffect(() => { grantStarterIfEligible(); }, [wallet, grantStarterIfEligible]);
  const doConnect = () => { setConnecting(true); window.setTimeout(() => { connect(); setConnecting(false); setWalletModal(false); }, 450); };
  const connectInjected = async (option: typeof walletOptions[number]) => {
    const injected = (window as typeof window & { ethereum?: InjectedProvider }).ethereum;
    const providers = injected?.providers?.length ? injected.providers : injected ? [injected] : [];
    const provider = providers.find((entry) => Boolean(entry[option.flag as keyof InjectedProvider]));
    if (!provider) { pushToast(`${option.name} NOT DETECTED`); return; }
    try {
      setConnectingId(option.id);
      const accounts = await provider.request({ method: "eth_requestAccounts" }) as string[];
      if (!accounts?.[0]) throw new Error("No account returned");
      const address = `${accounts[0].slice(0, 6)}…${accounts[0].slice(-4)}`;
      connectExternal(address, option.name);
      setWalletModal(false);
    } catch { pushToast("WALLET CONNECTION CANCELLED"); }
    finally { setConnectingId(null); }
  };
  return <>
    <header className="topbar global-header ronin-header">
      <Link className="brand ronin-header__logo" href="/">RONIN <b>X</b></Link>
      <nav>{links.map(([href, label]) => <Link key={href} href={href} className={pathname === href ? "active" : ""}>{label}</Link>)}</nav>
      <div className="top-actions ronin-header__actions"><span className="network-pill"><i>◆</i> ROBINHOOD MAINNET</span><button className="wallet-btn ronin-header__wallet" onClick={() => wallet ? setAccountMenu((open) => !open) : setWalletModal(true)}><span aria-hidden="true">▣</span>{wallet ?? "CONNECT WALLET"}</button></div>
      <AnimatePresence>{accountMenu && wallet && <motion.div className="account-menu" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><small>CONNECTED</small><span>{walletProvider ?? "INJECTED WALLET"}</span><b>{wallet}</b><button onClick={() => { navigator.clipboard?.writeText(wallet); pushToast("ADDRESS COPIED"); }}>COPY ADDRESS</button><button className="disconnect" onClick={() => { disconnect(); setAccountMenu(false); }}>DISCONNECT</button></motion.div>}</AnimatePresence>
    </header>
    <main>{children}</main>
    <nav className="mobile-nav">{links.map(([href, label]) => <Link key={href} href={href} className={pathname === href ? "active" : ""}><span>{label.slice(0, 1)}</span>{label}</Link>)}</nav>
    <AnimatePresence>{walletModal && <motion.div className="wallet-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setWalletModal(false)}><motion.section initial={{ scale: .95, y: 15 }} animate={{ scale: 1, y: 0 }} onClick={(event) => event.stopPropagation()}><button className="wallet-close" onClick={() => setWalletModal(false)}>CLOSE ×</button><small>ROBINHOOD MAINNET</small><h2>CONNECT WALLET</h2><p>Select an installed browser wallet. A connection request is sent only to the selected provider.</p><div className="wallet-options-grid">{walletOptions.map((option) => <button className="wallet-option" key={option.id} onClick={() => connectInjected(option)} disabled={Boolean(connectingId)}><WalletLogo id={option.id}/><span><b>{option.name}</b><small>{connectingId === option.id ? "CONNECTING..." : "BROWSER EXTENSION"}</small></span></button>)}</div><div className="wallet-divider"><span>OR LOCAL PREVIEW</span></div><button className="wallet-option demo-wallet-option" onClick={doConnect} disabled={connecting}><i>RX</i><span><b>RONIN DEMO WALLET</b><small>{connecting ? "CONNECTING..." : "LOCAL PROTOTYPE CONNECTOR"}</small></span></button></motion.section></motion.div>}</AnimatePresence>
  </>;
}
