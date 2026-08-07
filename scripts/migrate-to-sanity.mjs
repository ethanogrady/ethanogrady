import { readFile, stat } from "node:fs/promises";
import { basename } from "node:path";
import { createClient } from "@sanity/client";
import { LexoRank } from "lexorank";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  throw new Error("Run with: node --env-file=.env.local scripts/migrate-to-sanity.mjs");
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-10-01",
  useCdn: false,
});

const UPLOAD_CONCURRENCY = 5;
const SOURCE_WIDTH = 2048;

function parseProjects(source) {
  return source
    .split(/\n {2}\{\n/)
    .slice(1)
    .map((block) => {
      const assetsBlock = block.slice(block.indexOf("assets: ["));
      return {
        slug: block.match(/slug: "([^"]+)"/)?.[1],
        title: block.match(/title: "([^"]+)"/)?.[1],
        year: Number(block.match(/year: (\d+)/)?.[1]),
        cover: block.match(/cover: \{ src: "([^"]+)"/)?.[1],
        images: [...assetsBlock.matchAll(/\{ src: "([^"]+)"/g)].map(
          (match) => match[1],
        ),
      };
    });
}

function localPath(src) {
  return `public${src}-${SOURCE_WIDTH}.webp`;
}

async function uploadAll(paths) {
  const uploaded = new Map();
  const queue = paths[Symbol.iterator]();
  let done = 0;

  await Promise.all(
    Array.from({ length: UPLOAD_CONCURRENCY }, async () => {
      for (const src of queue) {
        const file = localPath(src);
        await stat(file);
        const asset = await client.assets.upload("image", await readFile(file), {
          filename: `${basename(src)}.webp`,
        });
        uploaded.set(src, asset._id);
        done += 1;
        process.stdout.write(`\ruploaded ${done}/${paths.length}`);
      }
    }),
  );

  process.stdout.write("\n");
  return uploaded;
}

function imageRef(assetId, key) {
  return {
    _type: "image",
    ...(key ? { _key: key } : {}),
    asset: { _type: "reference", _ref: assetId },
  };
}

async function main() {
  const source = await readFile("lib/projects.ts", "utf8");
  const projects = parseProjects(source);
  if (projects.length === 0) throw new Error("No projects parsed");

  const unique = [
    ...new Set(projects.flatMap((p) => [p.cover, ...p.images])),
  ];
  console.log(`${projects.length} projects, ${unique.length} unique images`);

  const assets = await uploadAll(unique);

  let rank = LexoRank.min();
  const documents = projects.map((project) => {
    rank = rank.genNext();
    return {
      _id: `project-${project.slug}`,
      _type: "project",
      title: project.title,
      slug: { _type: "slug", current: project.slug },
      year: project.year,
      cover: imageRef(assets.get(project.cover)),
      images: project.images.map((src, index) =>
        imageRef(assets.get(src), `img${index}`),
      ),
      orderRank: rank.toString(),
    };
  });

  const transaction = client.transaction();
  for (const doc of documents) transaction.createOrReplace(doc);
  await transaction.commit();
  console.log(`wrote ${documents.length} project documents`);

  const portrait = projects
    .find((p) => p.slug === "studio-n-and-tl")
    ?.images.find((src) => src.includes("portrait-004"));

  await client.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    wordmark: "Ethan O’Grady",
    description:
      "Photographer working across interiors, fashion, and editorial. New York.",
    statement:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    notes: [
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
    ],
    portrait: portrait ? imageRef(assets.get(portrait)) : undefined,
    basedIn: ["New York", "Available worldwide"],
    email: "eogrady123@gmail.com",
    socials: [
      {
        _type: "social",
        _key: "instagram",
        label: "Instagram",
        url: "https://www.instagram.com/ethan__ogrady/",
      },
      {
        _type: "social",
        _key: "linkedin",
        label: "LinkedIn",
        url: "https://www.linkedin.com/in/ethan-ogrady/",
      },
    ],
  });
  console.log("wrote siteSettings");
}

await main();
