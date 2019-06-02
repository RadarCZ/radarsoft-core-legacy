export const getAllowedKeys = (keys, object, remove) => {
  if (remove) {
    return Object.keys(object).filter(key => !keys.includes(key))
  } else {
    return keys
  }
}

export const filterKeys = (filteredKeys, object, remove = false) => {
  const allowedKeys = getAllowedKeys(filteredKeys, object, remove)
  return Object.keys(object)
    .filter(key => allowedKeys.includes(key))
    .reduce((obj, key) => {
      return { ...obj, [key]: object[key] }
    }, {})
}

export const getRandomNumber: (seed: string, max: number) => number = (seed, max) => {
  const seedRandom = require('seedrandom')
  const rng = seedRandom(seed)
  return Math.floor(rng() * Math.floor(max))
}