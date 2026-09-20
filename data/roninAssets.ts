export const roninAssets = {
  character: { main: "/assets/ronin/character/ronin-character-final.png" },
  crate: {
    closed: "/assets/ronin/crate/ronin-crate.png",
    open: "/assets/ronin/crate/ronin-crate-open.png",
  },
  weapons: {
    neonKatana: "/assets/ronin/weapons/weapon-neon-katana.png",
    shadowKatana: "/assets/ronin/weapons/weapon-shadow-katana.png",
    voidBlade: "/assets/ronin/weapons/weapon-void-blade.png",
    solarKatana: "/assets/ronin/weapons/weapon-solar-katana.png",
    ashBlade: "/assets/ronin/weapons/weapon-ash-blade.png",
    roninKatana: "/assets/ronin/weapons/weapon-ronin-katana.png",
  },
  helmets: {
    shadowMask: "/assets/ronin/helmets/helmet-shadow-mask.png",
    oni: "/assets/ronin/helmets/helmet-oni.png",
    void: "/assets/ronin/helmets/helmet-void.png",
    tactical: "/assets/ronin/helmets/helmet-tactical.png",
    ronin: "/assets/ronin/helmets/helmet-ronin.png",
  },
  armors: {
    shadow: "/assets/ronin/armors/armor-shadow.png",
    oni: "/assets/ronin/armors/armor-oni.png",
    tactical: "/assets/ronin/armors/armor-tactical.png",
    nomad: "/assets/ronin/armors/armor-nomad.png",
    ronin: "/assets/ronin/armors/armor-ronin.png",
  },
  cores: {
    solar: "/assets/ronin/cores/core-solar.png",
    void: "/assets/ronin/cores/core-void.png",
    cyber: "/assets/ronin/cores/core-cyber.png",
    fusion: "/assets/ronin/cores/core-fusion.png",
    basic: "/assets/ronin/cores/core-basic.png",
  },
  backItems: {
    roninPack: "/assets/ronin/back-items/back-ronin-pack.png",
    voidWings: "/assets/ronin/back-items/back-void-wings.png",
    tacticalPack: "/assets/ronin/back-items/back-tactical-pack.png",
    energyTank: "/assets/ronin/back-items/back-energy-tank.png",
    sheathPack: "/assets/ronin/back-items/back-sheath-pack.png",
  },
} as const;

export const officialAssetPaths = Object.values(roninAssets).flatMap((group) => Object.values(group));
