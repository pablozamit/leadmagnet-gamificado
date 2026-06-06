import type { Brand } from './brandData';
import type { BrandDialogue } from './dialogueData';

/**
 * Construye el guion de Ágata para una sala de marca a partir de la nueva descripción.
 */
export function buildBrandDialogue(brand: Brand): BrandDialogue {
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
        text: '¡Misión cumplida! Volvamos al museo para seguir explorando.',
        nextId: 'exit'
      },
    },
  };
}
