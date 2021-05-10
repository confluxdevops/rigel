/**
 * For the chain based on Ethereum: add one token to MetaMask quickly
 */
import {useCallback, useState} from 'react'
import {useActiveWeb3React} from './useWeb3Network'

export default function useAddTokenToMetamask(token) {
  const {library} = useActiveWeb3React()

  const [success, setSuccess] = useState()

  const addToken = useCallback(() => {
    if (
      library &&
      library.provider.isMetaMask &&
      library.provider.request &&
      token
    ) {
      library.provider
        .request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options: {
              address: token.address,
              symbol: token.symbol,
              decimals: token.decimals,
              image: token.icon,
            },
          },
        })
        .then(success => {
          setSuccess(success)
        })
        .catch(() => setSuccess(false))
    } else {
      setSuccess(false)
    }
  }, [library, token])

  return {addToken, success}
}
