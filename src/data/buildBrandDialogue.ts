import type { Brand } from './brandData';
import type { BrandDialogue } from './dialogueData';

/**
 * Construye el guion de Ágata para una sala de marca secuenciando sus 4 fases de análisis técnico.
 */
export function buildBrandDialogue(brand: any): BrandDialogue {
  if (brand.result) {
    return {
      startNodeId: 'contexto',
      nodes: {
        contexto: {
          id: 'contexto',
          speaker: 'agata',
          text: brand.result.contexto,
          nextId: 'conexion'
        },
        conexion: {
          id: 'conexion',
          speaker: 'agata',
          text: brand.result.conexion,
          nextId: 'tactica'
        },
        tactica: {
          id: 'tactica',
          speaker: 'agata',
          text: brand.result.tactica,
          nextId: 'fraseClave'
        },
        fraseClave: {
          id: 'fraseClave',
          speaker: 'agata',
          text: brand.result.fraseClave,
          nextId: 'end',
          onComplete: 'frase-clave-collected'
        },
        end: {
          id: 'end',
          speaker: 'agata',
          text: '¡Estrategia destripada con éxito! Pulsa en "← Pilar" arriba a la derecha cuando termines de revisar el caso.',
          nextId: 'exit'
        }
      }
    };
  }

  return {
    startNodeId: 'intro',
    nodes: {
      intro: {
        id: 'intro',
        speaker: 'agata',
        text: `¡Bienvenida a la historia de ${brand.name}!`,
        nextId: 'end',
      },
      end: {
        id: 'end',
        speaker: 'agata',
        text: '¡Misión cumplida! Volvamos para seguir explorando.',
        nextId: 'exit'
      },
    },
  };
}
