import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Standard SVG Icon (512x512 with safe padding)
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0e1424" />
      <stop offset="50%" stop-color="#0a0d16" />
      <stop offset="100%" stop-color="#05070b" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFE082" />
      <stop offset="35%" stop-color="#FFD54F" />
      <stop offset="70%" stop-color="#FFB300" />
      <stop offset="100%" stop-color="#D4AF37" />
    </linearGradient>
    <linearGradient id="redGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF5252" />
      <stop offset="100%" stop-color="#D32F2F" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background Canvas -->
  <rect width="512" height="512" rx="100" fill="url(#bgGrad)" />

  <!-- Outer Elegant Gold Ring -->
  <circle cx="256" cy="256" r="210" fill="none" stroke="url(#goldGrad)" stroke-width="4" stroke-opacity="0.4" stroke-dasharray="10 6" />
  <circle cx="256" cy="256" r="195" fill="none" stroke="url(#goldGrad)" stroke-width="2" stroke-opacity="0.8" />

  <!-- Sound Waves Aura -->
  <path d="M120 256 C120 220, 135 185, 160 160" fill="none" stroke="url(#goldGrad)" stroke-width="5" stroke-linecap="round" stroke-opacity="0.5" />
  <path d="M392 256 C392 220, 377 185, 352 160" fill="none" stroke="url(#goldGrad)" stroke-width="5" stroke-linecap="round" stroke-opacity="0.5" />
  <path d="M95 256 C95 200, 115 150, 150 120" fill="none" stroke="url(#goldGrad)" stroke-width="4" stroke-linecap="round" stroke-opacity="0.25" />
  <path d="M417 256 C417 200, 397 150, 362 120" fill="none" stroke="url(#goldGrad)" stroke-width="4" stroke-linecap="round" stroke-opacity="0.25" />

  <!-- Studio Microphone Icon Body -->
  <g transform="translate(256, 215)">
    <!-- Top Capsule Grid -->
    <rect x="-36" y="-85" width="72" height="105" rx="36" fill="url(#goldGrad)" filter="url(#glow)" />
    <!-- Capsule Details -->
    <line x1="-36" y1="-45" x2="36" y2="-45" stroke="#0a0d16" stroke-width="3" />
    <line x1="-36" y1="-20" x2="36" y2="-20" stroke="#0a0d16" stroke-width="3" />
    <line x1="0" y1="-85" x2="0" y2="20" stroke="#0a0d16" stroke-width="2.5" />

    <!-- U-Shaped Mic Bracket -->
    <path d="M -54,-25 C -54,42 54,42 54,-25" fill="none" stroke="url(#goldGrad)" stroke-width="8" stroke-linecap="round" />

    <!-- Mic Stem -->
    <line x1="0" y1="38" x2="0" y2="78" stroke="url(#goldGrad)" stroke-width="9" stroke-linecap="round" />
    <!-- Mic Base Stand -->
    <path d="M -42,78 L 42,78" stroke="url(#goldGrad)" stroke-width="8" stroke-linecap="round" />
  </g>

  <!-- Crown on Top of Mic -->
  <g transform="translate(256, 105) scale(0.9)">
    <path d="M-28,10 L-38,-15 L-12,-2 L0,-25 L12,-2 L38,-15 L28,10 Z" fill="url(#goldGrad)" filter="url(#glow)" />
    <circle cx="0" cy="-25" r="3.5" fill="#FFF" />
    <circle cx="-38" cy="-15" r="3" fill="#FFF" />
    <circle cx="38" cy="-15" r="3" fill="#FFF" />
  </g>

  <!-- YONA Brand Text -->
  <text x="256" y="380" font-family="'Cairo', 'Tajawal', sans-serif" font-size="44" font-weight="900" fill="url(#goldGrad)" text-anchor="middle" letter-spacing="4" filter="url(#glow)">
    YONA SONGS
  </text>

  <!-- Vocals Only Pill Badge -->
  <g transform="translate(256, 420)">
    <rect x="-75" y="-16" width="150" height="32" rx="16" fill="url(#redGrad)" />
    <text x="0" y="5" font-family="'Cairo', 'Tajawal', sans-serif" font-size="14" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">
      VOCALS ONLY
    </text>
  </g>
</svg>`;

// Write SVG
fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent, 'utf8');

// Generate PNGs with sharp
async function generateIcons() {
  const svgBuffer = Buffer.from(svgContent);

  // 192x192
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));
  console.log('Generated pwa-192x192.png');

  // 512x512
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));
  console.log('Generated pwa-512x512.png');

  // 512x512 Maskable (add safe area padding: 410x410 inside 512x512 with solid background)
  const paddedIcon = await sharp(svgBuffer)
    .resize(410, 410)
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 10, g: 13, b: 22, alpha: 1 }
    }
  })
    .composite([{ input: paddedIcon, gravity: 'centre' }])
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  console.log('Generated pwa-maskable-512x512.png');

  // apple-touch-icon 180x180
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Generated apple-touch-icon.png');

  // favicon.ico (64x64 png fallback)
  await sharp(svgBuffer)
    .resize(64, 64)
    .png()
    .toFile(path.join(publicDir, 'favicon.ico'));
  console.log('Generated favicon.ico');
}

generateIcons().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
