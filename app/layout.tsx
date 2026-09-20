import type { Metadata } from "next";
import "./globals.css";
import { GameShell } from "@/components/ui/GameShell";
import { Toasts } from "@/components/ui/Toasts";
import { BootScreen } from "@/components/ui/BootScreen";
import { AssetValidator } from "@/components/effects/AssetValidator";

export const metadata: Metadata = { title: "RONIN X", description: "Open. Collect. Equip. Trade." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><head><link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/><link rel="preload" as="image" href="/assets/ronin/character/ronin-main.png"/><link rel="preload" as="image" href="/assets/ronin/crate/ronin-crate.png"/><link rel="preload" as="image" href="/assets/ronin/crate/ronin-crate-open.png"/><link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet"/><link href="https://db.onlinewebfonts.com/c/b1314443e183d1cdd77049077c46facc?family=Orbitron-Medium" rel="stylesheet"/></head><body><GameShell>{children}</GameShell><Toasts/><BootScreen/><AssetValidator/></body></html>;
}
