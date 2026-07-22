import { mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { photos, aboutPhoto, rotateOnCopy, trimOnCopy } from '../data/photos.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const sourceDir = path.join(root, 'assets', 'source-photos');
const sourceAboutDir = path.join(root, 'assets', 'source-about');
const publicPhotosDir = path.join(root, 'public', 'photos');

async function copyOne(sourcePath, destPath, rotateDegrees, trim) {
  await mkdir(path.dirname(destPath), { recursive: true });
  let pipeline = sharp(sourcePath);
  const notes = [];
  if (rotateDegrees) {
    pipeline = pipeline.rotate(rotateDegrees);
    notes.push(`rotated ${rotateDegrees}°`);
  }
  if (trim) {
    pipeline = pipeline.trim();
    notes.push('trimmed white border');
  }
  await pipeline.toFile(destPath);
  console.log(`copied ${path.relative(root, destPath)}${notes.length ? ` (${notes.join(', ')})` : ''}`);
}

for (const photo of photos) {
  const src = path.join(sourceDir, photo.sourceFile);
  const dest = path.join(publicPhotosDir, photo.category, `${photo.slug}.jpg`);
  if (!existsSync(src)) throw new Error(`missing source file: ${src}`);
  await copyOne(src, dest, rotateOnCopy[photo.slug], trimOnCopy.has(photo.slug));
}

await copyOne(
  path.join(sourceAboutDir, aboutPhoto.sourceFile),
  path.join(publicPhotosDir, 'about', 'about-irina.jpg')
);

console.log(`Done: ${photos.length} gallery photos + about copied.`);
