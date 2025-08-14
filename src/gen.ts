import fs from 'fs'
import path from 'path'
import { createCanvas, registerFont, loadImage } from 'canvas'
import { size, wrapText, getImagePath } from './lib'
import { Theme } from './type'

const current = process.cwd()

export const generateOgImage = async (title: string, tags?: string[], theme?: Theme): Promise<Buffer> => {
  const font = path.resolve(current, 'assets/font/NotoSansJP-Bold.ttf')
  registerFont(font, { family: 'NotoSansJP' })

  const { width, height } = size
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  const imagePath = getImagePath(theme)
  const src = path.resolve(current, imagePath)
  const image = await loadImage(fs.readFileSync(src))

  ctx.drawImage(image, 0, 0, width, height)

  ctx.font = '50px "NotoSansJP"'
  ctx.textAlign = 'left'
  ctx.fillStyle = '#000000'

  const maxWidth = 900
  const startX = 80
  const startY = 150

  let lines: string[] = []
  for (const rawLine of title.replace('\\n', '\n').split('\n')) {
    lines.push(...wrapText(ctx, rawLine, maxWidth))
  }
  const sum = lines.length
  const lineHeight = 100
  const write = (text: string, i: number) => {
    const h = startY + i * lineHeight
    ctx.fillText(text, startX, h, maxWidth)
  }

  if (sum === 0 || sum > 4) {
    throw new Error(`Too long title: ${sum} lines`)
  }

  lines.forEach((line, i) => {
    write(line, i)
  })

  if (tags && tags.length > 0) {
    ctx.font = '32px "NotoSansJP"'
    ctx.textAlign = 'left'
    ctx.fillStyle = '#07090a'

    const tagY = height - 80
    let tagX = 80
    const tagGap = 20

    for (const tag of tags.slice(0, 2)) {
      const tagText = `#${tag}`
      ctx.fillText(tagText, tagX, tagY)
      const tagWidth = ctx.measureText(tagText).width
      tagX += tagWidth + tagGap
    }
  }

  return canvas.toBuffer('image/png')
}

// Test function to demonstrate usage
const testGeneration = async () => {
  const buffer1 = await generateOgImage(
    'これはテストタイトルです。長めのタイトルで改行のテストを行います。',
    ['JavaScript', 'TypeScript'],
    'blue'
  );
  
  // You can add more test logic here if needed
  console.log('OG image generated successfully');
}

// Run the test if this file is executed directly
if (require.main === module) {
  testGeneration().catch(console.error);
}