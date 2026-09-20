"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { byId, demoInventoryIds, items, type Category, type GameItem } from "@/data/items";
import { burnScrap, forgeCosts } from "@/lib/economy";
import type { Rarity } from "@/data/rarity";

type Toast = { id: number; message: string };
type PlayerState = {
  wallet: string | null;
  walletProvider: string | null;
  balance: number;
  inventory: string[];
  equippedItems: Partial<Record<Category, string>>;
  scrap: number;
  crateHistory: string[];
  crateBalance: number;
  isStarterClaimed: boolean;
  starterClaims: Record<string, boolean>;
  dailyClaimAt: Record<string, number>;
  supplyClaims: Record<string, boolean>;
  milestoneClaims: Record<string, boolean>;
  starterReconciled: boolean;
  marketListings: Record<string, number>;
  achievements: string[];
  muted: boolean;
  toasts: Toast[];
  connectWallet: () => void;
  connectExternalWallet: (address: string, provider: string) => void;
  disconnectWallet: () => void;
  grantStarterIfEligible: () => void;
  equip: (id: string) => void;
  claimFreeCrate: () => boolean;
  getCrate: (price: number) => boolean;
  claimDailyCrate: () => boolean;
  claimSupplyCrate: () => boolean;
  claimMilestoneCrate: (id: string) => boolean;
  consumeCrate: () => boolean;
  claimReward: (item: GameItem) => void;
  buy: (id: string, price: number) => boolean;
  listItem: (id: string, price: number) => boolean;
  burn: (id: string) => void;
  forge: (ids: string[]) => GameItem | null;
  toggleMute: () => void;
  pushToast: (message: string) => void;
  dismissToast: (id: number) => void;
};

