import { Theme, ImagePath } from "./type"
import { imageMap } from "./const"
import { CanvasRenderingContext2D } from 'canvas'

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

export const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number = 1040): string[] => {
  const lines: string[] = []
  const words = text.split('')
  let currentLine = ''

  for (const char of words) {
    const testLine = currentLine + char
    const metrics = ctx.measureText(testLine)
    
    if (metrics.width > maxWidth && currentLine.length > 0) {
      lines.push(currentLine)
      currentLine = char
    } else {
      currentLine = testLine
    }
  }
  
  if (currentLine.length > 0) {
    lines.push(currentLine)
  }
  
  return lines
}

export const getImagePath = (theme?: Theme): ImagePath => {
  if (!theme) {
    return imageMap.default;
  }
  return imageMap[theme];
}