import { copyFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { photos, aboutPhoto, commercialPhoto } from '../data/photos.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const sourceDir = path.join(root, 'assets', 'source-photos');
const sourceAboutDir = path.join(root, 'assets', 'source-about');
const publicPhotosDir = path.join(root, 'public', 'photos');

async function copyOne(sourcePath, destPath) {
  await mkdir(path.dirname(destPath), { recursive: true });
  await copyFile(sourcePath, destPath);
  console.log(`copied ${path.relative(root, destPath)}`);
}

for (const photo of photos) {
  const src = path.join(sourceDir, photo.sourceFile);
  const dest = path.join(publicPhotosDir, photo.category, `${photo.slug}.jpg`);
  if (!existsSync(src)) throw new Error(`missing source file: ${src}`);
  await copyOne(src, dest);
}

await copyOne(
  path.join(sourceAboutDir, aboutPhoto.sourceFile),
  path.join(publicPhotosDir, 'about', 'about-irina.jpg')
);

await copyOne(
  path.join(sourceDir, commercialPhoto.sourceFile),
  path.join(publicPhotosDir, 'commercial', 'commercial-01.jpg')
);

console.log(`Done: ${photos.length} gallery photos + about + commercial copied.`);
