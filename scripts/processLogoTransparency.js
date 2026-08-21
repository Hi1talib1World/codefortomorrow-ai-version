import fs from 'fs';
import { PNG } from 'pngjs';

const sourceMedia = 'C:\\Users\\hicha\\.gemini\\antigravity\\brain\\643d744f-da60-4654-8a87-56b3d004637f\\.user_uploaded\\media_1786918159255.png';

const targetPaths = [
  'C:\\Users\\hicha\\Documents\\GitHub\\codefortomorrow-ai-version\\public\\assets\\code-for-tomorrow-logo.png',
  'C:\\Users\\hicha\\Documents\\GitHub\\codefortomorrow-ai-version\\public\\assets\\images\\logo.png',
  'C:\\Users\\hicha\\Documents\\GitHub\\codefortomorrow-ai-version\\public\\assets\\images\\code-for-tomorrow-logo.png',
  'C:\\Users\\hicha\\Documents\\GitHub\\codefortomorrow-ai-version\\android\\app\\src\\main\\assets\\public\\assets\\images\\logo.png'
];

const srcBuf = fs.readFileSync(sourceMedia);
const png = PNG.sync.read(srcBuf);

let transparentCount = 0;
for (let y = 0; y < png.height; y++) {
  for (let x = 0; x < png.width; x++) {
    const idx = (png.width * y + x) << 2;
    const r = png.data[idx];
    const g = png.data[idx + 1];
    const b = png.data[idx + 2];

    // If pixel is near-white or white (background inside/outside ring)
    if (r > 215 && g > 215 && b > 215) {
      png.data[idx + 3] = 0; // Set Alpha to 0 (Fully Transparent)
      transparentCount++;
    }
  }
}

console.log(`Processed ${transparentCount} white pixels to transparent from media_1786918159255.png!`);

const outBuf = PNG.sync.write(png);

targetPaths.forEach(targetPath => {
  fs.writeFileSync(targetPath, outBuf);
  console.log(`Successfully written transparent logo to: ${targetPath}`);
});
