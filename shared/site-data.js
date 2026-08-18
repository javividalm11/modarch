export const company = {
  name: 'ModArch',
  legal: 'ModArch Studio',
  tagline: 'Espacios que inspiran',
  claim: 'Arquitectura y Diseño de Interiores',
  style: 'Minimalismo cálido',
  styleTags: [
    'Arquitectura contemporánea',
    'Diseño biofílico',
    'Líneas limpias',
    'Materiales orgánicos',
    'Acabados premium',
  ],
  styleText:
    'Trabajamos con un lenguaje sobrio y cálido: líneas limpias, maderas de tono claro, microcemento, piedra, ratán y follaje, con luz indirecta que evita cualquier frialdad. Espacios despejados que se sienten habitados.',
  intro:
    'En ModArch transformamos espacios en experiencias. Somos un estudio de arquitectura y diseño de interiores apasionado por crear ambientes funcionales, estéticos y personalizados en todo el Perú.',
  mission:
    'Ofrecer un servicio integral y personalizado en arquitectura y diseño de interiores para viviendas y locales comerciales, acompañando al cliente desde la idea hasta la entrega final.',
  vision:
    'Ser una empresa referente en nuestro sector para el año 2030, por brindar propuestas innovadoras que combinen diseño, tecnología y sostenibilidad.',
  address: 'Av. Venezuela 6023, San Miguel — Lima, Perú',
  email: 'hola@modarch.com.pe',
  phones: ['+51 973 105 449', '+51 946 485 650', '+51 908 853 734'],
  whatsapp: '51973105449',
  hours: 'Lunes a viernes 9:00 – 18:30 · Sábados 9:00 – 13:00',
  visitFee: 120,
  coverage: 'Lima Metropolitana y todo el Perú (proyectos en provincia con visita programada).',
  social: {
    instagram: 'https://www.instagram.com/modarchstudiope',
    facebook: 'https://www.facebook.com/modarchstudio.pe',
    tiktok: 'https://www.tiktok.com/@modarchstudiope',
  },
};

export const stats = [
  { value: 20, suffix: '+', label: 'Proyectos entregados' },
  { value: 9, suffix: '', label: 'Años transformando espacios' },
  { value: 18000, suffix: ' m²', label: 'Metros intervenidos' },
  { value: 98, suffix: '%', label: 'Clientes que recomiendan' },
];

export const values = [
  { title: 'Creatividad', text: 'Transformamos ideas en proyectos únicos, con diseños innovadores que marcan la diferencia.' },
  { title: 'Compromiso', text: 'Acompañamos a nuestros clientes en todo el proceso, cumpliendo plazos y superando expectativas.' },
  { title: 'Profesionalismo', text: 'Equipo multidisciplinario que trabaja con seriedad, ética y responsabilidad.' },
  { title: 'Confianza', text: 'Construimos relaciones sólidas y transparentes con clientes, proveedores y aliados.' },
  { title: 'Sostenibilidad', text: 'Impulsamos prácticas y materiales respetuosos con el medio ambiente.' },
  { title: 'Innovación', text: 'Apostamos por tendencias modernas y tecnología para visualizar cada proyecto antes de construirlo.' },
];

export const services = [
  {
    id: 'diseno-interiores',
    n: '01',
    title: 'Diseño de Interiores',
    short: 'Casas, departamentos y espacios comerciales con identidad propia.',
    text: 'Diseñamos ambientes que equilibran estética y función: distribución, materialidad, color, iluminación y mobiliario trabajados como un solo sistema.',
    icon: '/assets/img/icons/diseno-interiores.png',
    image: '/assets/img/interiores-minimalistas.jpg',
    gallery: ['/assets/img/interiores-minimalistas.jpg', '/assets/img/interiores-minimalistas-2.jpg', '/assets/img/interior-moderno.jpg'],
    bullets: ['Layout y zonificación', 'Paleta de materiales', 'Moodboard y estilo', 'Planos de detalle'],
  },
  {
    id: 'residencial',
    n: '02',
    title: 'Proyectos Residenciales',
    short: 'Diseño con alma, hogares con corazón.',
    text: 'Convertimos tu casa o departamento en un espacio único y confortable, optimizando cada metro y reflejando tu estilo de vida.',
    icon: '/assets/img/icons/interiores.png',
    image: '/assets/img/diseno-con-alma.jpg',
    gallery: ['/assets/img/diseno-con-alma.jpg', '/assets/img/projects/paraiso-d1.jpg', '/assets/img/projects/paraiso-d2.jpg'],
    bullets: ['Salas y comedores', 'Dormitorios y walk-in', 'Cocinas integradas', 'Terrazas y exteriores'],
  },
  {
    id: 'comercial',
    n: '03',
    title: 'Proyectos Comerciales',
    short: 'Espacios comerciales que inspiran y venden.',
    text: 'Oficinas, tiendas, restaurantes y hoteles diseñados para comunicar tu marca y mejorar la experiencia de tus clientes.',
    icon: '/assets/img/icons/construccion.png',
    image: '/assets/img/espacios-comerciales.jpg',
    gallery: ['/assets/img/espacios-comerciales.jpg', '/assets/img/projects/chifa-fusion-d1.jpg', '/assets/img/projects/chifa-fusion-d2.jpg'],
    bullets: ['Retail y showrooms', 'Restaurantes y bares', 'Oficinas corporativas', 'Branding espacial'],
  },
  {
    id: 'remodelacion',
    n: '04',
    title: 'Remodelación Integral',
    short: 'De la demolición a los acabados finales.',
    text: 'Renovación completa con asesoría integrada: definimos el proyecto, gestionamos la obra y entregamos acabados de alta calidad.',
    icon: '/assets/img/icons/reparacion.png',
    image: '/assets/img/remodelar-transformar.jpg',
    gallery: ['/assets/img/remodelar-transformar.jpg', '/assets/img/projects/bar-deportivo-d1.jpg', '/assets/img/projects/bar-deportivo-2.jpg'],
    bullets: ['Ampliaciones', 'Cambio de acabados', 'Redes eléctricas y sanitarias', 'Drywall y falso cielo'],
  },
  {
    id: 'construccion',
    n: '05',
    title: 'Construcción y Obra',
    short: 'Ejecución llave en mano con control de calidad.',
    text: 'Ejecutamos el proyecto de principio a fin con cronograma, valorizaciones y control de avance semanal.',
    icon: '/assets/img/icons/ejecucion.png',
    image: '/assets/img/projects/edificio.jpg',
    gallery: ['/assets/img/projects/edificio.jpg', '/assets/img/projects/edificio-d1.jpg', '/assets/img/projects/edificio-d2.jpg'],
    bullets: ['Cronograma valorizado', 'Control de obra', 'Gestión de proveedores', 'Licencias y permisos'],
  },
  {
    id: 'mobiliario',
    n: '06',
    title: 'Mobiliario a Medida',
    short: 'Muebles diseñados y fabricados para tu espacio.',
    text: 'Diseñamos y fabricamos mobiliario a medida con melamina, MDF enchapado, laca y superficies sólidas.',
    icon: '/assets/img/icons/materiales.png',
    image: '/assets/img/projects/gamer.jpg',
    gallery: ['/assets/img/projects/gamer.jpg', '/assets/img/projects/gamer-d1.jpg', '/assets/img/projects/gamer-d2.jpg'],
    bullets: ['Closets y walk-in', 'Cocinas y reposteros', 'Recepciones y barras', 'Escritorios y racks'],
  },
];

