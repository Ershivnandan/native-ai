const sharp = require("sharp");
const path = require("path");

const BADGE_TEXT = process.argv[2] || "STAGING";
const INPUT_ICON = path.resolve(__dirname, "../assets/AppIcon.png");
const OUTPUT_ICON = path.resolve(__dirname, "../assets/AppIcon-badged.png");

async function badgeIcon() {
  const size = 1024;
  const bannerHeight = 200;
  const fontSize = 100;

  const svgBanner = `
    <svg width="${size}" height="${size}">
      <rect x="0" y="${size - bannerHeight}" width="${size}" height="${bannerHeight}" fill="rgba(255, 60, 60, 0.9)" rx="0"/>
      <text
        x="${size / 2}"
        y="${size - bannerHeight / 2 + fontSize / 3}"
        font-family="Arial, sans-serif"
        font-size="${fontSize}"
        font-weight="bold"
        fill="white"
        text-anchor="middle"
      >${BADGE_TEXT}</text>
    </svg>
  `;

  await sharp(INPUT_ICON)
    .composite([
      {
        input: Buffer.from(svgBanner),
        top: 0,
        left: 0,
      },
    ])
    .toFile(OUTPUT_ICON);

  console.log(`Badge "${BADGE_TEXT}" applied to icon → ${OUTPUT_ICON}`);
}

badgeIcon().catch((err) => {
  console.error("Failed to badge icon:", err);
  process.exit(1);
});
