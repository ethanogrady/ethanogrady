import { mkdir, readdir, rm, stat } from "node:fs/promises";
import { dirname, join, parse } from "node:path";
import sharp from "sharp";

const SOURCE_DIR = "assets/projects";
const OUTPUT_DIR = "public/projects";
const WIDTHS = [256, 384, 640, 1200, 2048];
const QUALITY = 72;
const CONCURRENCY = 6;

async function collectSources() {
  const jobs = [];
  for (const slug of (await readdir(SOURCE_DIR, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()) {
    for (const file of (await readdir(join(SOURCE_DIR, slug))).sort()) {
      if (!/\.(jpe?g|png|tiff?|webp)$/i.test(file)) continue;
      jobs.push({
        source: join(SOURCE_DIR, slug, file),
        base: join(OUTPUT_DIR, slug, parse(file).name),
      });
    }
  }
  return jobs;
}

async function renderVariants({ source, base }) {
  await mkdir(dirname(base), { recursive: true });
  const pipeline = sharp(source, { failOn: "none" }).rotate();

  let written = 0;
  for (const target of WIDTHS) {
    await pipeline
      .clone()
      .resize({ width: target, withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 5 })
      .toFile(`${base}-${target}.webp`);
    written += 1;
  }
  return written;
}

async function main() {
  await rm(OUTPUT_DIR, { recursive: true, force: true });
  const jobs = await collectSources();

  let done = 0;
  let files = 0;
  const queue = jobs[Symbol.iterator]();

  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      for (const job of queue) {
        const written = await renderVariants(job);
        files += written;
        done += 1;
        if (done % 25 === 0 || done === jobs.length) {
          process.stdout.write(`\r${done}/${jobs.length} images, ${files} files`);
        }
      }
    }),
  );

  let bytes = 0;
  const walk = async (dir) => {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) await walk(path);
      else bytes += (await stat(path)).size;
    }
  };
  await walk(OUTPUT_DIR);

  process.stdout.write(
    `\ndone: ${files} files, ${(bytes / 1024 / 1024).toFixed(0)} MB\n`,
  );
}

await main();
