import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, join, extname } from 'node:path';

const root = resolve('dist');
async function walk(folder) {
  const out = [];
  for (const name of await readdir(folder)) {
    const file = join(folder, name);
    if ((await stat(file)).isDirectory()) out.push(...(await walk(file)));
    else if (extname(file) === '.html') out.push(file);
  }
  return out;
}
const files = await walk(root),
  failures = [];
for (const file of files) {
  const html = await readFile(file, 'utf8');
  for (const match of html.matchAll(/(?:href|src)="(\/[^"?#]*)(?:[^"\s]*)?"/g)) {
    const target = decodeURIComponent(match[1]);
    if (target.startsWith('//')) continue;
    const path = join(root, target);
    let found = false;
    for (const candidate of [path, join(path, 'index.html')]) {
      try {
        if ((await stat(candidate)).isFile()) found = true;
      } catch {}
    }
    if (!found) failures.push(`${file.slice(root.length)} → ${target}`);
  }
  if ((html.match(/<h1[ >]/g) || []).length !== 1)
    failures.push(`${file.slice(root.length)} must have exactly one h1`);
  if (!html.includes('name="description"'))
    failures.push(`${file.slice(root.length)} is missing its description`);
  if (!html.includes('application/ld+json'))
    failures.push(`${file.slice(root.length)} is missing Dentist schema`);
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else
  console.log(
    `PASS: ${files.length} pages; all internal routes and local assets exist; one h1, descriptions and Dentist schema on every page.`,
  );
