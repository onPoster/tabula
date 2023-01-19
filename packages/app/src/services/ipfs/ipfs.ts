import axios from "axios"

const IPFS_GATEWAY = process.env.REACT_APP_IPFS_GATEWAY

class Ipfs {
  getData = async (hash: string): Promise<string> => {
    const res = await axios.get(`${IPFS_GATEWAY}/${hash}`, {
      headers: {
        Accept: "text/plain",
      },
    })
    return res.data
  }
}

export default new Ipfs()
