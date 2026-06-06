import Phaser from 'phaser';
import { AGATA_FRAME_HEIGHT } from '../config/agataAssets';

export interface SafeZones {
  hudTop: number;
  agataLaneWidth: number;
  playArea: Phaser.Geom.Rectangle;
  isMobile: boolean;
  isCoarsePointer: boolean;
}

/** Margen interno del canvas (HUD va fuera del canvas en flex). */
const PLAY_MARGIN = 12;

export function getSafeZones(scale: Phaser.Scale.ScaleManager): SafeZones {
  const w = scale.width;
  const h = scale.height;
  const isMobile = w <= 480;
  const isCoarsePointer =
    typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

  const hudTop = 0;

  // Ágata ocupa la izquierda en ambos casos
  const agataLaneWidth = Math.round(w * (isMobile ? 0.32 : 0.28));

  // ✅ CORRECCIÓN: en móvil playArea también empieza después de Ágata
  // (antes era 0 en móvil, lo que hacía que los portales se solaparan con ella)
  const playArea = new Phaser.Geom.Rectangle(
    agataLaneWidth + PLAY_MARGIN,
    PLAY_MARGIN,
    w - agataLaneWidth - PLAY_MARGIN * 2,
    h - PLAY_MARGIN * 2,
  );

  return { hudTop, agataLaneWidth, playArea, isMobile, isCoarsePointer };
}

/** Posiciones de estaciones de marca en un pilar (zona derecha). */
export function getPillarStationPositions(
  playArea: Phaser.Geom.Rectangle,
  count: number,
): Array<{ x: number; y: number }> {
  if (count <= 0) return [];
  const rows = count;
  const out: Array<{ x: number; y: number }> = [];
  for (let i = 0; i < count; i++) {
    out.push({
      x: playArea.x + playArea.width * 0.5,
      y: playArea.y + playArea.height * (0.3 + (i / Math.max(rows - 1, 1)) * 0.45),
    });
  }
  return out;
}

/**
 * NPC Ágata: columna izquierda del área de juego, tamaño legible en móvil.
 */
export function getAgataNpcPosition(
  scale: Phaser.Scale.ScaleManager,
  zones: SafeZones,
): { x: number; y: number; scale: number; bubbleMaxWidth: number } {
  const targetHeight = zones.isMobile
    ? Math.min(scale.height * 0.38, 260)
    : Math.min(scale.height * 0.42, 340);
  const spriteScale = targetHeight / AGATA_FRAME_HEIGHT;

  // Centrada en su carril izquierdo, apoyada en el fondo
  const x = zones.agataLaneWidth * 0.50;
  const y = scale.height - (zones.isMobile ? 16 : 40);

  return {
    x,
    y,
    scale: spriteScale,
    // La burbuja de diálogo se expande hacia la derecha desde Ágata
    bubbleMaxWidth: zones.isMobile ? scale.width * 0.72 : 340,
  };
}

/** Portales en la zona derecha del hub (sin pisar a Ágata). */
export function getHubPortalPositions(
  playArea: Phaser.Geom.Rectangle,
): Array<{ x: number; y: number }> {
  // Cuadrícula 2×2 dentro del área disponible (ya excluye a Ágata)
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
