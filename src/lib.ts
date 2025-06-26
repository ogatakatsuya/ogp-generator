import { Theme, ImagePath } from "./type"
import { imageMap } from "./const"

export const size = { width: 1200, height: 630 }

const getBase = (sum: number) => {
  switch (sum) {
    case 1:
      return { rate: 2.6, additionalHeight: 38 }
    case 2:
      return { rate: 2.4, additionalHeight: 36 }
    case 3:
      return { rate: 2.0, additionalHeight: 34 }
    default:
      return { rate: 2.4, additionalHeight: 36 }
  }
}

export const getH = (sum: number, current: number) => {
  const { rate, additionalHeight } = getBase(sum)
  const base = (size.height * rate) / 7

  return base + additionalHeight * current
}

export const wrapText = (ctx: any, text: string, maxWidth: number): string[] => {
  const words = text.split(' ')
  const lines: string[] = []
  let line = ''
  for (let n = 0; n < words.length; n++) {
    const testLine = line ? line + ' ' + words[n] : words[n]
    const metrics = ctx.measureText(testLine)
    if (metrics.width > maxWidth && line) {
      lines.push(line)
      line = words[n]
    } else {
      line = testLine
    }
  }
  if (line) lines.push(line)
  return lines
}

export const getImagePath = (theme?: Theme): ImagePath => {
  if (!theme) {
    return imageMap.default;
  }
  return imageMap[theme];
}