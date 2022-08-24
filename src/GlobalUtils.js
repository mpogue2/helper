export default {
  // ----------------------------------------------------------------------------------------
  // SEEDED SHUFFLE (permute) FUNCTION:
  //   described here: https://stackoverflow.com/questions/16801687/javascript-random-ordering-with-seed
  // given a string, returns a function that generates a unique hash of a string
  xmur3 (str) {
    let h = 1779033703 ^ str.length

    for (let i = 0; i < str.length; i++) {
      h = Math.imul(h ^ str.charCodeAt(i), 3432918353)
      h = h << 13 | h >>> 19
    }
    return function () {
      h = Math.imul(h ^ h >>> 16, 2246822507)
      h = Math.imul(h ^ h >>> 13, 3266489909)
      return (h ^= h >>> 16) >>> 0
    }
  },

  // ----------------------------------------------------------------------------------------
  // pseudo-random number generator
  //    given a random number as a seed, returns a function that generates a
  //    unique sequence of random numbers
  mulberry32 (a) {
    return function () {
      let t = a += 0x6D2B79F5
      t = Math.imul(t ^ t >>> 15, t | 1)
      t ^= t + Math.imul(t ^ t >>> 7, t | 61)
      return ((t ^ t >>> 14) >>> 0) / 4294967296
    }
  },

  // ----------------------------------------------------------------------------------------
  // given a seed string, returns a function that performs a unique shuffle for that seed
  seededRandom (seed = 'optional seed string') {
    // console.log('GlobalUtils::SeededRandom()')
    const rng = this.mulberry32(this.xmur3(seed)())

    const rnd = (lo, hi, defaultHi = 1) => {
      if (hi === undefined) {
        hi = lo === undefined ? defaultHi : lo
        lo = 0
      }

      return rng() * (hi - lo) + lo
    }

    const rndInt = (lo, hi) => Math.floor(rnd(lo, hi, 2))

    const shuffle = a => {
      for (let i = a.length - 1; i > 0; i--) {
        const j = rndInt(i + 1)
        const x = a[i]
        a[i] = a[j]
        a[j] = x
      }
    }

    return shuffle // returns a function that will shuffle an array in-place
  }

}