const initialEquipped: Partial<Record<Category, string>> = {
  HELMET: "helmet-ronin",
  KATANA: "weapon-ronin-katana",
  ARMOR: "armor-ronin",
  CORE: "core-basic",
  BACK: "back-sheath-pack",
};

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      wallet: null,
      walletProvider: null,
      balance: 50000,
      inventory: demoInventoryIds,
      equippedItems: initialEquipped,
      scrap: 240,
      crateHistory: [],
      crateBalance: 0,
      isStarterClaimed: false,
      starterClaims: {},
      dailyClaimAt: {},
      supplyClaims: {},
      milestoneClaims: {},
      starterReconciled: false,
      marketListings: {},
      achievements: ["FIRST LIGHT", "VOID WALKER", "COLLECTOR XV"],
      muted: false,
      toasts: [],
      pushToast: (message) => {
        const id = Date.now() + Math.random();
        set((state) => ({ toasts: [...state.toasts, { id, message }] }));
        window.setTimeout(() => get().dismissToast(id), 2800);
      },
      dismissToast: (id) => set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
      connectWallet: () => {
        const address = "0x0182…8F3D";
        const firstClaim = !get().starterClaims[address] && !get().starterClaims["0x0182…RONIN"];
        set((state) => ({ wallet: address, walletProvider: "RONIN DEMO WALLET", crateBalance: state.crateBalance + (firstClaim ? 10 : 0), starterClaims: { ...state.starterClaims, [address]: true }, isStarterClaimed: true }));
        get().pushToast(firstClaim ? "STARTER DROP // 10 CRATES" : "WALLET CONNECTED");
      },
      connectExternalWallet: (address, provider) => {
        set({ wallet: address, walletProvider: provider });
        get().grantStarterIfEligible();
        get().pushToast(`${provider.toUpperCase()} CONNECTED`);
      },
      disconnectWallet: () => { set({ wallet: null, walletProvider: null }); get().pushToast("WALLET DISCONNECTED"); },
      grantStarterIfEligible: () => {
        const wallet = get().wallet;
        const state = get();
        if (!state.starterReconciled && state.starterClaims["0x0182…RONIN"] && state.starterClaims["0x0182…8F3D"]) {
          set({ crateBalance: Math.max(0, state.crateBalance - 10), starterReconciled: true });
          return;
        }
        if (!wallet || state.starterClaims[wallet] || state.starterClaims["0x0182…RONIN"]) return;
        set((state) => ({ crateBalance: state.crateBalance + 10, starterClaims: { ...state.starterClaims, [wallet]: true }, isStarterClaimed: true }));
        get().pushToast("STARTER DROP // 10 CRATES");
      },
      equip: (id) => {
        const item = byId(id);
        if (!item || !get().inventory.includes(id)) return;
        set((state) => ({ equippedItems: { ...state.equippedItems, [item.category]: id } }));
        get().pushToast("ITEM EQUIPPED");
      },
      claimFreeCrate: () => {
        if (!get().wallet) {
          get().pushToast("CONNECT WALLET TO CLAIM CRATE");
          return false;
        }
        if (get().isStarterClaimed) return false;
        set((state) => ({ crateBalance: state.crateBalance + 10, isStarterClaimed: true }));
        get().pushToast("STARTER DROP // 10 CRATES");
        return true;
      },
      getCrate: (price) => {
        void price;
        get().pushToast("USE A FREE DROP TO GET CRATES");
        return false;
      },
      claimDailyCrate: () => {
        const wallet = get().wallet;
        if (!wallet) { get().pushToast("CONNECT WALLET TO CLAIM"); return false; }
        const last = get().dailyClaimAt[wallet] ?? 0;
        if (Date.now() - last < 86_400_000) { get().pushToast("DAILY DROP ON COOLDOWN"); return false; }
        set((state) => ({ crateBalance: state.crateBalance + 1, dailyClaimAt: { ...state.dailyClaimAt, [wallet]: Date.now() } }));
        get().pushToast("DAILY CRATE CLAIMED"); return true;
      },
      claimSupplyCrate: () => {
        const wallet = get().wallet;
        if (!wallet) { get().pushToast("CONNECT WALLET TO CLAIM"); return false; }
        if (get().supplyClaims[wallet]) { get().pushToast("SUPPLY DROP CLAIMED"); return false; }
        set((state) => ({ crateBalance: state.crateBalance + 1, supplyClaims: { ...state.supplyClaims, [wallet]: true } }));
        get().pushToast("SUPPLY CRATE CLAIMED"); return true;
      },
      claimMilestoneCrate: (id) => {
        const wallet = get().wallet;
        const key = `${wallet}:${id}`;
        if (!wallet || get().milestoneClaims[key]) return false;
        const unique = new Set(get().inventory).size;
        const eligible = id === "first-open" ? get().crateHistory.length >= 1 : id === "collector" ? unique >= 5 : id === "full-loadout" ? Object.keys(get().equippedItems).length >= 5 : false;
        if (!eligible) { get().pushToast("MILESTONE LOCKED"); return false; }
        set((state) => ({ crateBalance: state.crateBalance + 1, milestoneClaims: { ...state.milestoneClaims, [key]: true } }));
        get().pushToast("MILESTONE CRATE CLAIMED"); return true;
      },
      consumeCrate: () => {
        if (!get().wallet || get().crateBalance <= 0) return false;
        set((state) => ({ crateBalance: Math.max(0, state.crateBalance - 1) }));
        return true;
      },
      claimReward: (item) => {
        set((state) => ({ inventory: [...state.inventory, item.id], crateHistory: [item.id, ...state.crateHistory].slice(0, 20) }));
        get().pushToast("ITEM ACQUIRED");
      },
      buy: (id, price) => {
        if (!get().wallet) {
          get().pushToast("CONNECT WALLET TO BUY");
          return false;
        }
        if (get().balance < price) {
          get().pushToast("INSUFFICIENT $RON");
          return false;
        }
        set((state) => ({ balance: state.balance - price, inventory: [...state.inventory, id] }));
        get().pushToast("PURCHASE COMPLETE");
        return true;
      },
      listItem: (id, price) => {
        if (!get().wallet) {
          get().pushToast("CONNECT WALLET TO LIST");
          return false;
        }
        if (!get().inventory.includes(id) || !Number.isFinite(price) || price <= 0) return false;
        set((state) => ({ marketListings: { ...state.marketListings, [id]: Math.round(price) } }));
        get().pushToast(`ITEM LISTED // ${Math.round(price).toLocaleString()} $RON`);
        return true;
      },
      burn: (id) => {
        const item = byId(id);
        if (!item) return;
        set((state) => ({
          inventory: state.inventory.filter((ownedId, index) => ownedId !== id || index !== state.inventory.indexOf(id)),
          scrap: state.scrap + burnScrap[item.rarity],
        }));
        get().pushToast("ITEM BURNED");
      },
      forge: (ids) => {
        const chosen = ids.map(byId).filter(Boolean) as GameItem[];
        if (chosen.length !== 3 || new Set(chosen.map((item) => item.rarity)).size !== 1) return null;
        const rarityOrder: Rarity[] = ["COMMON", "RARE", "EPIC", "LEGENDARY", "MYTHIC"];
        const from = chosen[0].rarity;
        const next = rarityOrder[rarityOrder.indexOf(from) + 1];
        const cost = forgeCosts[from];
        if (!next || get().balance < cost) return null;
        const result = items.find((item) => item.rarity === next && item.category === chosen[0].category) ?? items.find((item) => item.rarity === next);
        if (!result) return null;
        const remaining = [...get().inventory];
        ids.forEach((id) => remaining.splice(remaining.indexOf(id), 1));
        set((state) => ({ balance: state.balance - cost, inventory: [...remaining, result.id] }));
        get().pushToast("ITEM FORGED");
        return result;
      },
      toggleMute: () => set((state) => ({ muted: !state.muted })),
    }),
    { name: "ronin-x-player-v3", partialize: ({ toasts, ...state }) => state }
  )
);
