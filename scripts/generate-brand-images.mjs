import { readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";

const { ImageResponse } = createRequire(import.meta.url)("next/og");

const WORDMARK = "Ethan O’Grady";
const INITIALS = "EO";
const BLACK = "#000";
const WHITE = "#fff";

const CAP_CENTRE_OFFSET = 0.168;

const font = await readFile("lib/fonts/newsreader-400.ttf");
const fonts = [{ name: "Newsreader", data: font, weight: 400, style: "normal" }];

function centredCaps(fontSize, letterSpacing) {
  return {
    fontSize,
    lineHeight: 1,
    letterSpacing: `${letterSpacing}em`,
    paddingTop: fontSize * CAP_CENTRE_OFFSET,
    paddingLeft: fontSize * letterSpacing,
  };
}

async function render(element, width, height) {
  const response = new ImageResponse(element, { width, height, fonts });
  return Buffer.from(await response.arrayBuffer());
}

function wordmarkImage() {
  return {
    type: "div",
    props: {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: WHITE,
        color: BLACK,
        fontFamily: "Newsreader",
      },
      children: {
        type: "div",
        props: {
          style: centredCaps(96, 0.09),
          children: WORDMARK.toUpperCase(),
        },
      },
    },
  };
}

function initialsImage(size) {
  return {
    type: "div",
    props: {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: BLACK,
        color: WHITE,
        fontFamily: "Newsreader",
      },
      children: {
        type: "div",
        props: {
          style: centredCaps(size * 0.5, 0.02),
          children: INITIALS,
        },
      },
    },
  };
}

function icoFromPng(png) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);

  const entry = Buffer.alloc(16);
  entry.writeUInt8(32, 0);
  entry.writeUInt8(32, 1);
  entry.writeUInt8(0, 2);
  entry.writeUInt8(0, 3);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(header.length + entry.length, 12);

  return Buffer.concat([header, entry, png]);
}

const outputs = [
  ["app/opengraph-image.png", wordmarkImage(), 1200, 630],
  ["app/icon.png", initialsImage(512), 512, 512],
  ["app/apple-icon.png", initialsImage(180), 180, 180],
];

for (const [path, element, width, height] of outputs) {
  const png = await render(element, width, height);
  await writeFile(path, png);
  console.log(`${path}  ${width}x${height}  ${(png.length / 1024).toFixed(1)} KB`);
}

const small = await render(initialsImage(32), 32, 32);
await writeFile("app/favicon.ico", icoFromPng(small));
console.log(`app/favicon.ico  32x32  ${(small.length / 1024).toFixed(1)} KB`);
