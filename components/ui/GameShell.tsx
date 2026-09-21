"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePlayerStore } from "@/store/playerStore";

const links = [["/", "HOME"], ["/crates", "CRATES"], ["/character", "CHARACTER"], ["/inventory", "INVENTORY"], ["/market", "MARKET"]];
type InjectedProvider = { request: (args: { method: string; params?: unknown[] }) => Promise<unknown>; on?: (event: string, handler: (...args: unknown[]) => void) => void; removeListener?: (event: string, handler: (...args: unknown[]) => void) => void; isMetaMask?: boolean; isCoinbaseWallet?: boolean; isOkxWallet?: boolean; isRonin?: boolean; providers?: InjectedProvider[] };
type Eip6963Provider = { info: { name: string; rdns: string; uuid: string; icon: string }; provider: InjectedProvider };
const walletOptions = [
  { id: "metamask", name: "METAMASK", flag: "isMetaMask", match: "metamask", logo: "/assets/ronin/ui/wallets/metamask.svg" },
  { id: "coinbase", name: "COINBASE WALLET", flag: "isCoinbaseWallet", match: "coinbase", logo: "/assets/ronin/ui/wallets/coinbase-wallet.svg" },
  { id: "okx", name: "OKX WALLET", flag: "isOkxWallet", match: "okx", logo: "/assets/ronin/ui/wallets/okx-wallet.svg" },
  { id: "ronin", name: "RONIN WALLET", flag: "isRonin", match: "ronin", logo: "/assets/ronin/ui/wallets/ronin-wallet.svg" },
] as const;

const shortAddress = (address: string) => address.startsWith("0x") && address.length > 14 ? `${address.slice(0, 6)}…${address.slice(-4)}` : address;
const formatNativeBalance = (hex: string) => (Number(BigInt(hex)) / 1e18).toFixed(5);

