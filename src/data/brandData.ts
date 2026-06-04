export interface BrandResult {
  contexto: string;
  conexion: string;
  tactica: string;
  fraseClave: string;
}

export interface Brand {
  id: string;
  name: string;
  result: BrandResult;
}

export interface PillarData {
  id: string;
  name: string;
  color: number;
  glowColor: number;
  brands: Brand[];
}

export const pillars: PillarData[] = [
  {
    id: 'gamification',
    name: 'GAMIFICACIÓN',
    color: 0x3a7bd5,
    glowColor: 0x6ec6ff,
    brands: [
      {
        id: 'ikea',
        name: 'IKEA',
        result: {
          contexto: 'IKEA transformó la experiencia de compra de muebles en un recorrido interactivo donde cada paso desbloquea una recompensa emocional.',
          conexion: 'Conecta con el deseo humano de sentirse competente y reconocido.',
          tactica: 'Su app IKEA Place usa realidad aumentada para que los usuarios "ganen" la visualización perfecta de su espacio.',
          fraseClave: '"No vendes muebles, vendes la sensación de haber creado algo tuyo".',
        },
      },
      {
        id: 'starbucks',
        name: 'Starbucks',
        result: {
          contexto: 'Starbucks convierte cada compra en puntos que desbloquean niveles, como en un videojuego.',
          conexion: 'Toca la necesidad psicológica de progreso visible.',
          tactica: 'Sistema de estrellas con niveles que crean urgencia por mantener el estatus.',
          fraseClave: '"La gamificación bien hecha no se siente como un juego, se siente como un privilegio".',
        },
      },
      {
        id: 'axa',
        name: 'AXA',
        result: {
          contexto: 'AXA revolucionó los seguros convirtiendo la prevención en un juego de hábitos saludables.',
          conexion: 'Demuestra que la gamificación funciona incluso en industrias "imposibles".',
          tactica: 'Programa "AXA Drive" donde los conductores seguros acumulan puntos y reducen su prima.',
          fraseClave: '"Cuando gamificas lo aburrido, conviertes obligación en motivación".',
        },
      },
    ],
  },
  {
    id: 'acompanamiento',
    name: 'ACOMPAÑAMIENTO',
    color: 0x4caf50,
    glowColor: 0x80e27e,
    brands: [
      {
        id: 'duolingo',
        name: 'Duolingo',
        result: {
          contexto: 'Duolingo convirtió el aprendizaje de idiomas en una experiencia donde nunca estás solo.',
          conexion: 'El acompañamiento no es vigilar al usuario, es caminar a su lado.',
          tactica: 'Sistema de rachas que genera compromiso emocional y notificaciones personalizadas.',
          fraseClave: '"El mejor acompañamiento hace que tu cliente sienta que abandonarte sería abandonar a un amigo".',
        },
      },
      {
        id: 'peloton',
        name: 'Peloton',
        result: {
          contexto: 'Peloton vende la sensación de tener un entrenador personal y una comunidad que te espera.',
          conexion: 'El acompañamiento premium crea dependencia positiva.',
          tactica: 'Clases en vivo con métricas en tiempo real y leaderboards que crean competencia sana.',
          fraseClave: '"Acompañar no es dar información, es dar pertenencia".',
        },
      },
      {
        id: 'nike',
        name: 'Nike',
        result: {
          contexto: 'Nike acompaña a millones de personas comunes a correr su primera carrera guiándoles paso a paso.',
          conexion: 'El acompañamiento más poderoso es el que transforma la identidad.',
          tactica: 'Nike Run Club ofrece planes personalizados y audio coaching gratuito.',
          fraseClave: '"Cuando acompañas la transformación, tu producto deja de ser un gasto y se convierte en inversión".',
        },
      },
    ],
  },
  {
    id: 'celebracion',
    name: 'CELEBRACIÓN',
    color: 0xf6a000,
    glowColor: 0xffd54f,
    brands: [
      {
        id: 'spotify',
        name: 'Spotify',
        result: {
          contexto: 'Spotify convirtió datos de escucha en el evento cultural del año con su Wrapped.',
          conexion: 'La celebración más poderosa es la que refleja quién es tu cliente.',
          tactica: 'Wrapped combina storytelling visual, datos personalizados y compartibilidad social.',
          fraseClave: '"La mejor celebración no es premiar al cliente, es devolverle su propia historia".',
        },
      },
      {
        id: 'mastercard',
        name: 'Mastercard',
        result: {
          contexto: 'Mastercard transformó transacciones en momentos de celebración con su plataforma "Priceless".',
          conexion: 'Dice "mereces algo que el dinero no puede comprar".',
          tactica: 'Experiencias que recompensan a los clientes con acceso exclusivo a eventos únicos.',
          fraseClave: '"Cuando celebras a tu cliente con algo invaluable, tu marca se vuelve invaluable".',
        },
      },
      {
        id: 'apple',
        name: 'Apple',
        result: {
          contexto: 'Apple celebra la creatividad de sus usuarios con campañas como "Shot on iPhone".',
          conexion: 'Convierte al cliente en el artista y a la marca en el escenario.',
          tactica: 'Uso de contenido generado por el usuario en vallas publicitarias mundiales.',
          fraseClave: '"Celebrar el talento de tu cliente es la forma más alta de fidelidad".',
        },
      },
    ],
  },
  {
    id: 'fidelizacion',
    name: 'FIDELIZACIÓN',
    color: 0xe91e63,
    glowColor: 0xff6090,
    brands: [
      {
        id: 'amazon',
        name: 'Amazon Prime',
        result: {
          contexto: 'Amazon Prime creó un ecosistema de conveniencia que hace casi imposible querer salir.',
          conexion: 'Elimina cualquier fricción en la relación con el cliente.',
          tactica: 'Suscripción que unifica envíos, streaming y ofertas exclusivas.',
          fraseClave: '"La fidelización real ocurre cuando eres la opción más fácil y valiosa".',
        },
      },
      {
        id: 'sephora',
        name: 'Sephora',
        result: {
          contexto: 'Beauty Insider de Sephora es el estándar de oro en programas de lealtad por niveles.',
          conexion: 'Hace que el cliente se sienta parte de un club exclusivo.',
          tactica: 'Regalos personalizados y acceso anticipado basados en el gasto anual.',
          fraseClave: '"Fidelizar es conocer los gustos de tu cliente antes que ellos mismos".',
        },
      },
      {
        id: 'lego',
        name: 'LEGO',
        result: {
          contexto: 'LEGO Insiders fomenta una comunidad global de creadores que comparten su pasión.',
          conexion: 'Crea un vínculo emocional que trasciende generaciones.',
          tactica: 'Plataforma donde los fans proponen diseños que pueden llegar a producirse.',
          fraseClave: '"Una marca amada es una marca compartida".',
        },
      },
    ],
  },
];
