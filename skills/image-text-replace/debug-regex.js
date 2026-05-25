const fs = require('fs');
const path = require('path');

const inputPath = 'C:/Users/maxf/Desktop/产品审计材料/其他/图片素材/参数优化-三维显示.png';
const dir = path.dirname(inputPath);
const ext = path.extname(inputPath);
const baseName = path.basename(inputPath, ext);

console.log('dir:', dir);
console.log('ext:', ext);
console.log('baseName:', baseName);

const files = fs.readdirSync(dir);
const filtered = files.filter(f => f.includes(baseName));
console.log('all matching files:', filtered);

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
const escaped = escapeRegex(baseName);
console.log('escaped baseName:', escaped);

const patternStr = `^${escaped}\\s*-\\s*(\\d+)\\.(\\d+)\\${escapeRegex(ext)}$`;
console.log('pattern string:', patternStr);

const pattern = new RegExp(patternStr);
console.log('regex:', pattern);

for (const f of filtered) {
  const m = f.match(pattern);
  console.log(`file: "${f}" → match:`, m);
  if (m) console.log(`  major=${m[1]}, minor=${m[2]}`);
}
