
export const getRandomNumber = (min: number, max: number, seed: number = Math.random()): number =>
    Math.floor(seed * (max - min + 1) + min);