export const differentiators = [
  {
    icon: '/assets/img/icons/acabados.png',
    title: 'Variedad de acabados',
    text: 'Amplia carta de materiales, texturas y colores validados en obra.',
    gradient: 'linear-gradient(137deg, #c97f55 0%, #f0d9be 45%, #a25f38 100%)',
  },
  {
    icon: '/assets/img/icons/durabilidad.png',
    title: 'Durabilidad garantizada',
    text: 'Especificamos materiales pensados para el uso real del espacio.',
    gradient: 'linear-gradient(137deg, #4e7259 0%, #dce8de 45%, #6e8f76 100%)',
  },
  {
    icon: '/assets/img/icons/instalacion.png',
    title: 'Instalación profesional',
    text: 'Equipo técnico propio y protocolos de montaje.',
    gradient: 'linear-gradient(137deg, #9a7b52 0%, #f2e3cc 45%, #c2a177 100%)',
  },
  {
    icon: '/assets/img/icons/acustico.png',
    title: 'Confort acústico',
    text: 'Soluciones de aislamiento y absorción para cada tipo de ambiente.',
    gradient: 'linear-gradient(137deg, #6e8f76 0%, #ebc9af 45%, #c97f55 100%)',
  },
];

export const process = [
  { n: '01', title: 'Consulta inicial', text: 'Evaluamos tus ideas, necesidades, estilo de vida y presupuesto.', icon: '/assets/img/icons/consulta.png' },
  { n: '02', title: 'Concepto y diseño', text: 'Moodboard, distribución y propuesta 3D del espacio.', icon: '/assets/img/icons/concepto.png' },
  { n: '03', title: 'Aprobación', text: 'Ajustes, presupuesto detallado y cronograma firmado.', icon: '/assets/img/icons/aprobacion.png' },
  { n: '04', title: 'Ejecución', text: 'Obra, fabricación de mobiliario y control de calidad semanal.', icon: '/assets/img/icons/ejecucion.png' },
  { n: '05', title: 'Instalación', text: 'Montaje profesional, iluminación y styling final.', icon: '/assets/img/icons/instalacion.png' },
  { n: '06', title: 'Entrega', text: 'Walkthrough, manual de mantenimiento y garantía.', icon: '/assets/img/icons/entrega.png' },
];