export function GameShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const wallet = usePlayerStore((state) => state.wallet);
  const walletProvider = usePlayerStore((state) => state.walletProvider);
  const connectExternal = usePlayerStore((state) => state.connectExternalWallet);
  const updateWalletNetwork = usePlayerStore((state) => state.updateWalletNetwork);
  const disconnect = usePlayerStore((state) => state.disconnectWallet);
  const grantStarterIfEligible = usePlayerStore((state) => state.grantStarterIfEligible);
  const pushToast = usePlayerStore((state) => state.pushToast);
  const [walletModal, setWalletModal] = useState(false);
  const [accountMenu, setAccountMenu] = useState(false);
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const discoveredProviders = useRef<Eip6963Provider[]>([]);
  const activeProvider = useRef<InjectedProvider | null>(null);
  const activeProviderName = useRef<string>("");
  useEffect(() => { grantStarterIfEligible(); }, [wallet, grantStarterIfEligible]);
  useEffect(() => {
    const announce = (event: Event) => {
      const detail = (event as CustomEvent<Eip6963Provider>).detail;
      if (detail?.provider && !discoveredProviders.current.some((entry) => entry.info.uuid === detail.info.uuid)) discoveredProviders.current.push(detail);
    };
    window.addEventListener("eip6963:announceProvider", announce);
    window.dispatchEvent(new Event("eip6963:requestProvider"));
    return () => window.removeEventListener("eip6963:announceProvider", announce);
  }, []);
  const connectInjected = async (option: typeof walletOptions[number]) => {
    const browser = window as typeof window & { ethereum?: InjectedProvider; okxwallet?: InjectedProvider; coinbaseWalletExtension?: InjectedProvider; ronin?: { provider?: InjectedProvider } };
    const announced = discoveredProviders.current.find((entry) => `${entry.info.rdns} ${entry.info.name}`.toLowerCase().includes(option.match));
    const injected = browser.ethereum;
    const providers = injected?.providers?.length ? injected.providers : injected ? [injected] : [];
    const legacy = option.id === "okx" ? browser.okxwallet : option.id === "coinbase" ? browser.coinbaseWalletExtension : option.id === "ronin" ? browser.ronin?.provider : undefined;
    const provider = announced?.provider ?? legacy ?? providers.find((entry) => Boolean(entry[option.flag as keyof InjectedProvider])) ?? (providers.length === 1 ? providers[0] : undefined);
    if (!provider) { pushToast(`${option.name} EXTENSION NOT DETECTED`); return; }
    try {
      setConnectingId(option.id);
      const accounts = await provider.request({ method: "eth_requestAccounts" }) as string[];
      if (!accounts?.[0]) throw new Error("No account returned");
      const [chainId, balanceHex] = await Promise.all([provider.request({ method: "eth_chainId" }) as Promise<string>, provider.request({ method: "eth_getBalance", params: [accounts[0], "latest"] }) as Promise<string>]);
      activeProvider.current = provider;
      activeProviderName.current = option.name;
      connectExternal(accounts[0], option.name, chainId, formatNativeBalance(balanceHex));
      setWalletModal(false);
    } catch (error) { const message = error instanceof Error ? error.message : "Connection rejected"; pushToast(message.toUpperCase().includes("REJECT") ? "WALLET CONNECTION CANCELLED" : "WALLET CONNECTION FAILED"); }
    finally { setConnectingId(null); }
  };
  useEffect(() => {
    const provider = activeProvider.current;
    if (!provider?.on) return;
    const accountsChanged = async (...args: unknown[]) => {
      const accounts = args[0] as string[];
      if (!accounts?.[0]) { disconnect(); return; }
      const [chainId, balanceHex] = await Promise.all([provider.request({ method: "eth_chainId" }) as Promise<string>, provider.request({ method: "eth_getBalance", params: [accounts[0], "latest"] }) as Promise<string>]);
      connectExternal(accounts[0], activeProviderName.current, chainId, formatNativeBalance(balanceHex));
    };
    const chainChanged = async (...args: unknown[]) => {
      const chainId = String(args[0] ?? "");
      if (!wallet) return;
      const balanceHex = await provider.request({ method: "eth_getBalance", params: [wallet, "latest"] }) as string;
      updateWalletNetwork(chainId, formatNativeBalance(balanceHex));
    };
    provider.on("accountsChanged", accountsChanged);
    provider.on("chainChanged", chainChanged);
    return () => { provider.removeListener?.("accountsChanged", accountsChanged); provider.removeListener?.("chainChanged", chainChanged); };
  }, [wallet, connectExternal, disconnect, updateWalletNetwork]);
  return <>
    <header className="topbar global-header ronin-header">
      <Link className="brand ronin-header__logo" href="/">RONIN <b>X</b></Link>
      <nav>{links.map(([href, label]) => <Link key={href} href={href} className={pathname === href ? "active" : ""}>{label}</Link>)}</nav>
      <div className="top-actions ronin-header__actions"><span className="network-pill"><i>◆</i> ROBINHOOD MAINNET</span><button className="wallet-btn ronin-header__wallet" onClick={() => wallet ? setAccountMenu((open) => !open) : setWalletModal(true)}><span aria-hidden="true">▣</span>{wallet ? shortAddress(wallet) : "CONNECT WALLET"}</button></div>
      <AnimatePresence>{accountMenu && wallet && <motion.div className="account-menu" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><small>CONNECTED</small><span>{walletProvider ?? "INJECTED WALLET"}</span><b>{shortAddress(wallet)}</b><button onClick={() => { navigator.clipboard?.writeText(wallet); pushToast("ADDRESS COPIED"); }}>COPY ADDRESS</button><button className="disconnect" onClick={() => { disconnect(); setAccountMenu(false); }}>DISCONNECT</button></motion.div>}</AnimatePresence>
    </header>
    <main>{children}</main>
    <nav className="mobile-nav">{links.map(([href, label]) => <Link key={href} href={href} className={pathname === href ? "active" : ""}><span>{label.slice(0, 1)}</span>{label}</Link>)}</nav>
    <AnimatePresence>{walletModal && <motion.div className="wallet-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setWalletModal(false)}><motion.section initial={{ scale: .95, y: 15 }} animate={{ scale: 1, y: 0 }} onClick={(event) => event.stopPropagation()}><button className="wallet-close" onClick={() => setWalletModal(false)}>CLOSE ×</button><small>MAINNET WALLET</small><h2>CONNECT WALLET</h2><p>Select an installed wallet. The site supports the EIP-6963 multi-wallet standard and legacy browser providers.</p><div className="wallet-options-grid">{walletOptions.map((option) => <button className="wallet-option" key={option.id} onClick={() => connectInjected(option)} disabled={Boolean(connectingId)}><img className="wallet-logo" src={option.logo} alt=""/><span><b>{option.name}</b><small>{connectingId === option.id ? "CONNECTING..." : "BROWSER EXTENSION"}</small></span></button>)}</div></motion.section></motion.div>}</AnimatePresence>
  </>;
}
