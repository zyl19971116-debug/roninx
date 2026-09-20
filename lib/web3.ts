import type { GameItem } from "@/data/items";
import type { Rarity } from "@/data/rarity";

export interface BlockchainService {
  openCrate(rarity: Rarity): Promise<GameItem>;
  mintItem(item: GameItem): Promise<string>;
  equipItem(itemId: string): Promise<void>;
  forgeItems(itemIds: string[]): Promise<GameItem>;
  burnItem(itemId: string): Promise<void>;
  listItem(itemId: string, price: number): Promise<void>;
  buyItem(itemId: string): Promise<void>;
  transferItem(itemId: string, to: `0x${string}`): Promise<void>;
}

export const gameMode = process.env.NEXT_PUBLIC_GAME_MODE ?? "mock";

export const unavailableWeb3 = (): never => {
  throw new Error("Web3 mode requires a deployed contract adapter. No confirmation was faked.");
};
