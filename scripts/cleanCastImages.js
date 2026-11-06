import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer-core'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

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

async function processFolder(inputDir, outputDir, prefix, browser) {
  if (!fs.existsSync(inputDir)) return
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })

  const files = fs
    .readdirSync(inputDir)
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
    .sort()

  console.log(`\n======================================================`)
  console.log(`✨ ULTRA-CLEAN BACKGROUND REMOVER: ${prefix.toUpperCase()}`)
  console.log(`Processing ${files.length} images from: ${path.basename(inputDir)}`)
  console.log(`Output folder: ${path.relative(rootDir, outputDir)}`)
  console.log(`======================================================`)

  const page = await browser.newPage()
  await page.setViewport({ width: 2048, height: 2048 })

  const manifest = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const inputFilePath = path.join(inputDir, file)

    // Clean name
    const base = path.basename(file, path.extname(file))
    let clean = base.replace(/(\.jpg)?_[a-f0-9]{8}$/i, '')
    clean = clean
      .replace(/^(Lord_Krishna|Young_Krishna|Krishna|Character|Figure|Woman|Kneeling_woman|Seated_woman|Standing_figure|Young_person|Youthful_girl|Divine_figure|Deity|Young_craftsman|Young_character|Portrait|Watercolor_portrait|Charcoal_sketch|Slumped_character|Man)_/i, '')
      .replace(/^young_chan_d88a4776_2K$/i, 'art_portrait')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')

    const numStr = String(i + 1).padStart(3, '0')
    const newFileName = `${prefix}_${numStr}_${clean}.png`
    const outputFilePath = path.join(outputDir, newFileName)

    const base64Data = fs.readFileSync(inputFilePath).toString('base64')
    const mime = file.endsWith('.png') ? 'image/png' : 'image/jpeg'
    const dataUrl = `data:${mime};base64,${base64Data}`

    const pngDataUrl = await page.evaluate(async (srcUrl) => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => {
          const w = img.naturalWidth
          const h = img.naturalHeight
          const canvas = document.createElement('canvas')
          canvas.width = w
          canvas.height = h
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0)

          const imgData = ctx.getImageData(0, 0, w, h)
          const data = imgData.data

          // 1. Sample paper background color from inset margin corners (avoiding deckle edges)
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

          // Sample inset 50px away from the rough border
          sampleBox(50, 50, 20)
          sampleBox(w - 70, 50, 20)
          sampleBox(50, h - 70, 20)
          sampleBox(w - 70, h - 70, 20)

          bgR /= sampleCount
          bgG /= sampleCount
          bgB /= sampleCount

          // 2. Paper detection:
          // Checks distance to cream paper OR broad light parchment tones
          const isPaperBg = (idx4) => {
            const r = data[idx4]
            const g = data[idx4 + 1]
            const b = data[idx4 + 2]
            const dr = r - bgR
            const dg = g - bgG
            const db = b - bgB
            const dist = Math.sqrt(dr * dr + dg * dg + db * db)
            
            // Higher tolerance (68) covers paper variations, aged patches & deckle tone
            if (dist < 68) return true

            // Broad cream/beige paper range: light and low chroma
            if (r > 195 && g > 185 && b > 165) {
              const maxDiff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b))
              if (maxDiff < 45) return true
            }

            return false
          }

          // 3. Flood-fill BFS starting from the perimeter
          const visited = new Uint8Array(w * h)
          const queue = new Int32Array(w * h)
          let qHead = 0, qTail = 0

          // Seed outer 35px border unconditionally if it's not dark character pigment (r > 110)
          for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
              const idx = y * w + x
              const px = idx * 4
              const isBorderZone = x < 35 || x >= w - 35 || y < 35 || y >= h - 35
              if (isBorderZone) {
                // If it's light/medium paper/border (r > 110), seed it as background
                if (data[px] > 110 && data[px+1] > 100 && data[px+2] > 90) {
                  visited[idx] = 1
                  queue[qTail++] = idx
                }
              } else if ((x === 35 || x === w - 36 || y === 35 || y === h - 36) && isPaperBg(px)) {
                if (!visited[idx]) {
                  visited[idx] = 1
                  queue[qTail++] = idx
                }
              }
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
                const px = n * 4
                if (isPaperBg(px)) {
                  visited[n] = 1
                  queue[qTail++] = n
                }
              }
            }
          }

          // 4. Apply Transparency & Smooth Feathering
          for (let idx = 0; idx < w * h; idx++) {
            const px = idx * 4
            const x = idx % w
            const y = Math.floor(idx / w)

            // Force clean outer 25px margin to eliminate any lingering frame box
            if (x < 25 || x >= w - 25 || y < 25 || y >= h - 25) {
              if (data[px] > 90) {
                data[px + 3] = 0
                continue
              }
            }

            if (visited[idx]) {
              data[px + 3] = 0 // 100% transparent background
            } else {
              // Edge feathering
              const r = data[px]
              const g = data[px + 1]
              const b = data[px + 2]
              const dr = r - bgR
              const dg = g - bgG
              const db = b - bgB
              const dist = Math.sqrt(dr * dr + dg * dg + db * db)

              if (dist < 78) {
                const alpha = Math.min(255, Math.max(0, ((dist - 48) / 30) * 255))
                data[px + 3] = Math.round(alpha)
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

    const base64Png = pngDataUrl.replace(/^data:image\/png;base64,/, '')
    fs.writeFileSync(outputFilePath, Buffer.from(base64Png, 'base64'))

    manifest.push({
      index: i + 1,
      original: file,
      filename: newFileName,
      path: `/assets/paper/${path.basename(outputDir)}/${newFileName}`,
    })

    console.log(`[${String(i + 1).padStart(3, '0')}/${files.length}] ✓ ${newFileName}`)
  }

  await page.close()

  const manifestPath = path.join(outputDir, `${prefix}_manifest.json`)
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))
  console.log(`✓ Saved manifest: ${path.relative(rootDir, manifestPath)}`)
}

async function main() {
  const chromePath = getChromePath()
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  // Process Radha cast
  const radhaIn = path.join(rootDir, 'Radha Cast Images')
  const radhaOut = path.join(rootDir, 'assets', 'paper', 'cast_radha')
  await processFolder(radhaIn, radhaOut, 'radha', browser)

  // Process Krishna cast
  const krishnaIn = path.join(rootDir, 'kirshnacastimages')
  const krishnaOut = path.join(rootDir, 'assets', 'paper', 'cast_krishna')
  await processFolder(krishnaIn, krishnaOut, 'krishna', browser)

  await browser.close()
  console.log(`\n🎉 ALL CAST IMAGES CLEANED & STANDARDIZED WITH ZERO BORDERS!`)
}

main().catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})
