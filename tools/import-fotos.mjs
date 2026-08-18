import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'source', 'fotos', 'originales');
const OUT = path.join(ROOT, 'public', 'assets', 'img', 'catalogo');
const DRY = process.argv.includes('--dry');

const FFMPEG =
  process.env.FFMPEG_PATH ||
  'C:/Users/Javi0/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0-full_build/bin/ffmpeg.exe';

const MAX_W = 1600;
const QUALITY = 80;

const SLUGS = {
  Modarch_GabSalud: 'gabsalud',
  'Modarch_Implementación_de tienda_para_celulares y accesorios': 'tienda-celulares',
  Modarch_implementación_de_oficina: 'oficina',
  'Modarch_Líneas_de_Aprendizaje _ Remodelación': 'lineas-de-aprendizaje',
  Modarch_Pilates: 'pilates',
  Modarch_Valentino: 'valentino',
  'ModarchProyecto Implementación de departamento Cliente Jorge San Miguel': 'departamento-san-miguel',
  'Modarch Proyecto Muelle San José Jesús María': 'muelle-san-jose',
  'ModarchProyecto Oriental Restaurante Wanyi en Villa el salvador': 'restaurante-wanyi',
  'ModarchProyecto Residencial Pro': 'residencial-pro',
  'Modarch Proyecto Restaurante Primitivo Surco': 'restaurante-primitivo',
};

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    return e.isDirectory() ? walk(full) : /\.jpe?g$/i.test(e.name) ? [full] : [];
  });

const kb = (n) => `${Math.round(n / 1024)} KB`;

let totalIn = 0;
let totalOut = 0;
const manifest = {};

for (const [folder, slug] of Object.entries(SLUGS)) {
  const dir = path.join(SRC, folder);
  if (!fs.existsSync(dir)) {
    console.error(`  FALTA  ${folder}`);
    continue;
  }

  // DSC0xxxx.jpg ordena de forma estable y respeta la secuencia de la sesion
  const files = walk(dir).sort((a, b) => path.basename(a).localeCompare(path.basename(b), 'en'));
  const destDir = path.join(OUT, slug);
  if (!DRY) fs.mkdirSync(destDir, { recursive: true });

  console.log(`\n${slug}  (${files.length} fotos)`);
  const photos = [];

  files.forEach((src, i) => {
    const name = `${String(i + 1).padStart(2, '0')}.webp`;
    const dest = path.join(destDir, name);
    const inBytes = fs.statSync(src).size;
    totalIn += inBytes;

    if (!DRY) {
      execFileSync(
        FFMPEG,
        [
          '-hide_banner', '-loglevel', 'error', '-y',
          '-i', src,
          // Solo reduce: escalar hacia arriba una foto pequena no aporta nada
          '-vf', `scale='min(${MAX_W},iw)':-2:flags=lanczos`,
          '-c:v', 'libwebp', '-quality', String(QUALITY), '-compression_level', '6',
          dest,
        ],
        { stdio: 'pipe' }
      );
    }

    const outBytes = DRY ? 0 : fs.statSync(dest).size;
    totalOut += outBytes;
    photos.push(`/assets/img/catalogo/${slug}/${name}`);
    console.log(`  ${path.basename(src).padEnd(16)} ${kb(inBytes).padStart(8)} -> ${kb(outBytes).padStart(8)}  ${name}`);
  });

  manifest[slug] = photos;
}

console.log(`\nTOTAL  ${kb(totalIn)} -> ${kb(totalOut)}`);
if (!DRY) {
  fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  console.log(`manifest: public/assets/img/catalogo/manifest.json`);
}
