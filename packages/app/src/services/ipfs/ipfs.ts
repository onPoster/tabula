import axios from "axios"

class Ipfs {
  getData = async (hash: string): Promise<string> => {
    const res = await axios.get(`https://ipfs.infura.io/ipfs/${hash}`)
    return res.data
  }
}

export default new Ipfs()
