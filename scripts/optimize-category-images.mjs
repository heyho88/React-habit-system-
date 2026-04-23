import sharp from 'sharp'
import { readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'

const DIR = 'public/images/categories'
const SRC = join(DIR, '_original')
const SIZE = 256 // displayed max 88px → 2x+ retina headroom

const files = (await readdir(SRC)).filter(f => /\.jpe?g$/i.test(f))

for (const file of files) {
  const src = join(SRC, file)
  const outJpg = join(DIR, file)
  const outWebp = join(DIR, file.replace(/\.jpe?g$/i, '.webp'))

  await sharp(src)
    .resize(SIZE, SIZE, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(outJpg)

  await sharp(src)
    .resize(SIZE, SIZE, { fit: 'cover', position: 'centre' })
    .webp({ quality: 78 })
    .toFile(outWebp)

  const [before, afterJ, afterW] = await Promise.all([
    stat(src), stat(outJpg), stat(outWebp),
  ])
  const kb = n => (n / 1024).toFixed(0) + 'K'
  console.log(`${file.padEnd(14)}  ${kb(before.size).padStart(6)} → jpg ${kb(afterJ.size).padStart(5)} | webp ${kb(afterW.size).padStart(4)}`)
}