export const projects = [
  {
    id: 'chifa-fusion',
    title: 'Chifa Fusión',
    category: 'Restaurante',
    year: '2025',
    location: 'Lima',
    area: '180 m²',
    cover: '/assets/img/projects/chifa-fusion.jpg',
    gallery: ['/assets/img/projects/chifa-fusion.jpg', '/assets/img/projects/chifa-fusion-d1.jpg', '/assets/img/projects/chifa-fusion-d2.jpg'],
    objective: 'Renovar su local con un diseño moderno que combine la tradición oriental con un estilo contemporáneo.',
    result: 'Creamos una atmósfera elegante y funcional con iluminación cálida, detalles en madera y acabados que refuerzan la identidad de la marca y mejoran la experiencia del cliente.',
    style: 'Minimalismo cálido',
    tags: ['Interiorismo', 'Líneas limpias', 'Materiales orgánicos', 'Iluminación cálida'],
  },
  {
    id: 'paraiso',
    title: 'Colchones Paraíso',
    category: 'Retail',
    year: '2025',
    location: 'Lima',
    area: '240 m²',
    cover: '/assets/img/projects/paraiso.jpg',
    gallery: ['/assets/img/projects/paraiso.jpg', '/assets/img/projects/paraiso-d1.jpg', '/assets/img/projects/paraiso-d2.jpg'],
    objective: 'Modernizar el área de exhibición para resaltar sus productos de descanso, creando un espacio ordenado, acogedor y visualmente impactante.',
    result: 'Renovación interior con distribución optimizada, materiales de alta calidad e iluminación estratégica para poner en valor cada producto.',
    style: 'Minimalismo cálido',
    tags: ['Retail design', 'Líneas limpias', 'Acabados premium', 'Visual merchandising'],
  },
  {
    id: 'bar-deportivo',
    title: 'Bar Deportivo',
    category: 'Bar',
    year: '2025',
    location: 'Lima',
    area: '150 m²',
    cover: '/assets/img/projects/bar-deportivo.jpg',
    gallery: ['/assets/img/projects/bar-deportivo.jpg', '/assets/img/projects/bar-deportivo-2.jpg', '/assets/img/projects/bar-deportivo-d1.jpg'],
    objective: 'Crear un espacio temático y funcional que combine comodidad, buena acústica y un diseño moderno.',
    result: 'Un bar con identidad propia, iluminación dinámica y una distribución estratégica que mejora la visibilidad de pantallas y genera un ambiente vibrante.',
    style: 'Contemporáneo · Materiales orgánicos',
    tags: ['Acústica', 'Iluminación escénica', 'Branding espacial', 'Materiales orgánicos'],
  },
  {
    id: 'gamer',
    title: 'Habitación Gamer',
    category: 'Residencial',
    year: '2025',
    location: 'Lima',
    area: '18 m²',
    cover: '/assets/img/projects/gamer.jpg',
    gallery: ['/assets/img/projects/gamer.jpg', '/assets/img/projects/gamer-d1.jpg', '/assets/img/projects/gamer-d2.jpg'],
    objective: 'Diseñar un ambiente inmersivo para juego y streaming aprovechando cada centímetro del dormitorio.',
    result: 'Mobiliario a medida, gestión de cableado oculto e iluminación RGB integrada en un espacio ordenado y confortable.',
    style: 'Minimalismo cálido',
    tags: ['Mobiliario a medida', 'Líneas limpias', 'Iluminación LED', 'Espacio reducido'],
  },
  {
    id: 'el-pezon',
    title: 'El Pez On',
    category: 'Restaurante',
    year: '2025',
    location: 'Lima',
    area: '210 m²',
    cover: '/assets/img/projects/el-pezon.jpg',
    gallery: ['/assets/img/projects/el-pezon.jpg', '/assets/img/projects/el-pezon-d1.jpg', '/assets/img/projects/el-pezon-d2.jpg'],
    objective: 'Traducir la identidad marina de la marca en un espacio cálido y memorable para el comensal.',
    result: 'Materialidad natural, texturas artesanales y una barra protagonista que ordena el recorrido del local.',
    style: 'Diseño biofílico · Materiales naturales',
    tags: ['Interiorismo', 'Diseño biofílico', 'Materiales orgánicos', 'Barra a medida'],
  },
  {
    id: 'edificio',
    title: 'Revestimiento de Edificio',
    category: 'Arquitectura',
    year: '2025',
    location: 'Lima',
    area: '620 m²',
    cover: '/assets/img/projects/edificio.jpg',
    gallery: ['/assets/img/projects/edificio.jpg', '/assets/img/projects/edificio-d1.jpg', '/assets/img/projects/edificio-d2.jpg'],
    objective: 'Renovar la fachada del edificio con un lenguaje contemporáneo y materiales de bajo mantenimiento.',
    result: 'Nueva envolvente con ritmo vertical, iluminación arquitectónica y acabados resistentes al clima limeño.',
    style: 'Arquitectura contemporánea',
    tags: ['Fachada', 'Arquitectura contemporánea', 'Líneas limpias', 'Acabados premium'],
  },
];

const catalogoRaw = [
  { id: 'gabsalud', title: 'GabSalud', category: 'Salud', count: 17, coverNum: 9 },
  { id: 'tienda-celulares', title: 'Tienda de celulares y accesorios', category: 'Retail', count: 7, coverNum: 4 },
  { id: 'oficina', title: 'Implementación de oficina', category: 'Corporativo', count: 8 },
  { id: 'lineas-de-aprendizaje', title: 'Líneas de Aprendizaje', category: 'Educativo', count: 15, coverNum: 8 },
  { id: 'pilates', title: 'Estudio de Pilates', category: 'Wellness', count: 7, coverNum: 3 },
  { id: 'valentino', title: 'Valentino', category: 'Retail', count: 10, coverNum: 8 },
  { id: 'departamento-san-miguel', title: 'Departamento en San Miguel', category: 'Residencial', count: 9, coverNum: 3 },
  { id: 'muelle-san-jose', title: 'Muelle San José', category: 'Restaurante', count: 10, coverNum: 6 },
  { id: 'restaurante-wanyi', title: 'Restaurante Wanyi', category: 'Restaurante', count: 14, coverNum: 13 },
  { id: 'residencial-pro', title: 'Residencial Pro', category: 'Residencial', count: 29, coverNum: 20 },
  { id: 'restaurante-primitivo', title: 'Restaurante Primitivo', category: 'Restaurante', count: 8, coverNum: 8 },
];

export const catalogo = catalogoRaw.map((p) => {
  const todas = Array.from(
    { length: p.count },
    (_, i) => `/assets/img/catalogo/${p.id}/${String(i + 1).padStart(2, '0')}.webp`
  );

  const n = (p.coverNum || 1) - 1;
  const photos = n > 0 && n < todas.length ? [todas[n], ...todas.slice(0, n), ...todas.slice(n + 1)] : todas;

  return { ...p, cover: photos[0], photos };
});

export const hive = [
  ...projects.map((p, i) => ({
    kind: 'project',
    ref: i,
    title: p.title,
    cover: p.cover,
    meta: `${p.category} · ${p.style} · ${p.area}`,
  })),
  ...catalogo.map((p) => ({
    kind: 'catalogo',
    ref: p.id,
    title: p.title,
    cover: p.cover,
    meta: `${p.category} · ${p.photos.length} fotografías`,
  })),
];

export const clients = [
  { name: 'Amarea', logo: '/assets/img/clients/amarea.png' },
  { name: 'Don Carlitos', logo: '/assets/img/clients/don-carlitos.png' },
  { name: 'El Pez On', logo: '/assets/img/clients/el-pezon.png' },
  { name: 'Monteflor', logo: '/assets/img/clients/monteflor.png' },
  { name: 'Natsumi', logo: '/assets/img/clients/natsumi.png' },
  { name: "Paco's Bill", logo: '/assets/img/clients/pacos-bill.png' },
  { name: 'Colchones Paraíso', logo: '/assets/img/clients/paraiso.png' },
  { name: 'Wanyi', logo: '/assets/img/clients/wanyi.png' },
];

