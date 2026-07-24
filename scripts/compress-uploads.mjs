/**
 * Script para comprimir imágenes de public/uploads/ con sharp
 * Redimensiona a max 1400px y comprime con mozjpeg quality 78
 * Las originales se guardan en public/uploads/originals/ como backup
 */

import sharp from 'sharp';
import { readdir, mkdir, copyFile, stat, writeFile, rename } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const uploadsDir = join(__dirname, '..', 'public', 'uploads');
const backupDir  = join(uploadsDir, 'originals');

function formatMB(bytes) {
  return (bytes / 1024 / 1024).toFixed(2) + ' MB';
}

async function main() {
  await mkdir(backupDir, { recursive: true });

  const entries = await readdir(uploadsDir, { withFileTypes: true });
  const images  = entries
    .filter(e => e.isFile() && /\.(jpg|jpeg|png)$/i.test(e.name))
    .map(e => e.name);

  console.log(`\nEncontradas ${images.length} imágenes en public/uploads/\n`);

  let totalBefore = 0;
  let totalAfter  = 0;
  let ok = 0, fail = 0;

  for (const file of images) {
    const inputPath  = join(uploadsDir, file);
    const backupPath = join(backupDir, file);
    const tempPath   = inputPath + '.tmp';

    const statBefore = await stat(inputPath);
    totalBefore += statBefore.size;

    // Backup primero
    try {
      await copyFile(inputPath, backupPath);
    } catch (backupErr) {
      console.log(`⚠ ${file.padEnd(10)} No se pudo hacer backup, saltando...`);
      totalAfter += statBefore.size;
      continue;
    }

    try {
      // Comprimir a un archivo temporal
      await sharp(inputPath)
        .resize({ width: 1400, withoutEnlargement: true })
        .jpeg({ quality: 78, mozjpeg: true, progressive: true })
        .toFile(tempPath);

      // Reemplazar original con el comprimido
      await rename(tempPath, inputPath);

      const statAfter = await stat(inputPath);
      totalAfter += statAfter.size;

      const pct = ((1 - statAfter.size / statBefore.size) * 100).toFixed(0);
      console.log(`✓ ${file.padEnd(10)} ${formatMB(statBefore.size).padStart(8)} → ${formatMB(statAfter.size).padStart(8)}  (-${pct}%)`);
      ok++;
    } catch (err) {
      // Si falla, contar el original sin cambios
      totalAfter += statBefore.size;
      console.log(`✗ ${file.padEnd(10)} ERROR: ${err.message.substring(0, 60)}`);
      fail++;
      // Limpiar temp si existe
      try { const { unlink } = await import('fs/promises'); await unlink(tempPath); } catch {}
    }
  }

  console.log('\n─────────────────────────────────────────────');
  console.log(`Procesadas:   ${ok} OK  |  ${fail} errores`);
  console.log(`Antes:        ${formatMB(totalBefore)}`);
  console.log(`Después:      ${formatMB(totalAfter)}`);
  console.log(`Ahorro total: ${formatMB(totalBefore - totalAfter)} (-${((1 - totalAfter / totalBefore) * 100).toFixed(0)}%)`);
  console.log(`\nOriginales guardados en: public/uploads/originals/`);
}

main().catch(console.error);
