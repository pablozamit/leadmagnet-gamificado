export interface DialogueOption {
  text: string;
  nextId: string;
}

export interface DialogueNode {
  id: string;
  speaker: 'agata' | 'player';
  text: string;
  options?: DialogueOption[];
  nextId?: string;
  onComplete?: string; // Event to emit when this node ends
}

export interface BrandDialogue {
  startNodeId: string;
  nodes: Record<string, DialogueNode>;
}

export const hubIntroDialogue: BrandDialogue = {
  startNodeId: 'welcome',
  nodes: {
    welcome: {
      id: 'welcome',
      speaker: 'agata',
      text: '¡Hola! Soy Ágata. Bienvenida al Museo de la Dinamización Digital.',
      nextId: 'intro_2',
    },
    intro_2: {
      id: 'intro_2',
      speaker: 'agata',
      text: 'Aquí descubrirás cómo las grandes marcas conectan con sus clientes de forma humana y dinámica.',
      nextId: 'intro_3',
    },
    intro_3: {
      id: 'intro_3',
      speaker: 'agata',
      text: 'Explora los 4 pilares de la experiencia digital. Acércate a cualquier portal para comenzar.',
      nextId: 'end',
    },
    end: {
      id: 'end',
      speaker: 'agata',
      text: '¿Lista para empezar?',
      options: [
        { text: '¡Vamos!', nextId: '' } // Empty nextId or special flag to close
      ],
    }
  }
};

export const brandDialogues: Record<string, BrandDialogue> = {
  ikea: {
    startNodeId: 'start',
    nodes: {
      start: {
        id: 'start',
        speaker: 'agata',
        text: 'Bienvenida a la sala de IKEA. ¿Sabías que no solo venden muebles?',
        nextId: 'question',
      },
      question: {
        id: 'question',
        speaker: 'agata',
        text: '¿Qué crees que es lo más importante en su estrategia de gamificación?',
        options: [
          { text: 'Los puntos de descuento', nextId: 'wrong_choice' },
          { text: 'La sensación de logro del cliente', nextId: 'right_choice' },
        ],
      },
      wrong_choice: {
        id: 'wrong_choice',
        speaker: 'agata',
        text: 'No exactamente. Los descuentos ayudan, pero IKEA va más allá.',
        nextId: 'explanation',
      },
      right_choice: {
        id: 'right_choice',
        speaker: 'agata',
        text: '¡Exacto! Hacen que el cliente se sienta el héroe de su propia historia.',
        nextId: 'explanation',
      },
      explanation: {
        id: 'explanation',
        speaker: 'agata',
        text: 'Al montar tus propios muebles o usar su app de realidad aumentada, estás participando activamente en la creación.',
        nextId: 'final',
      },
      final: {
        id: 'final',
        speaker: 'agata',
        text: 'Eso genera una conexión emocional imbatible. ¿Quieres ver otra marca?',
        options: [
          { text: 'Volver al pilar', nextId: 'exit' }
        ],
      }
    }
  },
  starbucks: {
    startNodeId: 'start',
    nodes: {
      start: {
        id: 'start',
        speaker: 'agata',
        text: 'Starbucks es el maestro de los niveles y el estatus.',
        nextId: 'final',
      },
      final: {
        id: 'final',
        speaker: 'agata',
        text: 'Su sistema de estrellas hace que cada café sea un paso hacia un nivel superior.',
        options: [
          { text: 'Interesante', nextId: 'exit' }
        ],
      }
    }
  },
  axa: {
    startNodeId: 'start',
    nodes: {
      start: {
        id: 'start',
        speaker: 'agata',
        text: '¿Quién dijo que los seguros son aburridos? AXA usa la gamificación para salvar vidas.',
        nextId: 'final',
      },
      final: {
        id: 'final',
        speaker: 'agata',
        text: 'Premiar la conducción segura convierte la responsabilidad en un desafío gratificante.',
        options: [
          { text: '¡Increíble!', nextId: 'exit' }
        ],
      }
    }
  },
  duolingo: {
    startNodeId: 'start',
    nodes: {
      start: {
        id: 'start',
        speaker: 'agata',
        text: 'Duolingo es el compañero que nunca te deja solo... ¡incluso si te sientes un poco culpable!',
        nextId: 'final',
      },
      final: {
        id: 'final',
        speaker: 'agata',
        text: 'Su sistema de rachas es el mejor ejemplo de acompañamiento constante.',
        options: [
          { text: 'Volver', nextId: 'exit' }
        ],
      }
    }
  },
  spotify: {
    startNodeId: 'start',
    nodes: {
      start: {
        id: 'start',
        speaker: 'agata',
        text: '¡Spotify Wrapped es la fiesta del año para tus oídos!',
        nextId: 'final',
      },
      final: {
        id: 'final',
        speaker: 'agata',
        text: 'Nada celebra mejor a un cliente que contarle su propia historia con música.',
        options: [
          { text: '¡Me encanta!', nextId: 'exit' }
        ],
      }
    }
  },
  amazon: {
    startNodeId: 'start',
    nodes: {
      start: {
        id: 'start',
        speaker: 'agata',
        text: 'Amazon Prime es la definición de quitarle piedras al camino del cliente.',
        nextId: 'final',
      },
      final: {
        id: 'final',
        speaker: 'agata',
        text: 'La fidelización es invisible cuando la experiencia es perfecta.',
        options: [
          { text: 'Entiendo', nextId: 'exit' }
        ],
      }
    }
  }
};