export const ceoProfile = {
  intro:
    'Randalls Gastulo Pacheco lidera ModArch Studio desde una visión que entiende la arquitectura y el interiorismo como una expresión de identidad, sofisticación y propósito.',
  sections: [
    {
      h: 'Su enfoque',
      p: [
        'Integra arquitectura, diseño de interiores y dirección creativa para concebir espacios únicos, donde cada proporción, material, textura y detalle responde a una misma intención: crear experiencias que perduren.',
      ],
    },
    {
      h: 'Al frente del estudio',
      p: [
        'Participa en el desarrollo conceptual y estratégico de cada proyecto, buscando un equilibrio preciso entre estética, funcionalidad y carácter.',
      ],
      fromProcess: true,
    },
    {
      h: 'Su idea del diseño',
      p: [
        'Para Randalls, diseñar no consiste únicamente en crear espacios extraordinarios, sino en dar forma a una manera de vivir, trabajar y experimentar el entorno.',
        'Una visión. Un lenguaje. Una arquitectura con identidad.',
      ],
    },
  ],
};

export const team = [
  {
    name: 'Randalls Gastulo Pacheco',
    role: 'CEO · Arquitecto · Director Creativo',
    lead: true,
    bio: 'Arquitectura que trasciende. Espacios que cuentan historias.',
    focus: ['Arquitectura', 'Interiorismo', 'Dirección creativa'],
    photo: '/assets/img/team/CEO2.png',
    cutout: '/assets/img/team/CEO-cut.webp',
    tone: '#a2603a',
    initials: 'RG',
  },
  {
    name: 'Alonso Jesús Pinedo Bao',
    role: 'Coordinador del área de diseño y proyectos',
    focus: ['Diseño', 'Proyectos', 'Coordinación'],
    photo: '/assets/img/team/Alonso.png',
    cutout: '/assets/img/team/alonsoHD-cut.webp',
    tone: '#41604b',
    initials: 'AP',
  },
  {
    name: 'Leyla Alexandra Vilca León',
    role: 'Asesora comercial',
    focus: ['Asesoría comercial', 'Atención al cliente'],
    photo: '/assets/img/team/leyla.png',
    cutout: '/assets/img/team/leylaHD-cut.webp',
    tone: '#8a6b46',
    initials: 'LV',
  },
];

const PROD = '/assets/img/products';

export const products = [
  {
    tag: 'Sofá',
    name: 'Cirrus',
    text: 'Modular de líneas suaves y tapizado bouclé. Disponible en 2, 3 y 4 cuerpos.',
    photo: `${PROD}/627-Sofa-Cirrus-ModArch-1.png`,
    scene: `${PROD}/629-Sofa-Cirrus-1.jpg`,
    cutout: true,
  },
  {
    tag: 'Sofá',
    name: 'Nival',
    text: 'Asiento profundo y respaldo mullido. Pensado para estar horas sentado.',
    photo: `${PROD}/635-Sofa-Nival-1.jpg`,
    scene: `${PROD}/643-Sofa-Nival-4.jpg`,
    cutout: true,
  },
  {
    tag: 'Sofá',
    name: 'Velours',
    text: 'Volumen acanalado y base metálica. Presencia sin recargar el ambiente.',
    photo: `${PROD}/648-Sofa-Velours-ModArch-1.jpg`,
    scene: `${PROD}/651-Sofa-Velours-1.jpg`,
    cutout: true,
  },
  {
    tag: 'Sofá',
    name: 'Zenit',
    text: 'Geometría recta en cuero, con patas de madera maciza. Para salas amplias.',
    photo: `${PROD}/655-SOFA-ZENIT-1.jpg`,
    scene: `${PROD}/660-Sofa-Zenit-4.jpg`,
    cutout: true,
  },
  {
    tag: 'Mueble',
    name: 'Acenea',
    text: 'Sistema de estantería y almacenaje modulado al centímetro de tu pared.',
    photo: `${PROD}/611-Mueble-Acenea-Interiores.jpg`,
    scene: `${PROD}/613-Acenea-Interiores.jpg`,
  },
  {
    tag: 'A medida',
    name: 'Proyecto a medida',
    text: 'Diseñamos y fabricamos la pieza que tu espacio necesita, desde cero.',
    photo: `${PROD}/653-Sofa-Velours-2.jpg`,
    scene: `${PROD}/652-Sofa-Velours-3.jpg`,
  },
];

export const testimonials = [
  {
    text: 'Entendieron la identidad de la marca desde la primera reunión. El local cambió por completo y los clientes se quedan más tiempo.',
    author: 'Administración',
    role: 'Chifa Fusión',
  },
  {
    text: 'La distribución del showroom mejoró muchísimo. Ahora cada producto se luce y el recorrido es mucho más claro.',
    author: 'Gerencia comercial',
    role: 'Colchones Paraíso',
  },
  {
    text: 'Cumplieron el cronograma y nos mantuvieron informados cada semana. El resultado superó lo que habíamos imaginado.',
    author: 'Propietario',
    role: 'Bar Deportivo',
  },
];

export const faqs = [
  {
    q: '¿Cuál es el primer paso para iniciar un proyecto?',
    a: 'El proceso comienza con una consulta inicial en la que evaluamos tus ideas, necesidades, estilo de vida y presupuesto. Puedes agendarla por WhatsApp, por el formulario de la web o directamente con nuestro asistente por voz.',
  },
  {
    q: '¿Cuánto tiempo dura el desarrollo de un proyecto?',
    a: 'Por lo general, en 2 a 4 semanas entregamos el concepto inicial. Los proyectos completos de remodelación o nueva construcción pueden tardar de unas pocas semanas a varios meses según la superficie y el alcance.',
  },
  {
    q: '¿Qué tipos de proyectos realizan?',
    a: 'Abordamos desde diseños residenciales e interiores comerciales hasta reformas integrales, edificaciones completas y visualizaciones en 3D.',
  },
  {
    q: '¿Cómo se gestionan los cambios durante el proyecto?',
    a: 'Contamos con un flujo de trabajo flexible que permite integrar cambios a medida que avanzamos, manteniendo transparencia y comunicación constante sobre el impacto en costo y plazo.',
  },
  {
    q: '¿Incluyen permisos, legalización y coordinación técnica?',
    a: 'Sí. Nos encargamos de la documentación técnica, los permisos de obra y la coordinación con ingenieros, contratistas y reguladores.',
  },
  {
    q: '¿El cotizador de la web reemplaza a un presupuesto formal?',
    a: `No. El cotizador entrega un rango referencial inmediato basado en metraje, tipo de espacio y alcance. El presupuesto formal se emite después de la visita técnica y el levantamiento de medidas, que tiene un costo desde S/ ${company.visitFee}.`,
  },
  {
    q: '¿Trabajan fuera de Lima?',
    a: 'Sí, ejecutamos proyectos en todo el Perú. Para provincia coordinamos visitas programadas y el costo de traslado se detalla en la propuesta.',
  },
];

