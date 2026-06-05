/**
 * Genera spritesheet de Ágata con variación visible desde una sola ilustración.
 * Frame 0-1: idle (offset/escala), 2: talk (boca), 3: point (recorte + gesto),
 * 4: emphasis/wink (inclinación + ojo).
 */
import sharp from 'sharp';
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const srcPath = join(root, 'agata.jpeg');
const outDir = join(root, 'public', 'assets', 'characters');
const configPath = join(root, 'src', 'game', 'config', 'agataAssets.ts');

mkdirSync(outDir, { recursive: true });

const CROP = { left: 120, top: 80, width: 520, height: 720 };

const basePng = await sharp(srcPath).extract(CROP).png().toBuffer();
const trimmed = await sharp(basePng).trim().toBuffer();
const meta = await sharp(trimmed).metadata();
const fw = meta.width;
const fh = meta.height;

const mouthSvg = `
<svg width="56" height="32" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="28" cy="18" rx="22" ry="12" fill="#c45c7a"/>
  <ellipse cx="28" cy="14" rx="18" ry="6" fill="#ffe8ef"/>
</svg>`;
await sharp(Buffer.from(mouthSvg)).png().toFile(join(outDir, 'agata-mouth.png'));

const pointHandSvg = `
<svg width="72" height="72" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 48 L36 8 L48 20 L32 52 Z" fill="#f6d4b8" stroke="#c9a07a" stroke-width="2"/>
  <circle cx="40" cy="14" r="6" fill="#f6d4b8" stroke="#c9a07a" stroke-width="2"/>
</svg>`;

const winkSvg = `
<svg width="48" height="12" xmlns="http://www.w3.org/2000/svg">
  <path d="M4 8 Q24 0 44 8" stroke="#3d2a4a" stroke-width="3" fill="none" stroke-linecap="round"/>
</svg>`;

async function withTalkMouth(buf) {
  const mouthBuf = await sharp(Buffer.from(mouthSvg)).resize(48, 28).png().toBuffer();
  return sharp(buf)
    .composite([{ input: mouthBuf, left: Math.round(fw * 0.38), top: Math.round(fh * 0.22) }])
    .png()
    .toBuffer();
}

async function withPointGesture(buf) {
  const hand = await sharp(Buffer.from(pointHandSvg)).resize(56, 56).png().toBuffer();
  return sharp(buf)
    .composite([{ input: hand, left: Math.round(fw * 0.55), top: Math.round(fh * 0.4) }])
    .png()
    .toBuffer();
}

async function withWink(buf) {
  const eye = await sharp(Buffer.from(winkSvg)).resize(40, 10).png().toBuffer();
  return sharp(buf)
    .composite([{ input: eye, left: Math.round(fw * 0.42), top: Math.round(fh * 0.14) }])
    .png()
    .toBuffer();
}

async function frameTransform(buf, { dy = 0, scale = 1, rotate = 0 }) {
  let pipeline = sharp(buf);
  if (scale !== 1) {
    pipeline = sharp(
      await pipeline
        .resize(Math.round(fw * scale), Math.round(fh * scale), { fit: 'inside' })
        .png()
        .toBuffer(),
    );
  }
  if (rotate) {
    pipeline = sharp(
      await pipeline.rotate(rotate, { background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer(),
    );
  }
  const position = dy < 0 ? 'north' : dy > 0 ? 'south' : 'centre';
  return pipeline
    .resize(fw, fh, {
      fit: 'contain',
      position,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
}

const frames = await Promise.all([
  trimmed,
  frameTransform(trimmed, { dy: -8, scale: 1.025 }),
  withTalkMouth(trimmed),
  withPointGesture(trimmed),
  withWink(await frameTransform(trimmed, { dy: -4, scale: 1.02, rotate: 1.5 })),
]);

const sheetWidth = fw * frames.length;
await sharp({
  create: {
    width: sheetWidth,
    height: fh,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
})
  .composite(frames.map((buf, i) => ({ input: buf, left: i * fw, top: 0 })))
  .png()
  .toFile(join(outDir, 'agata-sheet.png'));

writeFileSync(
  configPath,
  `/** Auto-generado por npm run build:agata — no editar a mano. */\n` +
    `export const AGATA_FRAME_WIDTH = ${fw};\n` +
    `export const AGATA_FRAME_HEIGHT = ${fh};\n`,
);

writeFileSync(
  join(outDir, 'agata-atlas.json'),
  JSON.stringify(
    {
      frameWidth: fw,
      frameHeight: fh,
      frames: ['idle_0', 'idle_1', 'talk', 'point', 'emphasis'],
    },
    null,
    2,
  ),
);

console.log(`OK agata-sheet ${sheetWidth}x${fh} (${fw}px/frame)`);