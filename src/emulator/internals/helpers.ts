export function random (from: number, to: number) {
  return Math.random() * (to - from) + from
}

/**
 * returns a random index using values as weights
 * @param weights
 */
export function randomIndex (weights: number[]): number {
  const sum = weights.reduce((acc, weight) => acc + weight, 0)
  let selected = Math.random() * sum
  return weights.findIndex(
    weight => {
      if (selected < weight) {
        return true
      } else {
        selected -= weight
        return false
      }
    }
  )
}

export async function delayedCall<T> (callback: () => T, from: number, to: number) {
  return new Promise<T>((resolve) => {
    const delay = random(from, to)
    setTimeout(() => resolve(callback()), delay)
  })
}
