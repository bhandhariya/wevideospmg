import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer-core'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const inputDir = path.join(rootDir, 'radha_oridinal_cast')
const outputDir = path.join(rootDir, 'assets', 'paper', 'cast_radha_real')

function getChromePath() {
  const possiblePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  ]
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p
  }
  throw new Error('Could not find Google Chrome or Microsoft Edge.')
}

// Clean and standardize filename
function cleanName(rawFilename, index) {
  const base = path.basename(rawFilename, path.extname(rawFilename))
  // Remove trailing hex hash like _84d55d27
  let clean = base.replace(/(\.jpe?g)?_[a-f0-9]{8}$/i, '')
  clean = clean
    .replace(/^(Person|Woman|Lady|Figure|Dancer|Girl)_/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')

  const numStr = String(index + 1).padStart(3, '0')
  return `radha_${numStr}_${clean || 'pose'}.png`
}

async function main() {
  if (!fs.existsSync(inputDir)) {
    console.error(`Input directory not found: ${inputDir}`)
    process.exit(1)
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  const files = fs
    .readdirSync(inputDir)
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
    .sort()

  console.log(`\n======================================================`)
  console.log(`🌸 RADHA REAL CAST TRANSPARENT PNG CONVERTER`)
  console.log(`======================================================`)
  console.log(`Found ${files.length} images to process in radha_oridinal_cast/`)
  console.log(`Output folder: assets/paper/cast_radha_real/\n`)

  const chromePath = getChromePath()
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu', '--use-gl=swiftshader'],
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 2048, height: 2048 })

  const manifest = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const inputFilePath = path.join(inputDir, file)
    const newFileName = cleanName(file, i)
    const outputFilePath = path.join(outputDir, newFileName)

    const base64Data = fs.readFileSync(inputFilePath).toString('base64')
    const mime = file.endsWith('.png') ? 'image/png' : 'image/jpeg'
    const dataUrl = `data:${mime};base64,${base64Data}`

    // Process image inside headless browser with flood-fill & soft alpha feathering
    const pngDataUrl = await page.evaluate(async (srcUrl) => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => {
          const w = img.naturalWidth || img.width
          const h = img.naturalHeight || img.height
          const canvas = document.createElement('canvas')
          canvas.width = w
          canvas.height = h
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0)

          const imgData = ctx.getImageData(0, 0, w, h)
          const data = imgData.data

          // Sample neutral studio background color from corners
          let bgR = 0, bgG = 0, bgB = 0, sampleCount = 0
          const sampleBox = (sx, sy, size) => {
            for (let y = sy; y < sy + size && y < h; y++) {
              for (let x = sx; x < sx + size && x < w; x++) {
                const idx = (y * w + x) * 4
                bgR += data[idx]
                bgG += data[idx + 1]
                bgB += data[idx + 2]
                sampleCount++
              }
            }
          }

          sampleBox(0, 0, 15)
          sampleBox(w - 15, 0, 15)
          sampleBox(0, h - 15, 15)
          sampleBox(w - 15, h - 15, 15)

          bgR /= sampleCount
          bgG /= sampleCount
          bgB /= sampleCount

          // Flood-fill BFS starting from perimeter edges
          const visited = new Uint8Array(w * h)
          const queue = new Int32Array(w * h)
          let qHead = 0, qTail = 0

          const isStudioBg = (idx4) => {
            const r = data[idx4]
            const g = data[idx4 + 1]
            const b = data[idx4 + 2]
            const lum = 0.299 * r + 0.587 * g + 0.114 * b
            const maxDiff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b))
            const distFromBg = Math.sqrt((r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2)

            // Studio white/light grey: high luminance, neutral saturation, close to sampled bg
            return (lum > 215 && maxDiff < 20) || (distFromBg < 35 && lum > 195)
          }

          // Push outer borders to queue
          for (let x = 0; x < w; x++) {
            if (isStudioBg(x * 4)) {
              visited[x] = 1
              queue[qTail++] = x
            }
            const btmIdx = ((h - 1) * w + x) * 4
            if (isStudioBg(btmIdx)) {
              visited[(h - 1) * w + x] = 1
              queue[qTail++] = (h - 1) * w + x
            }
          }

          for (let y = 0; y < h; y++) {
            const leftIdx = y * w * 4
            if (!visited[y * w] && isStudioBg(leftIdx)) {
              visited[y * w] = 1
              queue[qTail++] = y * w
            }
            const rightIdx = (y * w + (w - 1)) * 4
            if (!visited[y * w + (w - 1)] && isStudioBg(rightIdx)) {
              visited[y * w + (w - 1)] = 1
              queue[qTail++] = y * w + (w - 1)
            }
          }

          // Run BFS flood fill
          while (qHead < qTail) {
            const curr = queue[qHead++]
            const cx = curr % w
            const cy = Math.floor(curr / w)

            const neighbors = [
              cx > 0 ? curr - 1 : -1,
              cx < w - 1 ? curr + 1 : -1,
              cy > 0 ? curr - w : -1,
              cy < h - 1 ? curr + w : -1,
            ]

            for (let k = 0; k < 4; k++) {
              const n = neighbors[k]
              if (n !== -1 && !visited[n]) {
                if (isStudioBg(n * 4)) {
                  visited[n] = 1
                  queue[qTail++] = n
                }
              }
            }
          }

          // Apply clean alpha & edge anti-aliasing
          for (let idx = 0; idx < w * h; idx++) {
            const px = idx * 4
            if (visited[idx]) {
              data[px + 3] = 0 // Pure transparent
            } else {
              // Edge smoothing
              const r = data[px]
              const g = data[px + 1]
              const b = data[px + 2]
              const lum = 0.299 * r + 0.587 * g + 0.114 * b
              const dist = Math.sqrt((r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2)

              if (lum > 225 && dist < 35) {
                const alpha = Math.min(255, Math.max(0, ((35 - dist) / 35) * 255))
                data[px + 3] = Math.round(255 - alpha * 0.7)
              }
            }
          }

          ctx.putImageData(imgData, 0, 0)
          resolve(canvas.toDataURL('image/png'))
        }
        img.onerror = reject
        img.src = srcUrl
      })
    }, dataUrl)

    // Save PNG buffer
    const base64Png = pngDataUrl.replace(/^data:image\/png;base64,/, '')
    fs.writeFileSync(outputFilePath, Buffer.from(base64Png, 'base64'))

    manifest.push({
      index: i + 1,
      original: file,
      filename: newFileName,
      path: `/assets/paper/cast_radha_real/${newFileName}`,
    })

    const progress = `[${String(i + 1).padStart(3, '0')}/${files.length}]`
    console.log(`${progress} ✓ ${newFileName}`)
  }

  await browser.close()

  // Save manifest
  const manifestPath = path.join(outputDir, 'radha_real_manifest.json')
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))

  console.log(`\n🎉 SUCCESS! All ${files.length} Radha real cast cutouts converted to transparent PNGs!`)
  console.log(`📁 Target folder: assets/paper/cast_radha_real/`)
  console.log(`📄 Manifest created: assets/paper/cast_radha_real/radha_real_manifest.json`)
}

main().catch((err) => {
  console.error('Error processing Radha real cast images:', err)
  process.exit(1)
})
