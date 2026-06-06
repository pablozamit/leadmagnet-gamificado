export interface Brand {
  id: string;
  name: string;
  descripcion: string;
  result: {
    contexto: string;
    conexion: string;
    tactica: string;
    fraseClave: string;
  };
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
        descripcion: 'El modelo de negocio de IKEA dio origen al "Efecto IKEA", el sesgo psicológico que demuestra que valoramos exponencialmente más aquello en lo que invertimos nuestro propio esfuerzo. Su estrategia de gamificación consiste en trasladar este comportamiento analógico al entorno digital. A través de su aplicación y planificadores 3D, transformaron la tediosa tarea de medir y amueblar en un juego interactivo y colaborativo. Al diseñar digitalmente sus espacios, los usuarios acumulan puntos canjeables por descuentos reales. Esta mecánica convierte la fricción del proceso de compra en un activo lúdico y adictivo. No venden muebles; venden la pura sensación de logro de haber creado algo tuyo.',
        result: {
          contexto: 'Transformó tareas rutinarias como el montaje de muebles en un juego digital colaborativo donde los puntos acumulados se cambian por descuentos y ventajas reales.',
          conexion: 'Conecta con el "Efecto IKEA": un patrón psicológico por el cual valoramos un 1000% más aquello en lo que invertimos nuestro propio esfuerzo físico y mental.',
          tactica: 'Creación de una dinámica interactiva donde los clientes juegan a diseñar y montar digitalmente, convirtiendo la pereza del proceso en un activo de compra.',
          fraseClave: '"No vendes muebles, vendes la sensación de haber creado algo tuyo".'
        }
      },
      {
        id: 'starbucks',
        name: 'Starbucks',
        descripcion: 'La estrategia de gamificación de Starbucks consiste en digitalizar el consumo diario mediante misiones y retos interactivos en su aplicación móvil. En lugar de usar una clásica tarjeta pasiva de puntos, la marca activa la necesidad psicológica de progreso visible abriendo huecos de curiosidad en el cerebro del cliente. Su táctica se apoya en desafíos semanales aleatorios, como incentivar al usuario a probar tres tipos de grano distintos para coleccionar sellos digitales, desbloquear recetas ocultas y alcanzar un estatus superior. De este modo, pedir un café deja de ser una rutina transaccional y se transforma en un privilegio percibido.',
        result: {
          contexto: 'Transformó la tarjeta de puntos tradicional en un sistema de misiones y retos en la aplicación móvil para coleccionar sellos digitales.',
          conexion: 'Abre pequeños huecos de curiosidad en el cerebro del cliente y activa la necesidad psicológica de progreso visible.',
          tactica: 'Diseño de desafíos semanales aleatorios (como probar tres granos distintos) para desbloquear recetas ocultas y estatus de cliente privilegiado.',
          fraseClave: '"La gamificación bien hecha no se siente como un juego, se siente como un privilegio".'
        }
      },
      {
        id: '8belts',
        name: '8Belts',
        descripcion: '8Belts ataca la retención de alumnos aplicando mecánicas lúdicas de alta intensidad concentradas críticamente en la fase de bienvenida. Su estrategia dentro de la gamificación se centra en blindar los primeros 15 días de aprendizaje de idiomas, el periodo donde el subconsciente sabotea al estudiante y activa el deseo de abandonar. Mediante un onboarding interactivo que genera un pico de dopamina y un sentimiento de logro temprano, la marca frena la resistencia inicial. Esta táctica de impacto inmediato reduce de forma drástica las bajas y devoluciones, convirtiendo el arranque del servicio en una aventura adictiva.',
        result: {
          contexto: 'Revolucionó la retención de alumnos en la enseñanza de idiomas implementando un sistema lúdico de onboarding de alta intensidad durante los primeros 15 días.',
          conexion: 'Ataca la resistencia inicial creando un pico de dopamina y logro temprano que frena en seco el deseo subconsciente de abandonar el programa.',
          tactica: 'Establecimiento de mecánicas lúdicas de impacto inmediato en la fase de bienvenida del servicio para reducir drásticamente las bajas y devoluciones.',
          fraseClave: '"El destino de un cliente se decide en los primeros quince días; hazlo una aventura interactiva y se quedará de por vida".'
        }
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
        descripcion: 'La estrategia de acompañamiento de Duolingo destruye el aislamiento del aprendizaje online utilizando el compromiso social. Su mecánica consiste en emparejar semanalmente a los usuarios con un amigo para superar un reto conjunto dentro de la aplicación. La táctica se ejecuta mediante notificaciones empáticas y alertas críticas de racha comunitaria, activando una responsabilidad compartida donde fallar implica perjudicar al compañero. Así demuestran que acompañar de forma efectiva no es vigilar ni fiscalizar al cliente, sino conectarlo para que sienta que abandonar el hábito equivaldría a dejar tirado a un amigo.',
        result: {
          contexto: 'Empareja a los usuarios con un amigo cada semana para superar un reto juntos y evitar perder la racha mediante el compromiso social.',
          conexion: 'Demuestra que el acompañamiento no consiste en vigilar ni fiscalizar al usuario, sino en activar la responsabilidad compartida para eliminar la soledad.',
          tactica: 'Lanzamiento de misiones conjuntas por parejas semanales apoyadas en notificaciones empáticas y alertas de racha comunitaria.',
          fraseClave: '"El mejor acompañamiento hace que tu cliente sienta que abandonarte sería abandonar a un amigo".'
        }
      },
      {
        id: 'nike',
        name: 'Nike',
        descripcion: 'Nike lidera el pilar del acompañamiento humanizando la tecnología para guiar al usuario hacia una transformación identitaria. Su estrategia consiste en romper la frialdad de la autocompetición solitaria a través de Nike Run Club. La táctica se basa en inyectar audio coaching emocional en directo y planes personalizados, metiendo voces de entrenadores reales que hablan directamente al oído del corredor. Esta guía profundamente empática sostiene al deportista en los momentos exactos de fatiga física y mental. Con este apoyo, el producto trasciende su valor de uso, dejando de ser un gasto para convertirse en una verdadera inversión personal.',
        result: {
          contexto: 'Incluye en su aplicación voces de entrenadores reales que te hablan al oído como si fueran amigos íntimos para que no abandones la meta.',
          conexion: 'Cambia el foco de la autocompetición fría hacia una transformación identitaria guiada y profundamente empática.',
          tactica: 'Integración en Nike Run Club de planes personalizados y audio coaching emocional enfocado en sostener al usuario en los momentos de fatiga.',
          fraseClave: '"Cuando acompañas la transformación, tu producto deja de ser un gasto y se convierte en inversión".'
        }
      },
      {
        id: 'clubvida10',
        name: 'Club Vida 10',
        descripcion: 'El caso de Club Vida 10 es el ejemplo perfecto de cómo erradicar el aislamiento crónico del alumno en infoproductos. Su estrategia de acompañamiento consistió en transformar un curso estático de hábitos saludables en un ecosistema humano y activo. La táctica radicó en diseñar dinámicas estructuradas de "accountability partners" y retos semanales cruzados donde las alumnas se apoyaban y rendían cuentas de forma obligatoria. Al tejer esta red de soporte íntimo a largo plazo, el contenido pasa a segundo plano y la pertenencia mutua garantiza la adherencia absoluta al servicio.',
        result: {
          contexto: 'Transformó un curso tradicional de hábitos saludables en una comunidad viva donde las alumnas se rinden cuentas y se apoyan mutuamente.',
          conexion: 'Combate de raíz el aislamiento crónico del alumno en el entorno digital mediante la creación de redes de soporte íntimo a largo plazo.',
          tactica: 'Diseño estratégico de dinámicas de "accountability partners" y retos semanales cruzados para generar adherencia real al servicio.',
          fraseClave: '"Acompañar no es dar información técnica; acompañar es dar un espacio humano de pertenencia".'
        }
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
        descripcion: 'La estrategia de Spotify en el pilar de celebración consiste en capitalizar los datos de consumo del usuario para festejar su propia identidad. A través de su campaña anual Wrapped, la marca convierte métricas frías en un juego visual interactivo y diapositivas hipercoloridas sobre su "estado de ánimo musical". Su táctica se basa en un empaquetado personalizado y optimizado de forma nativa para ser compartido en redes sociales. Al colocar al cliente como el héroe absoluto del relato, la marca no premia la transacción, sino que le devuelve al usuario su propia historia en forma de trofeo cultural.',
        result: {
          contexto: 'Transforma los datos de uso de todo un año en diapositivas coloridas y un juego visual que celebra tu "estado de ánimo musical" con su Wrapped.',
          conexion: 'Activa la celebración de la identidad, logrando que el usuario se sienta el héroe y protagonista absoluto de la historia de la marca.',
          tactica: 'Despliegue anual de un resumen interactivo hiper-personalizado optimizado de forma nativa para ser compartido en canales sociales.',
          fraseClave: '"La mejor celebración no es premiar al cliente, es devolverle su propia historia".'
        }
      },
      {
        id: 'mastercard',
        name: 'Mastercard',
        descripcion: 'Mastercard opera en el pilar de celebración sustituyendo el enfoque transaccional por un sistema de experiencias invaluables bajo el concepto Priceless. Su estrategia consiste en apelar al subconsciente celebrando al cliente a través de dinámicas que juegan con los cinco sentidos, como emitir un sonido característico exclusivo al pagar o regalar clases de repostería interactiva. Su táctica se ejecuta mediante una plataforma de recompensas sensoriales y accesos restringidos a eventos únicos imposibles de comprar con dinero. Al vincular su uso con momentos memorables, consiguen que la marca adquiera un valor totalmente invaluable.',
        result: {
          contexto: 'Crea experiencias que juegan con los cinco sentidos, como un sonido característico al pagar o clases de repostería en directo bajo el concepto Priceless.',
          conexion: 'Apela al subconsciente asociando el acto transaccional con momentos memorables e invaluables de felicidad y autorrealización.',
          tactica: 'Desarrollo de una plataforma de recompensas sensoriales y accesos exclusivos a eventos únicos imposibles de comprar con dinero.',
          fraseClave: '"Cuando celebras a tu cliente con algo invaluable, tu marca se vuelve invaluable".'
        }
      },
      {
        id: 'volkswagen',
        name: 'Volkswagen',
        descripcion: 'La estrategia de celebración de Volkswagen consiste en utilizar la motivación positiva y el sentimiento de logro para modelar el comportamiento de compra. En su campaña interactiva "Speed Camera Lottery", la marca instaló un radar real que sorteaba un premio en metálico entre los conductores que respetaban el límite, financiado con las multas de los infractores. Esta táctica basada en la teoría de la diversión sustituyó el castigo por la expectativa de recompensa, logrando reducir la velocidad media un 22% de forma voluntaria. Demostraron de forma irrefutable que celebrar el comportamiento correcto engancha infinitamente más que penalizar el error.',
        result: {
          contexto: 'Lanzó el proyecto "Speed Camera Lottery" en Suecia, utilizando el dinero de las multas de tráfico para sortear un premio en metálico entre los conductores que respetaban el límite.',
          conexion: 'Sustituye el castigo tradicional por una dinámica de motivación positiva, sentimiento de logro inmediato y expectativa de recompensa.',
          tactica: 'Campaña interactiva "The Fun Theory" en radares reales, logrando reducir la velocidad media de circulación en un 22% de forma totalmente voluntaria.',
          fraseClave: '"Premiar el comportamiento correcto engancha diez veces más que castigar el error".'
        }
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
        descripcion: 'Netflix domina el pilar de comunidad y co-creación convirtiendo al espectador pasivo en un difusor orgánico del universo de sus series. Su estrategia consiste en romper la barrera de la pantalla mediante la activación de escenografías físicas efímeras e inmersivas en el mundo real. La táctica se basa en recrear con exactitud los decorados icónicos de sus producciones para obligar a los fans a jugar, interactuar y tomar fotografías de forma espontánea. Al darnos un escenario épico para generar contenido propio, la comunidad co-crea la promoción y expande la marca de forma viral y masiva.',
        result: {
          contexto: 'Monta réplicas físicas e inmersivas de los escenarios de sus series para que los fans jueguen y se hagan fotos, convirtiéndolos en difusores de la marca.',
          conexion: 'Transforma al consumidor pasivo en un co-creador activo de contenido y difusor orgánico del universo de la marca.',
          tactica: 'Activación de escenografías efímeras y experiencias interactivas en el mundo real conectadas con dinámicas digitales.',
          fraseClave: '"Dale a tu comunidad un escenario épico y ellos se encargarán de expandir tu imperio".'
        }
      },
      {
        id: 'lego',
        name: 'LEGO',
        descripcion: 'La estrategia de LEGO en el pilar de comunidad consiste en ceder el control del producto a su propia tribu mediante un ecosistema de co-creación generacional. Su táctica principal se ejecuta a través de la plataforma LEGO Insiders, un espacio interactivo donde los usuarios proponen sus propios diseños de sets, la comunidad los vota y la marca fabrica oficialmente los ganadores compartiendo beneficios. Esta mecánica une el juego físico con el digital, logrando que los fans dejen de ser simples compradores pasivos y se conviertan en los arquitectos definitivos del catálogo de una marca intensamente amada.',
        result: {
          contexto: 'Une el juego físico y el digital mediante una dinámica familiar que usa la cámara del móvil para buscar piezas virtuales ocultas entre los bloques reales.',
          conexion: 'Une dos identidades en un mismo espacio de co-creación: el niño que explora jugando y el adulto nostálgico que reconecta con su familia.',
          tactica: 'Lanzamiento de la plataforma LEGO Insiders donde la propia comunidad propone, vota y decide los próximos sets que la empresa fabricará de forma oficial.',
          fraseClave: '"Una marca verdaderamente amada es una marca que ha sido co-creada por su propia tribu".'
        }
      },
      {
        id: 'yamaha',
        name: 'Yamistar Yamaha',
        descripcion: 'Yamistar Yamaha lidera la co-creación eliminando radicalmente las fricciones económicas y tecnológicas para democratizar la experiencia de comunidad. Su estrategia consistió en conectar al fan de a pie con el box de carreras mediante una dinámica interactiva híbrida. Su táctica radicó en regalar plantillas de cartón sencillas para que los propios usuarios las recortaran y montaran de forma analógica, convirtiéndolas en gafas de realidad virtual caseras usando su propio teléfono móvil. Al co-crear su propio visor, los seguidores consumieron masivamente contenidos premium inmersivos, demostrando que la sencillez compartida genera muchísima más pertenencia que la tecnología compleja.',
        result: {
          contexto: 'Eliminó las barreras de acceso regalando unas plantillas de cartón sencillas para convertirlas en gafas de realidad virtual caseras con el propio teléfono.',
          conexion: 'Quita el freno económico y tecnológico haciendo sentir al fan de a pie que está metido dentro del box del equipo de carreras.',
          tactica: 'Dinámica híbrida de co-creación analógica (diseño de cartón) para ") consumir contenidos inmersivos premium de forma masiva.',
          fraseClave: '"La alta tecnología por sí sola no genera pertenencia; la sencillez compartida y accesible, sí".'
        }
      }
    ]
  }
];

export function findBrandById(brandId: string): Brand | undefined {
  for (const pillar of pillars) {
    const brand = pillar.brands.find((b) => b.id === brandId);
    if (brand) return brand;
  }
  return undefined;
}
