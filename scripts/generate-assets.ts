import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

async function generate() {
const out = join(process.cwd(), "public", "assets", "generated");
await mkdir(out, { recursive: true });

const colors = ["#b8bec7", "#3d8cff", "#a25cff", "#ff8a1f", "#f12f45"];
const labels = ["common", "rare", "epic", "legendary", "mythic"];

for (let index = 0; index < colors.length; index++) {
  const color = colors[index];
  const label = labels[index];
  const crate = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 280"><defs><linearGradient id="m" x2="1" y2="1"><stop stop-color="#3b3f42"/><stop offset=".5" stop-color="#101214"/><stop offset="1" stop-color="#25282b"/></linearGradient></defs><path d="M43 65 75 35h210l32 30 19 158-37 26H61l-37-26Z" fill="url(#m)" stroke="#5b6064" stroke-width="4"/><path d="M82 78h196l12 122H70Z" fill="#090a0b" stroke="${color}" stroke-width="4"/><path d="m180 105 38 22v43l-38 22-38-22v-43Z" fill="#151719" stroke="${color}" stroke-width="5"/><circle cx="180" cy="148" r="16" fill="${color}"/><path d="M30 103h300M53 217h254" stroke="${color}" stroke-width="3" opacity=".55"/></svg>`;
  await writeFile(join(out, `crate-${label}.svg`), crate);
  const badge = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="m50 4 40 23v46L50 96 10 73V27Z" fill="#101214" stroke="${color}" stroke-width="4"/><circle cx="50" cy="50" r="22" fill="none" stroke="${color}" stroke-width="3" stroke-dasharray="6 5"/><path d="M50 29 67 39v22L50 71 33 61V39Z" fill="${color}" opacity=".6"/></svg>`;
  await writeFile(join(out, `badge-${label}.svg`), badge);
}

for (let i = 0; i < 12; i++) {
  const color = colors[i % colors.length];
  const symbol = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="#0a0b0c"/><circle cx="100" cy="100" r="72" fill="none" stroke="${color}" opacity=".2" stroke-dasharray="4 9"/><path d="M100 24 154 56v88l-54 32-54-32V56Z" fill="#151719" stroke="${color}" stroke-width="4"/><path d="m64 ${70 + i} 36-18 36 18-10 55-26 22-26-22Z" fill="#050607" stroke="${color}" stroke-width="3"/><path d="M74 90h52" stroke="${color}" stroke-width="7"/></svg>`;
  await writeFile(join(out, `equipment-${String(i + 1).padStart(2, "0")}.svg`), symbol);
}

const motif = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600"><rect width="1200" height="600" fill="#08090a"/><g fill="none" stroke="#ff6a00" opacity=".18"><circle cx="850" cy="300" r="220"/><circle cx="850" cy="300" r="180" stroke-dasharray="8 18"/><path d="M0 480h1200M120 0v600M1080 0v600"/></g></svg>`;
await writeFile(join(out, "industrial-motif.svg"), motif);

console.log(`Generated ${colors.length * 2 + 13} assets in ${out}`);
}

generate().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
