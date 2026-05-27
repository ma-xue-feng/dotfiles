#!/usr/bin/env node
/**
 * 图片文字替换工具
 * 在 PNG 图片指定区域用背景色覆盖旧文字，渲染新文字，自动版本号递增保存。
 *
 * 用法:
 *   node replace-text.js --input <path> --new-text <text> [options]
 *
 * 依赖: sharp (npm install -g sharp)
 * 运行: NODE_PATH="$(npm root -g)" node replace-text.js ...
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// ============================================================
// 命令行参数解析
// ============================================================
function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    fontFamily: 'Microsoft YaHei, SimHei, sans-serif',
    fontSize: 15,
    textColor: 'white',
    bgColor: 'rgb(41,87,160)',
    eraseX: 420,
    eraseY: 5,
    eraseWidth: 830,
    eraseHeight: 23,
    textX: 830,
    textY: 22,
    textAnchor: 'middle',
    skipVerify: false,
    input: null,
    oldText: '',
    newText: null,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const next = args[i + 1];
    switch (arg) {
      case '--input':       opts.input = next; i++; break;
      case '--old-text':    opts.oldText = next; i++; break;
      case '--new-text':    opts.newText = next; i++; break;
      case '--font-family': opts.fontFamily = next; i++; break;
      case '--font-size':   opts.fontSize = parseInt(next, 10); i++; break;
      case '--text-color':  opts.textColor = next; i++; break;
      case '--bg-color':    opts.bgColor = next; i++; break;
      case '--erase-x':     opts.eraseX = parseInt(next, 10); i++; break;
      case '--erase-y':     opts.eraseY = parseInt(next, 10); i++; break;
      case '--erase-width': opts.eraseWidth = parseInt(next, 10); i++; break;
      case '--erase-height':opts.eraseHeight = parseInt(next, 10); i++; break;
      case '--text-x':      opts.textX = parseInt(next, 10); i++; break;
      case '--text-y':      opts.textY = parseInt(next, 10); i++; break;
      case '--text-anchor': opts.textAnchor = next; i++; break;
      case '--skip-verify': opts.skipVerify = true; break;
      case '--help':
        console.log(`
图片文字替换工具

用法: node replace-text.js --input <path> --new-text <text> [options]

必需参数:
  --input <path>        原图路径
  --new-text <text>     新文字内容

可选参数:
  --old-text <text>     旧文字（记录用，不影响处理）
  --font-family <str>   CSS 字体名 (默认: Microsoft YaHei, SimHei, sans-serif)
  --font-size <num>     字号 px (默认: 15)
  --text-color <css>    文字颜色 (默认: white)
  --bg-color <css>      背景色 (默认: rgb(41,87,160))
  --erase-x <num>       覆盖区 X (默认: 420)
  --erase-y <num>       覆盖区 Y (默认: 5)
  --erase-width <num>   覆盖区宽度 (默认: 830)
  --erase-height <num>  覆盖区高度 (默认: 23)
  --text-x <num>        文字锚点 X (默认: 830)
  --text-y <num>        文字基线 Y (默认: 22)
  --text-anchor <str>   对齐: start|middle|end (默认: middle)
  --skip-verify         跳过 vision.js 验证
`);
        process.exit(0);
      default:
        break;
    }
  }

  if (!opts.input) {
    console.error('错误: 缺少 --input 参数');
    process.exit(1);
  }
  if (!opts.newText) {
    console.error('错误: 缺少 --new-text 参数');
    process.exit(1);
  }

  return opts;
}

// ============================================================
// 版本号管理
// ============================================================
function getNextVersion(inputPath) {
  const dir = path.dirname(inputPath);
  const ext = path.extname(inputPath);
  const baseName = path.basename(inputPath, ext);

  // 查找同目录下已有的版本文件
  // 匹配模式: {baseName} -{major}.{minor}{ext}
  const escapedBase = escapeRegex(baseName);
  const escapedExt = escapeRegex(ext);
  const patternStr = `^${escapedBase}\\s*-\\s*(\\d+)\\.(\\d+)${escapedExt}$`;
  const versionPattern = new RegExp(patternStr);

  let maxMajor = 0, maxMinor = -1;
  let found = false;

  try {
    const files = fs.readdirSync(dir);
    for (const f of files) {
      const match = f.match(versionPattern);
      if (match) {
        found = true;
        const major = parseInt(match[1], 10);
        const minor = parseInt(match[2], 10);
        if (major > maxMajor || (major === maxMajor && minor > maxMinor)) {
          maxMajor = major;
          maxMinor = minor;
        }
      }
    }
  } catch (e) {
    // 目录不存在或不可读，从 1.0 开始
  }

  if (!found) return { major: 1, minor: 0 };
  return { major: maxMajor, minor: maxMinor + 1 };
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildOutputPath(inputPath, major, minor) {
  const dir = path.dirname(inputPath);
  const ext = path.extname(inputPath);
  const baseName = path.basename(inputPath, ext);
  return path.join(dir, `${baseName} -${major}.${minor}${ext}`);
}

// ============================================================
// 核心处理
// ============================================================
async function processImage(opts) {
  const { major, minor } = getNextVersion(opts.input);
  const outputPath = buildOutputPath(opts.input, major, minor);

  console.log(`输入: ${opts.input}`);
  console.log(`输出: ${outputPath}`);
  console.log(`版本: ${major}.${minor}`);
  console.log(`新文字: "${opts.newText}"`);

  const metadata = await sharp(opts.input).metadata();
  console.log(`尺寸: ${metadata.width} x ${metadata.height}`);

  // 构建 SVG overlay
  const svgOverlay = `<svg width="${metadata.width}" height="${metadata.height}">
  <rect x="${opts.eraseX}" y="${opts.eraseY}"
        width="${opts.eraseWidth}" height="${opts.eraseHeight}"
        fill="${opts.bgColor}" />
  <text x="${opts.textX}" y="${opts.textY}"
        font-family="${opts.fontFamily}"
        font-size="${opts.fontSize}"
        fill="${opts.textColor}"
        text-anchor="${opts.textAnchor}">${escapeXml(opts.newText)}</text>
</svg>`;

  await sharp(opts.input)
    .composite([{
      input: Buffer.from(svgOverlay),
      top: 0,
      left: 0,
    }])
    .png()
    .toFile(outputPath);

  console.log('✓ 图片已保存');

  const outMeta = await sharp(outputPath).metadata();
  console.log(`  输出尺寸: ${outMeta.width} x ${outMeta.height}`);

  return { outputPath, major, minor };
}

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// ============================================================
// 验证（可选）
// ============================================================
async function verifyResult(outputPath, opts) {
  const visionScript = path.join(
    process.env.HOME || process.env.USERPROFILE || '',
    '.claude',
    'skills',
    'vision',
    'vision.js'
  );

  if (!fs.existsSync(visionScript)) {
    console.log('⚠ vision.js 未找到，跳过验证');
    console.log(`  期望路径: ${visionScript}`);
    return;
  }

  console.log('\n--- Vision 验证 ---');
  const { execSync } = require('child_process');
  try {
    const result = execSync(
      `node "${visionScript}" "${outputPath}" "请检查：1)图片顶部蓝色标题栏中是否有'${opts.newText}'文字？2)字体大小和颜色是否与周围文字一致？3)是否有任何覆盖错误或残留痕迹？"`,
      { encoding: 'utf-8', timeout: 30000, stdio: ['pipe', 'pipe', 'pipe'] }
    );
    console.log(result);
  } catch (e) {
    console.log('验证请求已发送（超时或输出过长已截断）');
    if (e.stdout) console.log(e.stdout.substring(0, 500));
  }
}

// ============================================================
// 主入口
// ============================================================
async function main() {
  const opts = parseArgs();
  const { outputPath, major, minor } = await processImage(opts);

  if (!opts.skipVerify) {
    await verifyResult(outputPath, opts);
  }

  console.log(`\n完成! 输出: ${outputPath}`);
}

main().catch(e => {
  console.error('错误:', e.message);
  process.exit(1);
});
