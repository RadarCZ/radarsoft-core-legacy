import fs from 'fs';
import path from 'path';
import { default as seedRandom } from 'seedrandom';

export const getAllowedKeys: (keys: string[], object: any, remove: boolean) => string[] = (keys, object, remove) => {
  if (remove) {
    return Object.keys(object).filter(key => !keys.includes(key));
  } else {
    return keys;
  }
};

export const filterKeys: (filteredKeys: string[], object: any, remove: boolean) => any = (filteredKeys, object, remove = false) => {
  const allowedKeys = getAllowedKeys(filteredKeys, object, remove);

  return Object.keys(object)
    .filter(key => allowedKeys.includes(key))
    .reduce((obj, key) => {
      return { ...obj, [key]: object[key] };
    }, { });
};

export const getRandomNumber: (seed: string, max: number) => number = (seed, max) => {
  const rng = seedRandom(seed);

  return Math.floor(rng() * Math.floor(max));
};

export const getPackageJsonVersion: () => string = () => {
  const pjsonPath = path.join(process.cwd(), 'package.json');
  const pjsonRaw = fs.readFileSync(pjsonPath, { 'encoding': 'utf8' });
  const { version } = JSON.parse(pjsonRaw);

  return version;
};
