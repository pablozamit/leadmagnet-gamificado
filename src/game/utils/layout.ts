import Phaser from 'phaser';
import { AGATA_FRAME_HEIGHT } from '../config/agataAssets';

export interface SafeZones {
  hudTop: number;
  agataLaneWidth: number;
  playArea: Phaser.Geom.Rectangle;
  isMobile: boolean;
  isCoarsePointer: boolean;
}

const PLAY_MARGIN = 10;

export function getSafeZones(scale: Phaser.Scale.ScaleManager): SafeZones {
  const w = scale.width;
  const h = scale.height;
  const isMobile = w <= 480;
  const isCoarsePointer =
    typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

  const hudTop = 0;

  if (isMobile) {
    // Móvil: Ágata flota abajo-izquierda, portales usan toda la pantalla
    const agataLaneWidth = Math.round(w * 0.26);
    const playArea = new Phaser.Geom.Rectangle(
      PLAY_MARGIN,
      PLAY_MARGIN,
      w - PLAY_MARGIN * 2,
      h - PLAY_MARGIN * 2,
    );
    return { hudTop, agataLaneWidth, playArea, isMobile, isCoarsePointer };
  }

  // Escritorio: Ágata ocupa carril izquierdo
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
  isMobile = false,
): Array<{ x: number; y: number }> {
  if (count <= 0) return [];
  const out: Array<{ x: number; y: number }> = [];

  if (isMobile) {
    // En móvil: marcas centradas verticalmente con bastante espacio
    const startY = playArea.y + playArea.height * 0.28;
    const endY   = playArea.y + playArea.height * 0.72;
    const step   = count > 1 ? (endY - startY) / (count - 1) : 0;
    for (let i = 0; i < count; i++) {
      out.push({
        x: playArea.x + playArea.width * 0.5,
        y: startY + step * i,
      });
    }
  } else {
    for (let i = 0; i < count; i++) {
      out.push({
        x: playArea.x + playArea.width * 0.5,
        y: playArea.y + playArea.height * (0.3 + (i / Math.max(count - 1, 1)) * 0.45),
      });
    }
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
    // Móvil: Ágata pequeña, esquina inferior izquierda
    const targetHeight = Math.min(h * 0.20, 150);
    const spriteScale = targetHeight / AGATA_FRAME_HEIGHT;
    return {
      x: w * 0.13,
      y: h - 4,
      scale: spriteScale,
      bubbleMaxWidth: w * 0.88,
    };
  }

  // Escritorio
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
    // Móvil: cuadrícula 2×2 centrada, con espacio para burbuja arriba y Ágata abajo
    // La burbuja ocupa ~140px arriba, Ágata ocupa ~150px abajo
    // Dejamos margen: portales entre 20% y 80% del alto
    const cx = playArea.x + playArea.width * 0.5;
    const top    = playArea.y + playArea.height * 0.22;
    const bottom = playArea.y + playArea.height * 0.76;
    const midY   = (top + bottom) / 2;
    const halfY  = (bottom - top) * 0.28;
    const halfX  = playArea.width * 0.27;

    return [
      { x: cx - halfX, y: midY - halfY }, // top-left
      { x: cx + halfX, y: midY - halfY }, // top-right
      { x: cx - halfX, y: midY + halfY }, // bottom-left
      { x: cx + halfX, y: midY + halfY }, // bottom-right
    ];
  }

  // Escritorio
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
