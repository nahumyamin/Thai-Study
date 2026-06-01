// Converts SVG assets in public/ to PNG for social sharing and PWA icons.
// Run with: node scripts/generate-images.js
import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function svgToPng(inputPath, outputPath, width, height) {
  const svg = readFileSync(inputPath, 'utf8');
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: width },
    background: '#18181b',
  });
  const rendered = resvg.render();
  const png = rendered.asPng();
  writeFileSync(outputPath, png);
  console.log(`✓  ${outputPath} (${width}×${rendered.height}px)`);
}

svgToPng(
  resolve(root, 'public/og-image.svg'),
  resolve(root, 'public/og-image.png'),
  1200, 630,
);

svgToPng(
  resolve(root, 'public/icon-192.svg'),
  resolve(root, 'public/icon-192.png'),
  192, 192,
);

svgToPng(
  resolve(root, 'public/icon-512.svg'),
  resolve(root, 'public/icon-512.png'),
  512, 512,
);
