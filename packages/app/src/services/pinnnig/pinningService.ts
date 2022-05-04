import axios from "axios"

class PinningService {
  getPinnedData = async (hash: string): Promise<string> => {
    const res = await axios.get(`https://ipfs.infura.io/ipfs/${hash}`)
    return res.data
  }
}

export default new PinningService()
