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