export const blog = [
  {
    slug: 'licencia-de-funcionamiento',
    title: 'Licencia de funcionamiento: lo que debe estar resuelto en planos',
    excerpt: 'Aforo, rutas de evacuación e ITSE. Lo que conviene definir antes de romper un muro.',
    image: '/assets/img/espacios-comerciales.jpg',
    tag: 'Normativa',
    date: '08 Jul 2026',
    iso: '2026-07-08',
    read: '7 min',
    intro:
      'La mayoría de los retrasos en un local comercial no vienen de la obra, sino del expediente. Lo que se resuelve en el plano antes de romper un muro es lo que decide si abres en la fecha prevista.',
    body: [
      {
        h: 'Primero el expediente, después la obra',
        p: [
          'Es habitual que un local se alquile, se demuela y solo entonces se pregunte qué pide la municipalidad. Ese orden encarece todo: cualquier observación obliga a deshacer trabajo ya pagado.',
          'La licencia de funcionamiento se tramita ante la municipalidad distrital y va acompañada de la Inspección Técnica de Seguridad en Edificaciones (ITSE). Según el giro, el aforo y el área, la inspección puede ser previa o posterior a la apertura, y eso cambia por completo el cronograma. Es lo primero que conviene confirmar en el distrito donde está el local.',
        ],
      },
      {
        h: 'El aforo condiciona el resto del diseño',
        img: {
          src: '/assets/img/projects/bar-deportivo.jpg',
          alt: 'Salón de bar con distribución de mesas y circulación despejada',
          caption: 'El aforo se fija antes de repartir las mesas: de él dependen las salidas y la ruta de evacuación.',
        },
        p: [
          'El aforo no es una cifra que se elija: se calcula a partir del uso y del área ocupable, y de él dependen el número y el ancho de las salidas, los servicios higiénicos y las rutas de evacuación.',
          'Por eso se define antes de la distribución y no después. Un salón con diez mesas más de las que el aforo admite no es un problema de mobiliario: obliga a rehacer el plano.',
        ],
      },
      {
        h: 'Lo que dejamos cerrado antes de valorizar',
        p: ['Con el plano en la mano se anticipa casi todo. Estos son los puntos que resolvemos antes de poner precio a la obra:'],
        list: [
          'Aforo calculado por ambiente y su efecto en salidas y servicios',
          'Ruta de evacuación libre, señalizada y con ancho suficiente',
          'Ubicación de extintores, luces de emergencia y señalética',
          'Compatibilidad de uso del local con el giro que se quiere operar',
          'Qué permite el contrato de alquiler en cuanto a modificaciones',
        ],
      },
      {
        h: 'El detalle que más proyectos frena',
        img: {
          src: '/assets/img/projects/el-pezon.jpg',
          alt: 'Interior de restaurante El Pez On',
          caption: 'Antes de firmar el alquiler conviene verificar que el local admita el giro que se quiere operar.',
        },
        p: [
          'La compatibilidad de uso. Un local puede estar impecable y aun así no admitir el giro que se pretende operar, o exigir condiciones adicionales —extracción, insonorización, accesos independientes— que no estaban en el presupuesto.',
          'Verificarlo antes de firmar el alquiler cuesta una consulta. Descubrirlo después cuesta el proyecto entero.',
        ],
      },
      {
        h: 'Los requisitos varían: conviene consultar el caso',
        p: [
          'No existe una lista única. Cada municipalidad tiene sus procedimientos y plazos, y cambian según el giro, el aforo y el área. Cualquier planificación seria empieza por consultar el caso concreto en el distrito correspondiente.',
          'En nuestros proyectos comerciales gestionamos la documentación técnica y la coordinación con los especialistas, y lo hacemos en paralelo al diseño, no al final.',
        ],
      },
    ],
  },
  {
    slug: 'diseno-de-tiendas-recorrido',
    title: 'Diseño de tiendas: cómo el recorrido influye en la venta',
    excerpt: 'Zona de entrada, punto focal y circulación que lleva al cliente hasta el fondo.',
    image: '/assets/img/projects/paraiso.jpg',
    tag: 'Retail',
    date: '26 May 2026',
    iso: '2026-05-26',
    read: '6 min',
    intro:
      'Una tienda no se recorre al azar. Hay patrones bastante estables en cómo entra y circula la gente, y el diseño puede acompañarlos o pelearse con ellos.',
    body: [
      {
        h: 'La zona de entrada no es para vender',
        p: [
          'Los primeros metros tras la puerta funcionan como transición: quien entra viene de la calle, con otra luz y otro ritmo, y necesita un momento para ajustarse. Lo que se coloca ahí tiende a pasar desapercibido.',
          'Conviene dejar ese tramo despejado y usarlo para orientar: que desde la puerta se entienda cómo está organizada la tienda y qué hay al fondo.',
        ],
      },
      {
        h: 'Dar una razón para llegar al fondo',
        img: {
          src: '/assets/img/projects/paraiso-d1.jpg',
          alt: 'Showroom de Colchones Paraíso con punto focal al fondo',
          caption: 'Un remate visible desde la puerta cambia el recorrido completo de la tienda.',
        },
        p: [
          'El error más común es concentrar todo el atractivo en la vitrina y la primera mesa. Si nada llama desde el fondo, el cliente recorre un tercio del local y sale.',
          'Un punto focal al final —un mueble distinto, un muro con color, una pieza iluminada aparte— cambia el recorrido completo. No hace falta que sea el producto más caro: basta con que se vea desde la entrada.',
        ],
      },
      {
        h: 'La circulación se diseña, no se deja sobrar',
        p: ['El pasillo principal ordena la visita. Algunas medidas que aplicamos en showrooms y retail:'],
        list: [
          'Pasillo principal amplio y continuo, sin obstáculos a media altura',
          'Mobiliario bajo en el centro del local y alto en los perímetros',
          'Caja fuera del flujo de entrada, para no generar cuello de botella',
          'Zona de espera o prueba donde detenerse sin estorbar el paso',
        ],
      },
      {
        h: 'El mueble a medida gana metros',
        img: {
          src: '/assets/img/projects/paraiso-d2.jpg',
          alt: 'Mobiliario de exhibición diseñado a medida del local',
          caption: 'El mueble hecho para ese local exacto libera el equivalente a un pasillo entero.',
        },
        p: [
          'En locales pequeños —los más frecuentes en Lima— el mobiliario estándar desperdicia rincones y obliga a dejar holguras. Un mueble diseñado para ese local exacto suele liberar el equivalente a un pasillo o a una zona de exhibición completa.',
          'Es la diferencia entre exhibir lo que cabe y exhibir lo que se quiere vender.',
        ],
      },
    ],
  },
  {
    slug: 'costo-implementar-restaurante-lima',
    title: 'Cuánto cuesta implementar un restaurante en Lima',
    excerpt: 'Cocina, extracción, mobiliario y acabados: dónde se va de verdad el presupuesto.',
    image: '/assets/img/projects/chifa-fusion.jpg',
    tag: 'Comercial',
    date: '14 Abr 2026',
    iso: '2026-04-14',
    read: '7 min',
    intro:
      'La pregunta llega siempre igual: cuánto cuesta el metro cuadrado. La respuesta útil es otra, porque en un restaurante el presupuesto no se reparte de forma pareja, y saber dónde se concentra evita el sobrecosto clásico a mitad de obra.',
    body: [
      {
        h: 'La cocina se lleva la parte que nadie presupuesta',
        p: [
          'El salón es lo que se ve y lo que se dibuja primero, pero la cocina y sus instalaciones concentran una porción del costo mucho mayor de lo que suele estimarse.',
          'Extracción y reposición de aire, trampa de grasa, puntos de agua caliente y fría, desagües, tablero eléctrico dimensionado para los equipos y superficies lavables. Nada de eso aparece en el render y todo se paga.',
        ],
      },
      {
        h: 'Extracción: el rubro que más presupuestos rompe',
        img: {
          src: '/assets/img/projects/chifa-fusion-d1.jpg',
          alt: 'Detalle de instalaciones y acabados en Chifa Fusión',
          caption: 'Por dónde puede salir el ducto lo decide el edificio, no el diseño.',
        },
        p: [
          'Es el punto donde más veces hemos visto detenerse un proyecto. La solución depende de por dónde puede salir el ducto, y eso lo condiciona el edificio, no el diseño.',
          'En un local en planta baja de un edificio de viviendas, llevar la descarga hasta la altura que corresponde puede costar más que todo el mobiliario del salón. Es lo primero que hay que resolver, antes de elegir acabados.',
        ],
      },
      {
        h: 'Dónde se va el presupuesto, en orden',
        img: {
          src: '/assets/img/projects/chifa-fusion-d2.jpg',
          alt: 'Barra y bancas corridas de Chifa Fusión',
          caption: 'El mobiliario fijo —barra, bancas y estaciones— es una partida propia, no un extra.',
        },
        p: ['Con variaciones según la carta y el aforo, el reparto suele ordenarse así:'],
        list: [
          'Instalaciones de cocina, extracción y sanitarias',
          'Obra civil: demolición, muros, pisos, drywall y falso cielo',
          'Mobiliario fijo: barra, bancas corridas y estaciones de servicio',
          'Iluminación y acabados del salón',
          'Señalética, seguridad y detalles de identidad',
        ],
      },
      {
        h: 'Un rango con el que empezar a trabajar',
        p: [
          'Una remodelación integral de local comercial parte de S/ 1,150 por m², y un llave en mano desde S/ 1,450 por m². El cotizador de la web devuelve un rango inmediato según metraje, tipo de espacio y nivel de acabado.',
          'Es un referencial, no un presupuesto. El número firme sale después de la visita técnica, cuando se ve el estado real de las instalaciones, y esa visita no tiene costo.',
        ],
      },
    ],
  },
  {
    slug: 'remodelar-o-mudarse',
    title: 'Remodelar o mudarse: cómo decidirlo con números',
    excerpt: 'Una guía práctica para comparar el costo real de renovar tu vivienda actual.',
    image: '/assets/img/blog/blog-3.jpg',
    tag: 'Guías',
    date: '21 Mar 2026',
    iso: '2026-03-21',
    read: '6 min',
    intro:
      'La decisión suele tomarse por cansancio y no por cuentas. Puesta en números, casi siempre se aclara en una tarde.',
    body: [
      {
        h: 'Compara costo total, no precio de lista',
        p: [
          'Mudarse no cuesta lo que cuesta el departamento nuevo. Cuesta eso más todo lo que rodea la operación, y ahí es donde la comparación se desequilibra.',
          'Remodelar, en cambio, concentra el gasto en obra y mobiliario, pero mantiene la ubicación, los vecinos y el colegio de los chicos. Eso no aparece en ninguna hoja de cálculo y suele ser lo que más pesa.',
        ],
      },
      {
        h: 'Lo que casi nadie suma al mudarse',
        p: ['Antes de comparar, conviene tener estas partidas sobre la mesa:'],
        list: [
          'Gastos de la operación: notaría, registros y comisiones',
          'Mudanza, embalaje y los primeros arreglos del lugar nuevo',
          'Cortinas, luminarias y mobiliario que no encaja en el nuevo espacio',
          'Meses de doble gasto si los plazos no calzan',
          'Tiempo y desplazamientos si cambia la zona',
        ],
      },
      {
        h: 'Cuándo remodelar gana con claridad',
        img: {
          src: '/assets/img/remodelar-transformar.jpg',
          alt: 'Ambiente remodelado con distribución abierta',
          caption: 'Redistribuir transforma la vivienda por una fracción del costo de cambiarse.',
        },
        p: [
          'Cuando la ubicación es buena, la estructura está sana y el problema es de distribución o de acabados. Redistribuir una cocina, abrir un ambiente o rehacer un baño transforma la sensación de la vivienda por una fracción del costo de cambiarse.',
          'También cuando el metraje alcanza pero está mal aprovechado. Es más frecuente de lo que parece: muchos departamentos pierden metros en pasillos y en muebles que no corresponden a sus medidas.',
        ],
      },
      {
        h: 'Cuándo conviene mudarse',
        img: {
          src: '/assets/img/diseno-con-alma.jpg',
          alt: 'Sala de estar con iluminación cálida',
          caption: 'Con presupuesto y plazo sobre la mesa, la decisión deja de ser una discusión.',
        },
        p: [
          'Cuando faltan metros de verdad y no hay forma de conseguirlos, cuando la zona ya no corresponde a la etapa de vida, o cuando el edificio tiene problemas de fondo que no se resuelven puerta adentro.',
          'Si la duda persiste, el orden que recomendamos es sencillo: pide una propuesta de remodelación con presupuesto y plazo, y compárala contra el costo total de mudarse. Con las dos cifras al lado, la decisión deja de ser una discusión.',
        ],
      },
    ],
  },
  {
    slug: 'iluminar-espacio-comercial',
    title: 'Cómo iluminar correctamente un espacio comercial',
    excerpt: 'Temperatura de color, niveles de lux y capas de luz que sí impactan en ventas.',
    image: '/assets/img/blog/blog-2.jpg',
    tag: 'Iluminación',
    date: '03 Feb 2026',
    iso: '2026-02-03',
    read: '6 min',
    intro:
      'En un local comercial la luz no es un acabado que se decide al final: es lo que hace que el producto se vea como es y que el espacio invite a quedarse.',
    body: [
      {
        h: 'Tres capas, no una',
        p: [
          'El error más repetido es resolver todo con una sola fuente general. El resultado es un espacio plano, sin jerarquía, donde nada destaca.',
          'Una instalación bien planteada trabaja con tres capas: la general, que da el nivel base; la de acento, que dirige la atención a lo que se quiere vender; y la decorativa, que aporta carácter y suele ser la que se recuerda.',
        ],
      },
      {
        h: 'Temperatura de color según lo que vendes',
        img: {
          src: '/assets/img/projects/chifa-fusion.jpg',
          alt: 'Salón de restaurante con luz cálida y acentos de neón',
          caption: 'Una sola temperatura en la capa general y los cambios reservados a los acentos.',
        },
        p: [
          'La temperatura se mide en kelvin y cambia por completo la lectura del producto. Las luces cálidas favorecen madera, textiles, pan y piel; las neutras son más fieles con el color y funcionan mejor en ropa, cosmética y retail técnico.',
          'La regla práctica: mantener una sola temperatura en la capa general de cada ambiente y reservar los cambios para los acentos. Mezclarlas en el mismo techo se nota siempre, y se nota mal.',
        ],
      },
      {
        h: 'El índice que casi nadie mira',
        p: [
          'El CRI indica qué tan fielmente una luminaria reproduce los colores. Con un CRI bajo, un textil pierde saturación y una carta de materiales deja de ser confiable, aunque la cantidad de luz sea correcta.',
          'En cualquier local donde el color importe conviene exigirlo alto. Es un dato de ficha técnica y no encarece la instalación en la misma medida en que mejora el resultado.',
        ],
      },
      {
        h: 'Errores que se repiten',
        img: {
          src: '/assets/img/projects/el-pezon-d1.jpg',
          alt: 'Detalle de iluminación de acento sobre mobiliario',
          caption: 'La luz de acento dirige la atención a lo que se quiere vender.',
        },
        p: ['Lo que más corregimos al entrar a un local ya iluminado:'],
        list: [
          'Luminarias en fila regular sin relación con lo que hay debajo',
          'Deslumbramiento por fuentes vistas a la altura de los ojos',
          'Vitrina con menos luz que la calle, que la vuelve un espejo de día',
          'Zona de caja o de prueba peor iluminada que el resto',
          'Nivel uniforme en todo el local, sin ningún punto de atención',
        ],
      },
    ],
  },
  {
    slug: 'interiores-minimalistas-2026',
    title: 'Tendencias en interiores minimalistas para 2026',
    excerpt: 'Menos elementos, mejores materiales. Cómo lograr calidez sin saturar el espacio.',
    image: '/assets/img/blog/blog-1.jpg',
    tag: 'Tendencias',
    date: '12 Ene 2026',
    iso: '2026-01-12',
    read: '5 min',
    intro:
      'El minimalismo dejó de significar espacios vacíos y fríos. Lo que se consolida este año es un despojo cálido: menos piezas, pero mejor material y mejor luz.',
    body: [
      {
        h: 'Menos piezas, mejor material',
        p: [
          'La tendencia no va de quitar cosas hasta que no quede nada, sino de reducir el número de elementos para poder subir la calidad de cada uno.',
          'Un ambiente con tres piezas bien resueltas se sostiene mejor que uno con diez correctas. Y sale a cuenta: el presupuesto se concentra donde se toca y se ve a diario.',
        ],
      },
      {
        h: 'La calidez viene de la textura',
        img: {
          src: '/assets/img/interiores-minimalistas.jpg',
          alt: 'Interior minimalista con maderas claras y textiles de trama visible',
          caption: 'Con poca paleta, el carácter lo aporta el contraste entre superficies.',
        },
        p: [
          'Si se reduce el color y el ornamento, el peso lo asume la materia. Maderas de tono claro, microcemento, piedra, ratán y textiles de trama visible dan la temperatura que antes daba el objeto decorativo.',
          'De ahí que una paleta corta no resulte fría: lo que aporta el carácter es el contraste entre superficies mate, veta y tejido.',
        ],
      },
      {
        h: 'Luz indirecta como norma',
        p: [
          'La luz vista se retira. Cornisas, veladuras, luz rasante en muros y perfiles integrados en el mobiliario sustituyen al foco central, y con ello desaparece la sombra dura que endurece cualquier ambiente.',
          'Es también lo que hace que un espacio despejado se sienta habitado y no expuesto.',
        ],
      },
      {
        h: 'Guardado invisible',
        img: {
          src: '/assets/img/interiores-minimalistas-2.jpg',
          alt: 'Mueble de piso a techo enrasado con el muro',
          caption: 'El guardado deja de leerse como mueble y pasa a ser parte de la arquitectura.',
        },
        p: [
          'Nada de lo anterior funciona si no hay dónde guardar. El orden visual del minimalismo depende por completo de tener almacenamiento suficiente y a medida.',
          'Muebles de piso a techo, tiradores ocultos y frentes enrasados con el muro: el guardado deja de leerse como mueble y pasa a ser parte de la arquitectura. Es la pieza que sostiene todo lo demás.',
        ],
      },
    ],
  },
];

