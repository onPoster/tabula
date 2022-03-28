import { TransactionReceipt } from "@ethersproject/providers"
import { useSnackbar } from "notistack"
import { useState } from "react"
import { useWallet } from "../../../hooks/useWallet"
import { getContract } from "../contracts/contract"
import { Publication } from "../type"

const PUBLICATION_TAG = "0x1d2f2ddf66fd037a52a179e4e4fca655871584011016b01fc2dfc39cc1e2bb62" // keccak-256 of PUBLICATION
const POSTER_CONTRACT = process.env.REACT_APP_POSTER_CONTRACT
const usePoster = () => {
  const { enqueueSnackbar } = useSnackbar()
  const contract = getContract(POSTER_CONTRACT as string)
  const { signer } = useWallet()
  const [loading, setLoading] = useState<boolean>(false)

  const createPublication = async (fields: Publication): Promise<any> => {
    const content: Publication = {
      action: fields.action,
      title: fields.title,
    }
    if (fields.description) {
      content.description = fields.description
    }
    if (fields.tags?.length) {
      content.tags = fields.tags
    }
    if (fields.image) {
      content.image = fields.image
    }

    if (signer) {
      setLoading(true)
      const poster = contract.connect(signer)
      try {
        const tx = await poster.post(JSON.stringify(content), PUBLICATION_TAG)
        const receipt: TransactionReceipt = await tx.wait()
        setLoading(false)
        enqueueSnackbar(`Publication created ${receipt.transactionHash}`, { variant: "success" })
      } catch (error: any) {
        setLoading(false)
        enqueueSnackbar(error.message, { variant: "error" })
        console.error("error", error)
      }
    }
  }

  return { createPublication, loading }
}
export default usePoster
