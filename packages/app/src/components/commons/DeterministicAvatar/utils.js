class Random {
  constructor(tokenData) {
    this.tokenData = tokenData
    this.useA = false
    let sfc32 = function (uint128Hex) {
      let a = parseInt(uint128Hex.substr(0, 8), 16)
      let b = parseInt(uint128Hex.substr(8, 8), 16)
      let c = parseInt(uint128Hex.substr(16, 8), 16)
      let d = parseInt(uint128Hex.substr(24, 8), 16)
      return function () {
        a |= 0
        b |= 0
        c |= 0
        d |= 0
        let t = (((a + b) | 0) + d) | 0
        d = (d + 1) | 0
        a = b ^ (b >>> 9)
        b = (c + (c << 3)) | 0
        c = (c << 21) | (c >>> 11)
        c = (c + t) | 0
        return (t >>> 0) / 4294967296
      }
    }
    // seed prngA with first half of tokenData.hash
    this.prngA = new sfc32(this.tokenData.hash.substr(2, 32))
    // seed prngB with second half of tokenData.hash
    this.prngB = new sfc32(this.tokenData.hash.substr(34, 32))
    for (let i = 0; i < 1e6; i += 2) {
      this.prngA()
      this.prngB()
    }
  }
  // random number between 0 (inclusive) and 1 (exclusive)
  random_dec() {
    this.useA = !this.useA
    return this.useA ? this.prngA() : this.prngB()
  }
  // random number between a (inclusive) and b (exclusive)
  random_num(a, b) {
    return a + (b - a) * this.random_dec()
  }
  // random integer between a (inclusive) and b (inclusive)
  // requires a < b for proper probability distribution
  random_int(a, b) {
    return Math.floor(this.random_num(a, b + 1))
  }
  // random boolean with p as percent liklihood of true
  random_bool(p) {
    return this.random_dec() < p
  }
  // random value in an array of items
  random_choice(list) {
    return list[this.random_int(0, list.length - 1)]
  }

  shuffleArray = (arr) => {
    var rand
    var tmp
    var len = arr.length
    var ret = [...arr]
    while (len) {
      rand = ~~(this.random_dec() * len--)
      tmp = ret[len]
      ret[len] = ret[rand]
      ret[rand] = tmp
    }
    return ret
  }
}

export const genTokenData = (projectNum) => {
  let data = {}
  let hash = "0x"
  for (var i = 0; i < 64; i++) {
    hash += Math.floor(Math.random() * 16).toString(16)
  }
  data.hash = hash
  data.tokenId = (projectNum * 1000000 + Math.floor(Math.random() * 1000)).toString()
  return data
}

export default Random