export const pricing = {
  currency: 'S/',
  igv: 0.18,
  scopes: {
    diseno: {
      label: 'Proyecto de diseño',
      desc: 'Planos, distribución, materialidad y renders incluidos. Tú ejecutas la obra.',
      rate: 45,
      min: 2500,
      weeksBase: 3,
      weeksPerM2: 0.012,
    },
    mobiliario: {
      label: 'Mobiliario a medida',
      desc: 'Diseño, fabricación e instalación de muebles a medida.',
      rate: 950,
      min: 4500,
      weeksBase: 4,
      weeksPerM2: 0.03,
    },
    remodelacion: {
      label: 'Remodelación integral',
      desc: 'Demolición, obra civil, instalaciones y acabados.',
      rate: 1150,
      min: 12000,
      weeksBase: 6,
      weeksPerM2: 0.05,
    },
    llave: {
      label: 'Llave en mano',
      desc: 'Diseño + obra + mobiliario + styling. Entrega lista para usar.',
      rate: 1450,
      min: 18000,
      weeksBase: 8,
      weeksPerM2: 0.06,
    },
  },
  spaces: {
    departamento: { label: 'Departamento', mult: 1.0 },
    casa: { label: 'Casa', mult: 1.05 },
    oficina: { label: 'Oficina', mult: 1.1 },
    retail: { label: 'Tienda / Retail', mult: 1.15 },
    restaurante: { label: 'Restaurante / Bar', mult: 1.3 },
    hotel: { label: 'Hotel / Hospedaje', mult: 1.25 },
    salud: { label: 'Clínica / Consultorio', mult: 1.2 },
  },
  levels: {
    esencial: { label: 'Esencial', mult: 0.85, desc: 'Acabados funcionales, buena relación costo-beneficio.' },
    premium: { label: 'Premium', mult: 1.0, desc: 'Estándar del estudio. Materiales de marca y detalles a medida.' },
    alta: { label: 'Alta gama', mult: 1.35, desc: 'Materiales importados, piezas únicas y control milimétrico.' },
  },
  extras: {
    tour360: { label: 'Recorrido virtual 360°', fixed: 1500 },
    licencias: { label: 'Gestión de licencias y permisos', fixed: 2800 },
    iluminacion: { label: 'Diseño de iluminación técnica', perM2: 28 },
    domotica: { label: 'Domótica / smart home', perM2: 65 },
    paisajismo: { label: 'Paisajismo y áreas verdes', perM2: 55 },
    supervision: { label: 'Supervisión semanal de obra', pct: 0.08 },
  },
  urgency: {
    estandar: { label: 'Estándar', mult: 1.0, note: 'Cronograma normal' },
    prioritario: { label: 'Prioritario', mult: 1.15, note: '30% menos tiempo' },
    express: { label: 'Express', mult: 1.3, note: 'Equipo dedicado' },
  },
  spread: 0.12,
};

