import { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { chainNameToChainId } from "../../constants/chain"

export const RedirectOldRoute: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const chainName = location.pathname.split("/")[1]
  const chainId = chainNameToChainId(chainName)
  const newPath = location.pathname.replace(chainName + "/", chainId + "-")

  useEffect(() => {
    navigate(newPath, { replace: true })
  })

  return <></>
}
