import fs from 'fs'
import path from 'path'
import { createCanvas, registerFont, loadImage } from 'canvas'
import { size, getH } from './lib'

const current = process.cwd()

export const generateOgImage = async (title: string, tags?: string[]): Promise<Buffer> => {
  const font = path.resolve(current, 'assets/font/NotoSansJP-Bold.ttf')
  registerFont(font, { family: 'NotoSansJP' })

  const { width, height } = size
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  const src = path.resolve(current, 'assets/base.png')
  const image = await loadImage(fs.readFileSync(src))

  ctx.drawImage(image, 0, 0, width, height)

  // タイトルのフォントサイズを大きくする
  ctx.font = '64px "NotoSansJP"'
  ctx.textAlign = 'center'
  ctx.fillStyle = '#000000'

  const lines = title.replace('\\n', '\n').split('\n')
  const maxWidth = 500
  const w = width / 2
  const sum = lines.length
  const write = (text: string, h: number) => {
    ctx.fillText(text, w, h, maxWidth)
  }

  if (sum === 0 || sum > 3) {
    throw new Error(`Invalid lines: ${sum}`)
  }

  for (const [i, line] of Object.entries(lines)) {
    const currentLineNumber = Number(i) + 1
    const h = getH(sum, currentLineNumber)
    write(line, h)
  }

  if (tags && tags.length > 0) {
    ctx.font = '24px "NotoSansJP"'
    ctx.textAlign = 'left'
    ctx.fillStyle = '#666666'

    const tagY = height - 80
    const tagX = 50

    for (const [i, tag] of tags.entries()) {
      const xPosition = tagX + (i * 80)
      ctx.fillText(`#${tag}`, xPosition, tagY, 130)
    }
  }

  return canvas.toBuffer('image/png')
}