export function quote(input) {
  const {
    m2 = 0,
    scope = 'diseno',
    space = 'departamento',
    level = 'premium',
    urgency = 'estandar',
    extras = [],
  } = input || {};

  const sc = pricing.scopes[scope] || pricing.scopes.diseno;
  const sp = pricing.spaces[space] || pricing.spaces.departamento;
  const lv = pricing.levels[level] || pricing.levels.premium;
  const ur = pricing.urgency[urgency] || pricing.urgency.estandar;
  const area = Math.max(0, Number(m2) || 0);

  const base = area * sc.rate * sp.mult * lv.mult;
  const lines = [{ label: `${sc.label} · ${area} m²`, amount: Math.round(base) }];

  let extrasTotal = 0;
  const pctExtras = [];
  for (const key of extras) {
    const ex = pricing.extras[key];
    if (!ex) continue;
    if (ex.pct) {
      pctExtras.push(ex);
      continue;
    }
    const amount = ex.fixed ? ex.fixed : Math.max(ex.min || 0, Math.round(area * ex.perM2));
    extrasTotal += amount;
    lines.push({ label: ex.label, amount });
  }

  let subtotal = base + extrasTotal;
  for (const ex of pctExtras) {
    const amount = Math.round(subtotal * ex.pct);
    subtotal += amount;
    lines.push({ label: ex.label, amount });
  }

  let total = subtotal * ur.mult;
  if (ur.mult !== 1) {
    lines.push({ label: `Ritmo ${ur.label.toLowerCase()}`, amount: Math.round(subtotal * (ur.mult - 1)) });
  }

  const belowMin = area > 0 && total < sc.min;
  if (belowMin) {
    lines.push({ label: `Ajuste al mínimo del servicio`, amount: Math.round(sc.min - total) });
    total = sc.min;
  }

  const gross = Math.round(total);
  const net = Math.round(gross / (1 + pricing.igv));
  const weeks = Math.max(2, Math.round(sc.weeksBase + area * sc.weeksPerM2));

  return {
    valid: area > 0,
    area,
    scopeKey: scope,
    scope: sc.label,
    space: sp.label,
    level: lv.label,
    urgency: ur.label,
    lines,
    belowMin,
    min: sc.min,
    net,
    igv: gross - net,
    total: gross,
    low: Math.round(gross * (1 - pricing.spread)),
    high: Math.round(gross * (1 + pricing.spread)),
    perM2: area ? Math.round(gross / area) : 0,
    weeks,
    weeksRange: `${weeks} a ${weeks + Math.ceil(weeks * 0.4)} semanas`,
  };
}
