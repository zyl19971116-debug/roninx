"use client";

import { useEffect } from "react";
import { officialAssetPaths } from "@/data/roninAssets";

export function AssetValidator() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    officialAssetPaths.forEach(async (path) => {
      try {
        const response = await fetch(path, { method: "HEAD" });
        if (!response.ok) console.error(`Missing RONIN X asset: ${path}`);
      } catch {
        console.error(`Missing RONIN X asset: ${path}`);
      }
    });
  }, []);
  return null;
}
