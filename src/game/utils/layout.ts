import Phaser from 'phaser';
import { AGATA_FRAME_HEIGHT } from '../config/agataAssets';

export interface SafeZones {
  hudTop: number;
  agataLaneWidth: number;
  playArea: Phaser.Geom.Rectangle;
  isMobile: boolean;
  isCoarsePointer: boolean;
}

const PLAY_MARGIN = 12;

export function getSafeZones(scale: Phaser.Scale.ScaleManager): SafeZones {
  const w = scale.width;
  const h = scale.height;
  const isMobile = w <= 480;
  const isCoarsePointer =
    typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

  const hudTop = 0;

  if (isMobile) {
    // En móvil: Ágata es pequeña y va abajo-izquierda (esquina).
    // Los portales ocupan TODA la pantalla centrados — Ágata flota encima sin bloquear.
    const agataLaneWidth = Math.round(w * 0.28);
    const playArea = new Phaser.Geom.Rectangle(
      PLAY_MARGIN,
      PLAY_MARGIN,
      w - PLAY_MARGIN * 2,
      h - PLAY_MARGIN * 2,
    );
    return { hudTop, agataLaneWidth, playArea, isMobile, isCoarsePointer };
  }

  // Escritorio: sin cambios
  const agataLaneWidth = Math.round(w * 0.28);
  const playArea = new Phaser.Geom.Rectangle(
    agataLaneWidth + PLAY_MARGIN,
    PLAY_MARGIN,
    w - agataLaneWidth - PLAY_MARGIN * 2,
    h - PLAY_MARGIN * 2,
  );
  return { hudTop, agataLaneWidth, playArea, isMobile, isCoarsePointer };
}

export function getPillarStationPositions(
  playArea: Phaser.Geom.Rectangle,
  count: number,
): Array<{ x: number; y: number }> {
  if (count <= 0) return [];
  const out: Array<{ x: number; y: number }> = [];
  for (let i = 0; i < count; i++) {
    out.push({
      x: playArea.x + playArea.width * 0.5,
      y: playArea.y + playArea.height * (0.3 + (i / Math.max(count - 1, 1)) * 0.45),
    });
  }
  return out;
}

export function getAgataNpcPosition(
  scale: Phaser.Scale.ScaleManager,
  zones: SafeZones,
): { x: number; y: number; scale: number; bubbleMaxWidth: number } {
  const w = scale.width;
  const h = scale.height;

  if (zones.isMobile) {
    // Móvil: Ágata pequeña, esquina inferior izquierda, NO bloquea portales
    const targetHeight = Math.min(h * 0.22, 160);
    const spriteScale = targetHeight / AGATA_FRAME_HEIGHT;
    return {
      x: w * 0.14,
      y: h - 8,
      scale: spriteScale,
      bubbleMaxWidth: w * 0.70,
    };
  }

  // Escritorio: sin cambios
  const targetHeight = Math.min(h * 0.42, 340);
  const spriteScale = targetHeight / AGATA_FRAME_HEIGHT;
  return {
    x: zones.agataLaneWidth * 0.52,
    y: h - 40,
    scale: spriteScale,
    bubbleMaxWidth: 340,
  };
}

export function getHubPortalPositions(
  playArea: Phaser.Geom.Rectangle,
  isMobile = false,
): Array<{ x: number; y: number }> {
  if (isMobile) {
    // Móvil: cuadrícula 2×2 perfectamente centrada en toda la pantalla
    // Con suficiente separación vertical para que labels no se soapen
    const cx = playArea.x + playArea.width * 0.5;
    const cy = playArea.y + playArea.height * 0.5;
    const spacingX = playArea.width * 0.30;   // separación horizontal
    const spacingY = playArea.height * 0.28;  // separación vertical generosa

    return [
      { x: cx - spacingX, y: cy - spacingY }, // top-left
      { x: cx + spacingX, y: cy - spacingY }, // top-right
      { x: cx - spacingX, y: cy + spacingY }, // bottom-left
      { x: cx + spacingX, y: cy + spacingY }, // bottom-right
    ];
  }

  // Escritorio: sin cambios
  const cols = [0.25, 0.75];
  const rows = [0.28, 0.72];
  const out: Array<{ x: number; y: number }> = [];
  for (const row of rows) {
    for (const col of cols) {
      out.push({
        x: playArea.x + playArea.width * col,
        y: playArea.y + playArea.height * row,
      });
    }
  }
  return out;
}
