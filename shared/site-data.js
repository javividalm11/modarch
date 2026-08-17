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
  coverage: 'Lima Metropolitana y todo el Perú (proyectos en provincia con visita programada).',
  social: {
    instagram: 'https://www.instagram.com/modarchstudiope',
    facebook: 'https://www.facebook.com/modarchstudio.pe',
    tiktok: 'https://www.tiktok.com/@modarchstudiope',
  },
};

export const stats = [
  { value: 120, suffix: '+', label: 'Proyectos entregados' },
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
  { icon: '/assets/img/icons/acabados.png', title: 'Variedad de acabados', text: 'Amplia carta de materiales, texturas y colores validados en obra.' },
  { icon: '/assets/img/icons/durabilidad.png', title: 'Durabilidad garantizada', text: 'Especificamos materiales pensados para el uso real del espacio.' },
  { icon: '/assets/img/icons/instalacion.png', title: 'Instalación profesional', text: 'Equipo técnico propio y protocolos de montaje.' },
  { icon: '/assets/img/icons/acustico.png', title: 'Confort acústico', text: 'Soluciones de aislamiento y absorción para cada tipo de ambiente.' },
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

// NOTA: nombres y fotos de ejemplo. Reemplazar antes de publicar (ver README).
export const team = [
  {
    name: 'Miguel Ángel Rojas',
    role: 'CEO & Director de Arquitectura',
    lead: true,
    bio: 'Fundador de ModArch. Lidera la visión del estudio y la dirección de cada proyecto, desde el concepto hasta la entrega en obra.',
    focus: ['Dirección de proyecto', 'Arquitectura', 'Gestión de obra'],
    photo: '/assets/img/team/ceo.svg',
    initials: 'MR',
  },
  {
    name: 'Camila Herrera',
    role: 'Directora de Diseño de Interiores',
    bio: 'Responsable del lenguaje estético del estudio: materialidad, color e identidad de cada espacio.',
    focus: ['Interiorismo', 'Materialidad', 'Styling'],
    photo: '/assets/img/team/design-director.svg',
    initials: 'CH',
  },
  {
    name: 'Diego Salazar',
    role: 'Jefe de Proyectos y Obra',
    bio: 'Coordina cronogramas, proveedores y control de calidad para que cada entrega cumpla plazos.',
    focus: ['Planificación', 'Control de obra', 'Presupuestos'],
    photo: '/assets/img/team/project-lead.svg',
    initials: 'DS',
  },
  {
    name: 'Valeria Núñez',
    role: 'Arquitecta de Visualización 3D',
    bio: 'Convierte los planos en renders y recorridos fotorrealistas para decidir antes de construir.',
    focus: ['Render 3D', 'Recorridos 360°', 'Iluminación'],
    photo: '/assets/img/team/viz-artist.svg',
    initials: 'VN',
  },
  {
    name: 'Andrés Quispe',
    role: 'Diseñador de Mobiliario',
    bio: 'Desarrolla el mobiliario a medida del estudio, del despiece técnico al montaje final.',
    focus: ['Carpintería', 'Despiece técnico', 'Prototipado'],
    photo: '/assets/img/team/furniture.svg',
    initials: 'AQ',
  },
  {
    name: 'Lucía Ramos',
    role: 'Atención al Cliente y Postventa',
    bio: 'Primer contacto del estudio. Acompaña al cliente durante y después de la entrega.',
    focus: ['Asesoría', 'Seguimiento', 'Postventa'],
    photo: '/assets/img/team/client-care.svg',
    initials: 'LR',
  },
];

// `photo` = catálogo, `scene` = la pieza colocada; misma proporción.
// `cutout: true` si el mueble viene recortado: usa contain y no le corta las patas.
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
    photo: `${PROD}/665-diseno-de-consultorio-medico-peru.jpeg`,
    scene: `${PROD}/666-arquitectura-interior-clinica-moderna.jpeg`,
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
    a: 'No. El cotizador entrega un rango referencial inmediato basado en metraje, tipo de espacio y alcance. El presupuesto formal se emite después de la visita técnica y el levantamiento de medidas, sin costo.',
  },
  {
    q: '¿Trabajan fuera de Lima?',
    a: 'Sí, ejecutamos proyectos en todo el Perú. Para provincia coordinamos visitas programadas y el costo de traslado se detalla en la propuesta.',
  },
];

export const blog = [
  {
    title: 'Tendencias en interiores minimalistas para 2026',
    excerpt: 'Menos elementos, mejores materiales. Cómo lograr calidez sin saturar el espacio.',
    image: '/assets/img/blog/blog-1.jpg',
    tag: 'Tendencias',
    date: '12 Ene 2026',
  },
  {
    title: 'Cómo iluminar correctamente un espacio comercial',
    excerpt: 'Temperatura de color, niveles de lux y capas de luz que sí impactan en ventas.',
    image: '/assets/img/blog/blog-2.jpg',
    tag: 'Iluminación',
    date: '03 Feb 2026',
  },
  {
    title: 'Remodelar o mudarse: cómo decidirlo con números',
    excerpt: 'Una guía práctica para comparar el costo real de renovar tu vivienda actual.',
    image: '/assets/img/blog/blog-3.jpg',
    tag: 'Guías',
    date: '21 Mar 2026',
  },
];

// Motor de precios (S/, referenciales). Ajustar aqui actualiza web y asistente.
export const pricing = {
  currency: 'S/',
  igv: 0.18,
  scopes: {
    diseno: {
      label: 'Proyecto de diseño',
      desc: 'Planos, distribución, materialidad y renders. Tú ejecutas la obra.',
      rate: 85,
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
    renders: { label: 'Renders fotorrealistas', perM2: 45, min: 900 },
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
  scale: [
    { upTo: 40, mult: 1.12 },
    { upTo: 120, mult: 1.0 },
    { upTo: 300, mult: 0.95 },
    { upTo: 600, mult: 0.9 },
    { upTo: Infinity, mult: 0.85 },
  ],
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
  const scaleMult = pricing.scale.find((s) => area <= s.upTo).mult;

  const base = area * sc.rate * sp.mult * lv.mult * scaleMult;
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
  if (belowMin) total = sc.min;

  const net = Math.round(total);
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
    igv: Math.round(net * pricing.igv),
    total: Math.round(net * (1 + pricing.igv)),
    low: Math.round(net * (1 - pricing.spread)),
    high: Math.round(net * (1 + pricing.spread)),
    perM2: area ? Math.round(net / area) : 0,
    weeks,
    weeksRange: `${weeks} a ${weeks + Math.ceil(weeks * 0.4)} semanas`,
  };
}
