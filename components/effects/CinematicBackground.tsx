import { ParticleField } from "./ParticleField";

export function CinematicBackground({ mode = "home" }: { mode?: "home" | "industrial" | "forge" | "market" | "minimal" | "mythic" }) {
  return <div className={`cinematic-bg bg-${mode}`} aria-hidden="true"><div className="bg-image"/><div className="bg-grid"/><div className="bg-fog one"/><div className="bg-fog two"/><div className="bg-noise"/><ParticleField tone={mode === "mythic" ? "crimson" : "orange"}/></div>;
}
