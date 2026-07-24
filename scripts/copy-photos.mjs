import { mkdir, readdir, rename } from 'node:fs/promises';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import {
  UNCATEGORIZED_CATEGORY,
  aboutPhoto,
  rotateOnCopy,
  trimOnCopy,
  slugPrefixOverrides,
  altOverrides,
} from '../data/photos.ts';
import { categoryLabels } from '../data/categoryLabels.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const sourceDir = path.join(root, 'assets', 'source-photos');
const sourceAboutDir = path.join(root, 'assets', 'source-about');
const publicPhotosDir = path.join(root, 'public', 'photos');

const IMAGE_EXT = /\.(jpe?g|png)$/i;

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
  const info = await pipeline.toFile(destPath);
  console.log(`copied ${path.relative(root, destPath)}${notes.length ? ` (${notes.join(', ')})` : ''}`);
  return { width: info.width, height: info.height };
}

async function listCategoryFolders() {
  const entries = await readdir(sourceDir, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory() && !e.name.startsWith('.'))
    .map((e) => e.name)
    .sort();
}

// ANY_SLUG_PATTERN recognizes an already-assigned slug regardless of its
// prefix word (e.g. `fashion-01.jpg`) — used for the root scan, where
// pre-existing slugs may carry a prefix that has nothing to do with the
// reserved "uncategorized" assignment prefix for genuinely new drops.
const ANY_SLUG_PATTERN = /^[a-z][a-z-]*-(\d+)\.(jpe?g|png)$/i;

/**
 * Scans one folder for images, assigns stable slugs (recognizing existing
 * `<prefix>-<number>` filenames as already-assigned, renaming only new
 * ones), copies each into public/photos/<categoryId>/, and returns the
 * generated Photo entries.
 *
 * @param folderPath directory to scan
 * @param categoryId value stamped on Photo.category and used as the
 *   public/photos/<categoryId>/ output folder name
 * @param assignPrefix slug prefix used only when assigning a NEW slug
 * @param recognizeAnyPrefix if true, any existing `<word>-<number>` name is
 *   treated as already-assigned (used for the root/uncategorized scan,
 *   where pre-existing slugs may use a different prefix than assignPrefix);
 *   if false, only `<assignPrefix>-<number>` counts as already-assigned
 */
async function scanFolder(folderPath, categoryId, assignPrefix, recognizeAnyPrefix) {
  const entries = (await readdir(folderPath)).filter((name) => IMAGE_EXT.test(name)).sort();

  const recognizePattern = recognizeAnyPrefix
    ? ANY_SLUG_PATTERN
    : new RegExp(`^${assignPrefix}-(\\d+)\\.(jpe?g|png)$`, 'i');
  const assignNumberPattern = new RegExp(`^${assignPrefix}-(\\d+)\\.(jpe?g|png)$`, 'i');
  let nextNumber = 1;
  for (const name of entries) {
    const match = name.match(assignNumberPattern);
    if (match) nextNumber = Math.max(nextNumber, Number(match[1]) + 1);
  }

  const resolved = [];
  for (const name of entries) {
    const match = name.match(recognizePattern);
    if (match) {
      const slugPrefix = recognizeAnyPrefix ? name.slice(0, name.lastIndexOf('-')) : assignPrefix;
      resolved.push({ slug: `${slugPrefix}-${match[1]}`, fileName: name });
      continue;
    }
    const ext = path.extname(name).toLowerCase();
    const slug = `${assignPrefix}-${String(nextNumber).padStart(2, '0')}`;
    const newName = `${slug}${ext}`;
    await rename(path.join(folderPath, name), path.join(folderPath, newName));
    console.log(`renamed ${path.relative(sourceDir, path.join(folderPath, name))} -> ${path.relative(sourceDir, path.join(folderPath, newName))}`);
    resolved.push({ slug, fileName: newName });
    nextNumber += 1;
  }

  const generated = [];
  for (const { slug, fileName } of resolved) {
    const src = path.join(folderPath, fileName);
    const dest = path.join(publicPhotosDir, categoryId, `${slug}.jpg`);
    const { width, height } = await copyOne(src, dest, rotateOnCopy[slug], trimOnCopy.has(slug));
    const fallback = categoryLabels[categoryId] ?? { ru: categoryId, en: categoryId };
    const alt = altOverrides[slug] ?? fallback;
    generated.push({ slug, category: categoryId, sourceFile: fileName, width, height, alt });
  }
  return generated;
}

function formatPhotoLiteral(photo) {
  const alt = `{ ru: ${JSON.stringify(photo.alt.ru)}, en: ${JSON.stringify(photo.alt.en)} }`;
  return `  { slug: ${JSON.stringify(photo.slug)}, category: ${JSON.stringify(photo.category)}, sourceFile: ${JSON.stringify(photo.sourceFile)}, width: ${photo.width}, height: ${photo.height}, alt: ${alt} },`;
}

function writeGeneratedFile(generated) {
  const header = `// AUTO-GENERATED by \`npm run copy-photos\` — do not hand-edit.
// Source of truth is the folder layout under assets/source-photos/.
// See docs/superpowers/specs/2026-07-24-photo-folder-categorization-design.md
import type { Photo } from './photos';

export const generatedPhotos: Photo[] = [
`;
  const body = generated.map(formatPhotoLiteral).join('\n');
  const footer = `\n];\n`;
  writeFileSync(path.join(root, 'data', 'photos.generated.ts'), header + body + footer);
  console.log(`wrote data/photos.generated.ts (${generated.length} photos)`);
}

const generatedPhotos = [];

// Loose files in the root of assets/source-photos/ (not inside any category
// subfolder) still appear on the site — just uncategorized, never as their
// own filter pill (see lib/galleryFilters.ts).
generatedPhotos.push(
  ...(await scanFolder(sourceDir, UNCATEGORIZED_CATEGORY, UNCATEGORIZED_CATEGORY, true))
);

const categoryFolders = await listCategoryFolders();
for (const categoryId of categoryFolders) {
  const prefix = slugPrefixOverrides[categoryId] ?? categoryId;
  generatedPhotos.push(...(await scanFolder(path.join(sourceDir, categoryId), categoryId, prefix, false)));
}
writeGeneratedFile(generatedPhotos);

await copyOne(
  path.join(sourceAboutDir, aboutPhoto.sourceFile),
  path.join(publicPhotosDir, 'about', 'about-irina.jpg')
);

console.log(`Done: ${generatedPhotos.length} gallery photos + about copied.`);
