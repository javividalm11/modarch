# ModArch — Web 2026

Rediseño completo de [modarch.com.pe](https://modarch.com.pe/): estudio de arquitectura y diseño de
interiores en Lima, Perú. Sitio multipágina con galería WebGL de proyectos, cotizador automático por
m², chatbot con Google Gemini y un agente de voz con llamada en tiempo real.

## Páginas

| Ruta | Contenido |
| --- | --- |
| `/` | Hero + resumen de cada sección con enlace a su página |
| `/nosotros/` | Estudio, misión, visión, valores, proceso, diferenciales y equipo completo |
| `/servicios/` | Los 6 servicios en detalle, proceso, diferenciales y acceso al cotizador |
| `/proyectos/` | Galería WebGL + grilla completa con lightbox, clientes y testimonios |
| `/cotizador/` | Cotizador por m² completo + preguntas frecuentes |
| `/equipo/` | Redirección compatible hacia `/nosotros/#equipo` |
| `/muebles/` | Catálogo completo de mobiliario |
| `/blog/` | Artículos |
| `/contacto/` | Formulario, datos del estudio y FAQ |

El HTML de cada página se **genera** con `npm run pages` a partir de `shared/site-data.js` y las
plantillas de `scripts/partials.mjs`: el nav, el footer y los widgets de IA se escriben una sola vez.
Todo el contenido queda en el HTML estático (bueno para SEO y para navegadores sin JS); el JavaScript
solo añade comportamiento. `npm run dev` y `npm run build` ejecutan la generación automáticamente.

---

## Arranque rápido

```bash
npm install
cp .env.example .env      # completa GEMINI_API_KEY
npm run dev
```

- Web: http://localhost:5173
- API: http://localhost:8787

La web funciona sin API key: solo el chatbot y el agente de voz quedan desactivados
(muestran un mensaje claro y derivan a WhatsApp).

### Producción — Cloudflare Pages

El sitio se despliega en Cloudflare Pages conectado al repositorio de GitHub.

| Ajuste | Valor |
| --- | --- |
| Build command | `npm run build` |
| Output directory | `dist` |
| Variable de build | `NODE_VERSION=20` |

Las rutas de API salen de `functions/`, que Pages detecta y despliega solo:

- `functions/api/chat.js` → `/api/chat` (streaming SSE del chatbot)
- `functions/api/voice-token.js` → `/api/voice-token` (token efímero del agente de voz)
- `functions/api/health.js` → `/api/health` (diagnóstico: confirma que el secret llegó)

`GEMINI_API_KEY` se carga en **Settings → Variables and Secrets** como *Secret*, nunca
como variable de build: las variables de build acaban dentro del bundle que descarga el
navegador. `GEMINI_CHAT_MODEL` sí puede ir como variable normal.

Los formularios no tocan el servidor: contacto y cotizador abren WhatsApp con el mensaje
ya redactado.

Si además usas el agente de voz, añade `GEMINI_LIVE_MODEL` y `GEMINI_VOICE` como
variables normales. Sin ellas se usan los valores por defecto del código.

---

## Qué incluye

### Experiencia

| Bloque | Detalle |
| --- | --- |
| Dirección de arte | **Japandi / minimalismo cálido / diseño biofílico**: fondo papel `#F7F4EE`, avena, arena, roble y arcilla; verde salvia y terracota de marca; tinta cálida `#23211D`. Bloques de corteza (menú, cotizador, cierre y footer) como único contraste oscuro |
| Hero | Composición editorial: titular en serif a gran escala sobre papel con luz cálida indirecta. Sin imagen ni escena de fondo |
| Secuencia por scroll | *Scroll-driven image sequence* sobre `<canvas>`: 72 frames de un despiece 3D controlados por la posición del scroll, con la sección anclada y leyendas que cambian por tramo |
| Galería de proyectos | Carrusel WebGL con shader propio: riel curvo, aberración cromática según la velocidad de arrastre, las piezas fuera de foco se funden con el papel. Arrastrable, con flechas |
| Animaciones | Lenis (scroll suave) + GSAP ScrollTrigger: reveals por palabra enmascarada, clip-path, parallax, contadores, tilt 3D, botones magnéticos, cursor personalizado |
| Secciones | Hero, nosotros (con el video original del cliente), estadísticas, servicios en acordeón con preview flotante, proyectos, proceso, diferenciales, cotizador, equipo, testimonios, clientes, blog, FAQ y contacto |
| Detalle | Preloader con cortinas, grano animado, barra de progreso, menú fullscreen, lightbox de proyecto, marquesinas |

### Cotizador automático por m²

Asistente de 3 pasos con cálculo en vivo (`shared/site-data.js` → `pricing` + `quote()`):

```
base = m² × tarifa_alcance × factor_espacio × factor_nivel × factor_escala
total = (base + adicionales) × factor_ritmo × 1.18 (IGV)
```

- **Alcances**: proyecto de diseño, mobiliario a medida, remodelación integral, llave en mano
- **Espacios**: departamento, casa, oficina, retail, restaurante/bar, hotel, clínica
- **Niveles**: esencial, premium, alta gama
- **Adicionales**: renders, tour 360°, licencias, iluminación técnica, domótica, paisajismo, supervisión
- **Salida**: rango ±12%, desglose línea por línea, precio por m², plazo estimado en semanas
- **Cierre**: exportación del resumen a WhatsApp, con o sin los datos de contacto

Para actualizar precios se edita **solo** `pricing` en `shared/site-data.js`: la web, el chatbot y
el agente de voz toman los valores de ahí automáticamente.

### Chatbot (Gemini)

- `POST /api/chat` hace de proxy con streaming SSE. **La API key nunca llega al navegador.**
- En producción lo sirve `functions/api/chat.js` (Cloudflare); en local, `server/index.js`
- Prompt de sistema generado desde los datos reales del estudio (`shared/knowledge.js`)
- Renderizado incremental y sugerencias rápidas
- Modelo por defecto: `gemini-3.6-flash` (`GEMINI_CHAT_MODEL`)

> El límite de 30 peticiones/minuto por IP solo existe en el servidor de desarrollo. La
> Function no lo lleva: el contador en memoria no sirve entre isolates. Si hace falta,
> se implementa con un binding de KV.

### Agente de voz (Gemini Live API)

Llamada de audio bidireccional en tiempo real, sin plugins:

No hay puente: el navegador habla **directo** con Gemini usando un token de un solo
uso. Cloudflare no puede sostener un servidor WebSocket, y así la clave real nunca
sale del edge.

```
1. Navegador ──POST /api/voice-token──> Function ──x-goog-api-key──> Google
                                     <── auth_tokens/<hash> ────────
2. Navegador ──PCM16 16 kHz──> Gemini Live API   (?access_token=auth_tokens/…)
             <──PCM16 24 kHz──
```

Detalles que costaron dar con ellos y conviene no tocar a ciegas:

- El método es `BidiGenerateContentConstrained`, **no** `BidiGenerateContent`, y solo
  existe en `v1alpha`.
- El parámetro es `access_token`, y el valor va **literal**: codificar la barra de
  `auth_tokens/` invalida la autenticación.
- La configuración se fija en el token con `bidiGenerateContentSetup` (no
  `liveConnectConstraints`, que no existe). Modelo, voz y prompt quedan bloqueados
  del lado servidor: el cliente no puede alterarlos.

- Captura por `AudioWorklet`, remuestreo y codificación PCM en el cliente
- Reproducción encolada sin cortes, con corte inmediato si el usuario interrumpe al agente
- Transcripción en vivo de ambos lados, visualizador circular de audio, mute y temporizador
- Límite de 10 minutos por llamada, en el cliente. El token caduca a los 15 min como
  respaldo. **Ya no hay tope de llamadas simultáneas**: dependía del estado en memoria
  del puente. Si hace falta, se reimplementa contando tokens en KV.
- Modelo por defecto: `gemini-3.1-flash-live-preview` (`GEMINI_LIVE_MODEL`), voz `Kore` (`GEMINI_VOICE`)

> Los modelos Live están en preview y Google rota los identificadores. Si la llamada falla con un
> código de cierre, prueba con `gemini-2.5-flash-native-audio-preview-12-2025` en `GEMINI_LIVE_MODEL`.

**Comprueba qué modelos habilita tu clave** antes de fijarlos, porque no todas dan acceso a los mismos:

```bash
curl -H "x-goog-api-key: TU_CLAVE" https://generativelanguage.googleapis.com/v1beta/models
```

**Detalles que hacen falta para que funcione** (aprendidos a golpes):

- `generationConfig.thinkingConfig.thinkingLevel: 'low'` es **obligatorio** en los modelos con
  razonamiento. Sin él, el modelo consume todo el `maxOutputTokens` pensando y devuelve una
  respuesta vacía, sin ningún error.
- La API responde con **500 transitorios** con cierta frecuencia; el proxy reintenta 3 veces con
  espera creciente antes de rendirse.
- Google separa los eventos SSE con `\r\n\r\n`, no con `\n\n`.
- Para depurar la voz: `VOICE_DEBUG=1 npm run dev:api` registra cada mensaje de la Live API.

---

## Estructura

```
MODARCH-WEB/
├─ shared/
│  ├─ site-data.js             Fuente única: textos, servicios, proyectos, equipo, FAQ y tarifario
│  └─ knowledge.js             Prompts de sistema del chat y de la voz (lo usan Functions y server/)
├─ functions/api/
│  ├─ chat.js                  Pages Function: /api/chat, streaming SSE contra Gemini
│  ├─ voice-token.js           Pages Function: token efímero para la Live API
│  └─ health.js                Pages Function: /api/health
├─ scripts/
│  ├─ partials.mjs             Plantillas: nav, footer, widgets y cada sección
│  └─ build-pages.mjs          Genera las 9 páginas + sitemap.xml + robots.txt
├─ src/
│  ├─ main.js                  Arranque: inicializa solo lo que existe en cada página
│  ├─ modules/
│  │  ├─ hero3d.js             Escena 3D del hero (desactivada, ver nota abajo)
│  │  ├─ projects3d.js         Galería WebGL con shaders
│  │  ├─ motion.js             Lenis + GSAP + cursor + reveals
│  │  ├─ render.js             Comportamiento: acordeones, preview de servicios, lightbox
│  │  ├─ quoter.js             Cotizador por m²
│  │  ├─ chatbot.js            UI y streaming del chat
│  │  └─ voicebot.js           Captura, reproducción y visualizador de audio
│  └─ styles/                  tokens · base · components · layout · sections · widgets
├─ server/index.js             SOLO DESARROLLO: espejo de functions/ para npm run dev
├─ public/assets/              Imágenes, video y logos descargados del sitio original
└─ index.html, nosotros/…      Generados por npm run pages (ignorados por git)
```

Para cambiar un texto, un servicio, un proyecto o una tarifa se edita **solo** `shared/site-data.js`.
Para reordenar o crear una página, se edita el array `pages` de `scripts/build-pages.mjs` y se añade
el slug a `PAGES` en `vite.config.js`.

### Secuencia por scroll (sección «Anatomía del proyecto»)

Técnica: *scroll-driven image sequence* / *scrollytelling* al estilo Apple. En vez de un vídeo, se
dibuja un frame por vez en un `<canvas>` según el progreso del scroll, así responde al trackpad sin
latencia. Implementado en `src/modules/scroll-sequence.js` con GSAP ScrollTrigger (`scrub` + `pin`).

Actualmente son **6 fotogramas de una sala que se amuebla sola**: parte del volumen vacío y con cada
tramo de scroll aparecen alfombra, sofá, mobiliario, decoración y luz cálida. Con 24 frames o menos
el módulo **funde** entre uno y el siguiente en vez de saltar, así que 6 imágenes se ven como una
transición continua. Además aplica un *push-in* del 4 % a lo largo del recorrido.

**Flujo para actualizar la secuencia**

1. Deja los originales en `source/scroll3d/` con orden natural (`v1.png`, `v2.png`…). Esa carpeta
   está fuera de `public/`, así que nunca entra al build.
2. `npm run frames:optimize` — redimensiona a 1600 px, convierte a WebP y renombra a
   `seq-0001.webp`… en `public/assets/frames/`. En el caso actual: 12,5 MB → 0,60 MB (−95 %).
3. Ajusta la cantidad en `scripts/partials.mjs` → `sequenceSection({ frames: 6, length: 3.6 })`.
   `length` son las alturas de viewport que dura el anclaje.

| | |
| --- | --- |
| Nombre final | `seq-0001.webp` … (4 dígitos, correlativo desde 1) |
| Resolución | 1600 px de ancho, todas iguales |
| Peso objetivo | ≤ 150 KB por frame |
| Requisito | Encuadre, cámara y geometría **idénticos** entre fotogramas |

El módulo lee todo desde `data-seq-*` en el HTML (`frames`, `path`, `ext`, `pad`, `length`, `scrub`,
`blend`, `push`), así que puedes cambiar ruta o formato sin tocar el JS. Si faltan más de la mitad de
los frames, la sección degrada sola al póster estático y muestra los cuatro pasos como lista.

**Alternativa: secuencia larga desde 3D.** `tools/sequence/scene.html` es una escena Three.js con el
despiece de un interior Japandi, y `tools/sequence/render.mjs` la recorre con Chrome headless
capturando un frame por paso:

```bash
npm run frames                                  # 72 frames · 1200×900 · webp q80
node tools/sequence/render.mjs http://localhost:5174 96 1400 1050 82
```

Ninguna de las dos herramientas entra en el build de producción.

### Optimización de imágenes

```bash
npm run images:optimize          # recomprime public/assets/img sin cambiar nombres ni rutas
npm run images:optimize -- --dry # simula sin escribir
```

Reduce iconos a 256 px, logos de cliente a 600 px y fotos a 1600 px, y solo reemplaza el archivo si
el resultado pesa menos. En la primera pasada: 8,41 MB → 4,82 MB (−43 %).

> **Pendiente:** `assets/video/modarch-nosotros.mp4` pesa 29 MB. Ya se carga de forma diferida (solo
> se descarga si el visitante llega a la sección Nosotros), pero conviene recomprimirlo:
> `ffmpeg -i modarch-nosotros.mp4 -vf scale=1280:-2 -c:v libx264 -crf 28 -preset slow -an out.mp4`
> — debería quedar en 2-3 MB sin pérdida perceptible a ese tamaño.

### Sistema de movimiento

Todas las animaciones salen de las constantes `M` de `src/modules/motion.js`: recorridos cortos
(22 px), curvas largas (`power2.out` / `expo.out`) y **cero rebote**. Cambiar esas constantes
recalibra el ritmo de todo el sitio a la vez.

### Escena 3D del hero

`src/modules/hero3d.js` contiene una columnata arquitectónica en Three.js (PBR, sombras, niebla,
haces de luz, polvo y parallax) que quedó **desactivada** a favor del hero tipográfico actual.
Para reactivarla, en `src/main.js`:

```js
const HERO_3D = true;
```

Con el flag en `false`, Rollup elimina ese código del bundle.

### Assets

Los 66 archivos de `public/assets/` provienen del sitio original del cliente: logotipo, favicons,
fotos de los 6 proyectos con sus detalles, logos de 8 clientes, iconos de servicios y proceso,
imágenes de blog y el video institucional.

---

## Variables de entorno

| Variable | Por defecto | Uso |
| --- | --- | --- |
| `GEMINI_API_KEY` | — | Requerida para chat y voz ([aistudio.google.com/apikey](https://aistudio.google.com/apikey)) |
| `GEMINI_CHAT_MODEL` | `gemini-3.6-flash` | Modelo del chatbot |
| `GEMINI_LIVE_MODEL` | `gemini-3.1-flash-live-preview` | Modelo del agente de voz |
| `GEMINI_VOICE` | `Kore` | Voz del agente |
| `PORT` | `8791` | Solo dev. Puerto del servidor; debe coincidir con el proxy de `vite.config.js` |
| `ALLOWED_ORIGIN` | — | Solo dev. Origen permitido para CORS |

En local salen de `.env`. En Cloudflare Pages, `GEMINI_API_KEY` va como **Secret** y
`GEMINI_CHAT_MODEL` como variable normal; `PORT` y `ALLOWED_ORIGIN` no aplican.

Los leads ya no se almacenan: contacto y cotizador abren WhatsApp con los datos del
formulario prellenados hacia `company.whatsapp` (`shared/site-data.js`). Como
contrapartida, si el visitante no llega a pulsar «enviar» en WhatsApp no queda registro.

---

## Antes de publicar

1. **Equipo** — `shared/site-data.js` → `team` trae **nombres y fotos de ejemplo**. Reemplázalos por
   los datos reales del estudio y sustituye los SVG de `public/assets/img/team/` por retratos
   (recomendado 800×1000 px, formato 4:5).
2. **Tarifario** — valida los valores de `pricing` con el estudio antes de mostrarlos al público.
3. **Estadísticas** — `stats` (120+ proyectos, 9 años, 18 000 m², 98 %) son estimaciones; confírmalas.
4. **Blog** — los 3 artículos son títulos de muestra sobre las imágenes originales; enlázalos a
   contenido real o retira la sección.
5. **Testimonios** — están redactados a partir de los casos publicados; pide la aprobación del cliente.
6. **API key** — configúrala solo en el servidor. Nunca la expongas en el frontend.

---

## Rendimiento y accesibilidad

- Contenido en HTML estático por página: title, description, canonical, Open Graph y JSON-LD propios
- `sitemap.xml` y `robots.txt` generados; rutas sin barra final redirigen con 301
- CSS y JS compartidos entre páginas: al navegar, el navegador reusa los mismos bundles cacheados
- El preloader se muestra una sola vez por sesión (`sessionStorage`); al navegar entre páginas el
  nav y el contenido aparecen de inmediato, con una intro más corta
- CSS enlazado en el `<head>`: sin flash de contenido sin estilos, ni en dev ni en producción
- Failsafe de 9 s que libera la web si el bundle no llega a cargar; fallback `<noscript>`
- Detección de `prefers-reduced-motion`: desactiva scroll suave y reveals
- La galería WebGL se pausa con `IntersectionObserver` cuando sale de pantalla
- Fallback a grilla estática si el navegador no soporta WebGL
- Navegación por teclado, `aria-*` en acordeones y paneles, skip link y foco visible
- Bundle: 116 kB gz (Three.js) + 28 kB gz (GSAP) + 45 kB gz (app) + 11 kB gz (CSS)
