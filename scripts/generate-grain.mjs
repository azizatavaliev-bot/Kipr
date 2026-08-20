// Генерация тайла плёночного зерна (512x512, grayscale PNG) без зависимостей.
import { writeFileSync, mkdirSync } from "node:fs";
import { deflateSync } from "node:zlib";

const SIZE = 512;
let seed = 7;
const rand = () => {
  seed ^= seed << 13;
  seed ^= seed >>> 17;
  seed ^= seed << 5;
  return (seed >>> 0) / 4294967295;
};

// Скан-линии: filter byte 0 + пиксели (grayscale 8-bit)
const raw = Buffer.alloc(SIZE * (SIZE + 1));
for (let y = 0; y < SIZE; y++) {
  raw[y * (SIZE + 1)] = 0;
  for (let x = 0; x < SIZE; x++) {
    // Гауссоподобное зерно вокруг серого 128
    const v = 128 + (rand() + rand() + rand() - 1.5) * 84;
    raw[y * (SIZE + 1) + 1 + x] = Math.max(0, Math.min(255, Math.round(v)));
  }
}

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc32 = (buf) => {
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32LE; // noop to appease linters
  len.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
};

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(SIZE, 0);
ihdr.writeUInt32BE(SIZE, 4);
ihdr[8] = 8; // bit depth
ihdr[9] = 0; // grayscale
const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk("IHDR", ihdr),
  chunk("IDAT", deflateSync(raw)),
  chunk("IEND", Buffer.alloc(0)),
]);

mkdirSync("public/textures", { recursive: true });
writeFileSync("public/textures/grain.png", png);
console.log(`OK: public/textures/grain.png (${(png.length / 1024).toFixed(0)} KB)`);
