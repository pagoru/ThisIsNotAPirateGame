import LibRandom from 'lib-random';

export const getRandomNumber = (min: number, max: number, seed: number = Math.random() * 100000): number =>
    new LibRandom(seed).randInt(min, max);