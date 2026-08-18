import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'public', 'assets', 'img', 'icons');
const BACKUP = path.join(ROOT, 'source', 'fotos', 'iconos-originales');

const FFMPEG =
  process.env.FFMPEG_PATH ||
  'C:/Users/Javi0/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0-full_build/bin/ffmpeg.exe';

// --sage-btn del sistema de tokens: contrasta sobre --paper sin endurecer
const TINT = { r: 78, g: 114, b: 89 };

const ICONS = ['consulta', 'concepto', 'aprobacion', 'ejecucion', 'instalacion', 'entrega'];

fs.mkdirSync(BACKUP, { recursive: true });

for (const name of ICONS) {
  const src = path.join(DIR, `${name}.png`);
  if (!fs.existsSync(src)) {
    console.error(`  FALTA  ${name}.png`);
    continue;
  }

  // Copia de seguridad: el recoloreado no es reversible
  const bak = path.join(BACKUP, `${name}.png`);
  if (!fs.existsSync(bak)) fs.copyFileSync(src, bak);

  const tmp = path.join(DIR, `${name}.tmp.png`);
  execFileSync(
    FFMPEG,
    [
      '-hide_banner', '-loglevel', 'error', '-y',
      '-i', bak,
      // El dibujo vive en el alfa: se sustituye el color y se conserva la forma
      '-vf', `format=rgba,geq=r=${TINT.r}:g=${TINT.g}:b=${TINT.b}:a='alpha(X,Y)'`,
      '-frames:v', '1',
      tmp,
    ],
    { stdio: 'pipe' }
  );

  fs.renameSync(tmp, src);
  console.log(`  ${name}.png`.padEnd(22) + `-> #${((1 << 24) + (TINT.r << 16) + (TINT.g << 8) + TINT.b).toString(16).slice(1)}`);
}

console.log(`\nOriginales en ${path.relative(ROOT, BACKUP)}`);
