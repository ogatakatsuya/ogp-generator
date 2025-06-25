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
