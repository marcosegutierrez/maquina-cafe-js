import { dirname } from 'path';
import { fileURLToPath } from 'url';

export const __dirname = dirname(fileURLToPath(import.meta.url));

const getRandomArbitrary = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
}

export const generateCodeValidator = () => getRandomArbitrary(100000,999999);