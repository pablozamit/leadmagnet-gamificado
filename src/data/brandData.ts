export interface Brand {
  id: string;
  name: string;
  descripcion: string;
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
        descripcion: 'El modelo de negocio de IKEA dio origen al "Efecto IKEA", el sesgo psicológico que demuestra que valoramos exponencialmente más aquello en lo que invertimos nuestro propio esfuerzo. Su estrategia de gamificación consiste en trasladar este comportamiento analógico al entorno digital. A través de su aplicación y planificadores 3D, transformaron la tediosa tarea de medir y amueblar en un juego interactivo y colaborativo. Al diseñar digitalmente sus espacios, los usuarios acumulan puntos canjeables por descuentos reales. Esta mecánica convierte la fricción del proceso de compra en un activo lúdico y adictivo. No venden muebles; venden la pura sensación de logro de haber creado algo tuyo.'
      },
      {
        id: 'starbucks',
        name: 'Starbucks',
        descripcion: 'La estrategia de gamificación de Starbucks consiste en digitalizar el consumo diario mediante misiones y retos interactivos en su aplicación móvil. En lugar de usar una clásica tarjeta pasiva de puntos, la marca activa la necesidad psicológica de progreso visible abriendo huecos de curiosidad en el cerebro del cliente. Su táctica se apoya en desafíos semanales aleatorios, como incentivar al usuario a probar tres tipos de grano distintos para coleccionar sellos digitales, desbloquear recetas ocultas y alcanzar un estatus superior. De este modo, pedir un café deja de ser una rutina transaccional y se transforma en un privilegio percibido.'
      },
      {
        id: '8belts',
        name: '8Belts',
        descripcion: '8Belts ataca la retención de alumnos aplicando mecánicas lúdicas de alta intensidad concentradas críticamente en la fase de bienvenida. Su estrategia dentro de la gamificación se centra en blindar los primeros 15 días de aprendizaje de idiomas, el periodo donde el subconsciente sabotea al estudiante y activa el deseo de abandonar. Mediante un onboarding interactivo que genera un pico de dopamina y un sentimiento de logro temprano, la marca frena la resistencia inicial. Esta táctica de impacto inmediato reduce de forma drástica las bajas y devoluciones, convirtiendo el arranque del servicio en una aventura adictiva.'
      }
    ]
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
        descripcion: 'La estrategia de acompañamiento de Duolingo destruye el aislamiento del aprendizaje online utilizando el compromiso social. Su mecánica consiste en emparejar semanalmente a los usuarios con un amigo para superar un reto conjunto dentro de la aplicación. La táctica se ejecuta mediante notificaciones empáticas y alertas críticas de racha comunitaria, activando una responsabilidad compartida donde fallar implica perjudicar al compañero. Así demuestran que acompañar de forma efectiva no es vigilar ni fiscalizar al cliente, sino conectarlo para que sienta que abandonar el hábito equivaldría a dejar tirado a un amigo.'
      },
      {
        id: 'nike',
        name: 'Nike',
        descripcion: 'Nike lidera el pilar del acompañamiento humanizando la tecnología para guiar al usuario hacia una transformación identitaria. Su estrategia consiste en romper la frialdad de la autocompetición solitaria a través de Nike Run Club. La táctica se basa en inyectar audio coaching emocional en directo y planes personalizados, metiendo voces de entrenadores reales que hablan directamente al oído del corredor. Esta guía profundamente empática sostiene al deportista en los momentos exactos de fatiga física y mental. Con este apoyo, el producto trasciende su valor de uso, dejando de ser un gasto para convertirse en una verdadera inversión personal.'
      },
      {
        id: 'clubvida10',
        name: 'Club Vida 10',
        descripcion: 'El caso de Club Vida 10 es el ejemplo perfecto de cómo erradicar el aislamiento crónico del alumno en infoproductos. Su estrategia de acompañamiento consistió en transformar un curso estático de hábitos saludables en un ecosistema humano y activo. La táctica radicó en diseñar dinámicas estructuradas de "accountability partners" y retos semanales cruzados donde las alumnas se apoyaban y rendían cuentas de forma obligatoria. Al tejer esta red de soporte íntimo a largo plazo, el contenido pasa a segundo plano y la pertenencia mutua garantiza la adherencia absoluta al servicio.'
      }
    ]
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
        descripcion: 'La estrategia de Spotify en el pilar de celebración consiste en capitalizar los datos de consumo del usuario para festejar su propia identidad. A través de su campaña anual Wrapped, la marca convierte métricas frías en un juego visual interactivo y diapositivas hipercoloridas sobre su "estado de ánimo musical". Su táctica se basa en un empaquetado personalizado y optimizado de forma nativa para ser compartido en redes sociales. Al colocar al cliente como el héroe absoluto del relato, la marca no premia la transacción, sino que le devuelve al usuario su propia historia en forma de trofeo cultural.'
      },
      {
        id: 'mastercard',
        name: 'Mastercard',
        descripcion: 'Mastercard opera en el pilar de celebración sustituyendo el enfoque transaccional por un sistema de experiencias invaluables bajo el concepto Priceless. Su estrategia consiste en apelar al subconsciente celebrando al cliente a través de dinámicas que juegan con los cinco sentidos, como emitir un sonido característico exclusivo al pagar o regalar clases de repostería interactiva. Su táctica se ejecuta mediante una plataforma de recompensas sensoriales y accesos restringidos a eventos únicos imposibles de comprar con dinero. Al vincular su uso con momentos memorables, consiguen que la marca adquiera un valor totalmente invaluable.'
      },
      {
        id: 'volkswagen',
        name: 'Volkswagen',
        descripcion: 'La estrategia de celebración de Volkswagen consiste en utilizar la motivación positiva y el sentimiento de logro para modelar el comportamiento de compra. En su campaña interactiva "Speed Camera Lottery", la marca instaló un radar real que sorteaba un premio en metálico entre los conductores que respetaban el límite, financiado con las multas de los infractores. Esta táctica basada en la teoría de la diversión sustituyó el castigo por la expectativa de recompensa, logrando reducir la velocidad media un 22% de forma voluntaria. Demostraron de forma irrefutable que celebrar el comportamiento correcto engancha infinitamente más que penalizar el error.'
      }
    ]
  },
  {
    id: 'comunidad',
    name: 'COMUNIDAD Y CO-CREACIÓN',
    color: 0xe91e63,
    glowColor: 0xff6090,
    brands: [
      {
        id: 'netflix',
        name: 'Netflix',
        descripcion: 'Netflix domina el pilar de comunidad y co-creación convirtiendo al espectador pasivo en un difusor orgánico del universo de sus series. Su estrategia consiste en romper la barrera de la pantalla mediante la activación de escenografías físicas efímeras e inmersivas en el mundo real. La táctica se basa en recrear con exactitud los decorados icónicos de sus producciones para obligar a los fans a jugar, interactuar y tomar fotografías de forma espontánea. Al darnos un escenario épico para generar contenido propio, la comunidad co-crea la promoción y expande la marca de forma viral y masiva.'
      },
      {
        id: 'lego',
        name: 'LEGO',
        descripcion: 'La estrategia de LEGO en el pilar de comunidad consiste en ceder el control del producto a su propia tribu mediante un ecosistema de co-creación generacional. Su táctica principal se ejecuta a través de la plataforma LEGO Insiders, un espacio interactivo donde los usuarios proponen sus propios diseños de sets, la comunidad los vota y la marca fabrica oficialmente los ganadores compartiendo beneficios. Esta mecánica une el juego físico con el digital, logrando que los fans dejen de ser simples compradores pasivos y se conviertan en los arquitectos definitivos del catálogo de una marca intensamente amada.'
      },
      {
        id: 'yamaha',
        name: 'Yamistar Yamaha',
        descripcion: 'Yamistar Yamaha lidera la co-creación eliminando radicalmente las fricciones económicas y tecnológicas para democratizar la experiencia de comunidad. Su estrategia consistió en conectar al fan de a pie con el box de carreras mediante una dinámica interactiva híbrida. Su táctica radicó en regalar plantillas de cartón sencillas para que los propios usuarios las recortaran y montaran de forma analógica, convirtiéndolas en gafas de realidad virtual caseras usando su propio teléfono móvil. Al co-crear su propio visor, los seguidores consumieron masivamente contenidos premium inmersivos, demostrando que la sencillez compartida genera muchísima más pertenencia que la tecnología compleja.'
      }
    ]
  }
];

/** Busca una marca por id en todos los pilares. */
export function findBrandById(brandId: string): Brand | undefined {
  for (const pillar of pillars) {
    const brand = pillar.brands.find((b) => b.id === brandId);
    if (brand) return brand;
  }
  return undefined;
}
