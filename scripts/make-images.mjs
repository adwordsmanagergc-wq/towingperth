#!/usr/bin/env node
// Generates placeholder imagery: hero background, OG cards per page type, favicons
// and a logo PNG for schema. Re-run after changing brand colours or copy:
//   node scripts/make-images.mjs
// TODO: swap the hero for real truck photos when supplied (keep the same file names).
import { mkdir, writeFile, copyFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import sharp from 'sharp';

const INK = '#0f1113';
const HIVIS = '#ffc20e';

// librsvg resolves fonts through fontconfig, so install the brand face locally.
await mkdir(`${homedir()}/.local/share/fonts`, { recursive: true });
for (const w of ['600', '800']) {
  await copyFile(new URL(`./assets/BarlowCondensed-${w}.ttf`, import.meta.url), `${homedir()}/.local/share/fonts/BarlowCondensed-${w}.ttf`);
}

// Night highway seen from the shoulder: vanishing-point road, hi-vis lane marks,
// light trails. Dark enough that white hero text sits on it at AA contrast.
function heroSvg(w, h) {
  const vx = w * 0.68;
  const vy = h * 0.46;
  const dashes = Array.from({ length: 9 }, (_, i) => {
    const t0 = Math.pow(i / 9, 1.8);
    const t1 = Math.pow((i + 0.45) / 9, 1.8);
    const p = (t) => [vx + (w * 0.42 - vx) * t, vy + (h - vy) * t];
    const [x0, y0] = p(t0);
    const [x1, y1] = p(t1);
    const wd = 2 + 26 * t1;
    return `<polygon points="${x0 - wd * 0.15},${y0} ${x0 + wd * 0.15},${y0} ${x1 + wd / 2},${y1} ${x1 - wd / 2},${y1}" fill="${HIVIS}" opacity="${0.35 + 0.5 * t1}"/>`;
  }).join('');
  const trails = [
    [0.05, '#ff3b30', 0.55],
    [0.12, '#ff6a3d', 0.4],
    [0.88, '#fff6d8', 0.45],
    [0.95, '#ffe9a8', 0.35],
  ]
    .map(
      ([f, c, o]) =>
        `<path d="M${vx},${vy} Q ${w * f},${vy + (h - vy) * 0.35} ${w * f},${h + 40}" stroke="${c}" stroke-width="${f < 0.5 ? 10 : 14}" fill="none" opacity="${o}" filter="url(#glow)"/>`,
    )
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#07090c"/><stop offset="0.42" stop-color="#1c2430"/><stop offset="0.47" stop-color="#3a3024"/><stop offset="0.5" stop-color="#14181d"/><stop offset="1" stop-color="#0b0d10"/>
    </linearGradient>
    <radialGradient id="haze" cx="${vx / w}" cy="${vy / h}" r="0.45">
      <stop offset="0" stop-color="${HIVIS}" stop-opacity="0.35"/><stop offset="1" stop-color="${HIVIS}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="road" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1d22"/><stop offset="1" stop-color="#0d0f12"/></linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="9"/></filter>
    <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.05 0"/></filter>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#sky)"/>
  <rect width="${w}" height="${h}" fill="url(#haze)"/>
  <polygon points="${vx - 6},${vy} ${vx + 6},${vy} ${w * 1.25},${h} ${-w * 0.15},${h}" fill="url(#road)"/>
  <path d="M${vx - 6},${vy} L${-w * 0.15},${h}" stroke="#d9dde2" stroke-width="5" opacity="0.35"/>
  <path d="M${vx + 6},${vy} L${w * 1.25},${h}" stroke="#d9dde2" stroke-width="5" opacity="0.35"/>
  ${dashes}
  ${trails}
  <rect width="${w}" height="${h}" filter="url(#grain)"/>
</svg>`;
}

function ogSvg(kicker, line1, line2) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <pattern id="hz" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="20" height="40" fill="${HIVIS}"/></pattern>
  </defs>
  <rect width="1200" height="630" fill="${INK}"/>
  <rect y="0" width="1200" height="18" fill="url(#hz)"/>
  <rect y="612" width="1200" height="18" fill="url(#hz)"/>
  <text x="80" y="150" font-family="Barlow Condensed SemiBold" font-size="38" letter-spacing="7" fill="${HIVIS}">${kicker}</text>
  <text x="80" y="270" font-family="Barlow Condensed ExtraBold" font-size="118" fill="#ffffff">${line1}</text>
  <text x="80" y="385" font-family="Barlow Condensed ExtraBold" font-size="118" fill="${HIVIS}">${line2}</text>
  <rect x="80" y="440" width="560" height="96" rx="10" fill="${HIVIS}"/>
  <text x="112" y="507" font-family="Barlow Condensed ExtraBold" font-size="60" fill="${INK}">CALL 0419 857 070</text>
  <text x="1120" y="507" text-anchor="end" font-family="Barlow Condensed SemiBold" font-size="36" letter-spacing="3" fill="#a7aeb6">QUIK TOW &amp; TRANSPORT</text>
</svg>`;
}

const mark = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
  <defs><pattern id="hz" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="5" height="10" fill="${HIVIS}"/></pattern></defs>
  <rect width="64" height="64" rx="12" fill="${INK}"/>
  <rect x="3" y="3" width="58" height="58" rx="10" fill="url(#hz)"/>
  <rect x="9" y="9" width="46" height="46" rx="7" fill="${INK}"/>
  <text x="32" y="47" text-anchor="middle" font-family="Barlow Condensed ExtraBold" font-size="42" fill="${HIVIS}">Q</text>
</svg>`;

await mkdir('src/assets/images', { recursive: true });
await mkdir('public/og', { recursive: true });

await sharp(Buffer.from(heroSvg(2400, 1350))).jpeg({ quality: 82, mozjpeg: true }).toFile('src/assets/images/hero-placeholder.jpg');

const og = {
  home: ['24/7 TOWING ACROSS PERTH', 'TOW TRUCK PERTH', 'WE BILL YOUR INSURER'],
  service: ['QUIK TOW &amp; TRANSPORT', 'TOWING AND TRANSPORT', 'ANYWHERE IN PERTH, 24/7'],
  area: ['EVERY PERTH SUBURB', 'LOCAL TOW TRUCKS', 'NORTH, SOUTH, EAST, WEST'],
  road: ['PERTH ROAD SAFETY', 'CRASHED OR BROKEN DOWN?', 'WE TOW 24/7'],
  general: ['QUIK TOW &amp; TRANSPORT', '24/7 TOWING PERTH', '10+ TRUCKS ON THE ROAD'],
};
for (const [name, lines] of Object.entries(og)) {
  await sharp(Buffer.from(ogSvg(...lines))).jpeg({ quality: 85, mozjpeg: true }).toFile(`public/og/${name}.jpg`);
}

// TODO: replace with the real logo once supplied.
await writeFile('public/favicon.svg', mark(64));
await sharp(Buffer.from(mark(512))).png().toFile('public/logo.png');
await sharp(Buffer.from(mark(180))).png().toFile('public/apple-touch-icon.png');
await sharp(Buffer.from(mark(32))).png().toFile('public/favicon-32.png');
console.log('Images written.');
