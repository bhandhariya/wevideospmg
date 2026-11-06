import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const inputDir = path.join(rootDir, 'back')
const outputDir = path.join(rootDir, 'assets', 'paper', 'backgrounds_real')

// Clean and standardize filename
function cleanName(rawFilename, index) {
  const base = path.basename(rawFilename, path.extname(rawFilename))
  // Remove trailing hex hash like _82fb3639
  let clean = base.replace(/(\.jpe?g)?_[a-f0-9]{8}$/i, '')
  clean = clean
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')

  const numStr = String(index + 1).padStart(3, '0')
  return `bg_${numStr}_${clean || 'plate'}.jpg`
}

function main() {
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
  console.log(`🌅 BACKGROUND SCENES ORGANIZER & STANDARDIZER`)
  console.log(`======================================================`)
  console.log(`Found ${files.length} backgrounds in back/`)
  console.log(`Target folder: assets/paper/backgrounds_real/\n`)

  const manifest = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const inputFilePath = path.join(inputDir, file)
    const newFileName = cleanName(file, i)
    const outputFilePath = path.join(outputDir, newFileName)

    // Copy file as-is without changing to PNG
    fs.copyFileSync(inputFilePath, outputFilePath)

    manifest.push({
      index: i + 1,
      original: file,
      filename: newFileName,
      path: `/assets/paper/backgrounds_real/${newFileName}`,
      fileType: 'jpg',
    })

    const progress = `[${String(i + 1).padStart(2, '0')}/${files.length}]`
    console.log(`${progress} ✓ ${newFileName}`)
  }

  // Save manifest
  const manifestPath = path.join(outputDir, 'backgrounds_manifest.json')
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))

  console.log(`\n🎉 SUCCESS! All ${files.length} backgrounds organized as clean JPGs!`)
  console.log(`📁 Destination: assets/paper/backgrounds_real/`)
  console.log(`📄 Manifest: assets/paper/backgrounds_real/backgrounds_manifest.json\n`)
}

main()
