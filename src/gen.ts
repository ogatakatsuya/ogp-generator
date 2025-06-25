import fs from 'fs'
import path from 'path'
import { createCanvas, registerFont, loadImage } from 'canvas'
import { size, getH, wrapText } from './lib'

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

  ctx.font = '64px "NotoSansJP"'
  ctx.textAlign = 'center'
  ctx.fillStyle = '#000000'

  const maxWidth = 1000
  const w = width / 2

  let lines: string[] = []
  for (const rawLine of title.replace('\\n', '\n').split('\n')) {
    lines.push(...wrapText(ctx, rawLine, maxWidth))
  }
  const sum = lines.length
  const lineHeight = 80
  const centerY = height / 2
  const totalTextHeight = lineHeight * sum
  const startY = centerY - (totalTextHeight / 2) + (lineHeight / 2)
  const write = (text: string, i: number) => {
    const h = startY + i * lineHeight
    ctx.fillText(text, w, h, maxWidth)
  }

  if (sum === 0 || sum > 3) {
    throw new Error(`Invalid lines: ${sum}`)
  }

  lines.forEach((line, i) => {
    write(line, i)
  })

  if (tags && tags.length > 0) {
    ctx.font = '24px "NotoSansJP"'
    ctx.textAlign = 'left'
    ctx.fillStyle = '#666666'

    const tagY = height - 80
    let tagX = 50
    const tagGap = 20

    for (const tag of tags) {
      const tagText = `#${tag}`
      ctx.fillText(tagText, tagX, tagY, 130)
      const tagWidth = ctx.measureText(tagText).width
      tagX += tagWidth + tagGap
    }
  }

  return canvas.toBuffer('image/png')
}
