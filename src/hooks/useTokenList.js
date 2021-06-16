import {useMemo} from 'react'
import useSWR from 'swr'
import {requestAllTokenList, requestToken} from '../utils/api'
import {ProxyUrlPrefix} from '../constants'
import {KeyOfCfx, ChainConfig} from '../constants/chainConfig'

export function useIsCfxChain(chain) {
  const isCfxChain = useMemo(() => chain === KeyOfCfx, [chain])
  return isCfxChain
}

// only use for display
export function useMapTokenList(chain) {
  const tokenList = useTokenList(chain)
  console.log(tokenList)
  const isCfxChain = useIsCfxChain(chain)
  return tokenList.map(token => {
    if (!token) return {}
    const {
      ctoken,
      symbol,
      name,
      reference,
      reference_symbol,
      reference_name,
      ...others
    } = token
    return {
      symbol: isCfxChain ? symbol : reference_symbol,
      name: isCfxChain ? name : reference_name,
      address: isCfxChain ? ctoken : reference, // address may be string, such as 'eth', 'cfx'
      csymbol: symbol,
      reference_symbol,
      ctoken,
      reference,
      ...others,
    }
  })
}

// get all token list from backend
export function useAllTokenList() {
  const {data} = useSWR(ProxyUrlPrefix.sponsor, requestAllTokenList, {
    refreshInterval: 60000,
  })
  return data ? data : []
}

// token list of one chain
export function useTokenList(chain) {
  const allTokenList = useAllTokenList()
  return allTokenList
    .filter(obj => obj?.origin === chain || obj?.to_chain === chain)
    .filter(ChainConfig[chain].displayFilter)
}

// search token address from backend
function useSearchAddressFromBackend(chain, search, fromChain, toChain) {
  const searchTokens = useSearchAddressFromList(chain, search)
  const {data} = useSWR(
    [
      ChainConfig[chain].checkAddress(search) && searchTokens.length === 0
        ? ProxyUrlPrefix.shuttleflow
        : null,
      fromChain,
      toChain,
      search,
    ],
    requestToken,
  )
  return data ? [data] : []
}

// search token adddress from current list
function useSearchAddressFromList(chain, search) {
  const tokenList = useMapTokenList(chain)

  if (ChainConfig[chain].checkAddress(search)) {
    return tokenList.filter(obj => {
      return obj?.address?.toLowerCase() === search
    })
  }

  return []
}

// serach token name from current list
function useSearchNameFromList(chain, search) {
  const tokenList = useMapTokenList(chain)

  return tokenList.filter(obj => {
    return (
      obj?.symbol?.toLowerCase().indexOf(search) > -1 ||
      obj?.name?.toLowerCase().indexOf(search) > -1
    )
  })
}

export function useTokenListBySearch(chain, search, fromChain, toChain) {
  const lowerSearch = search?.toLowerCase()
  const searchAddressFromList = useSearchAddressFromList(chain, lowerSearch)
  const searchAddressFromBackend = useSearchAddressFromBackend(
    chain,
    lowerSearch,
    fromChain,
    toChain,
  )
  const searchNameFromList = useSearchNameFromList(chain, lowerSearch)

  if (searchAddressFromList.length === 1) return searchAddressFromList
  if (searchAddressFromBackend.length === 1) return searchAddressFromBackend
  if (searchNameFromList.length > 0) return searchNameFromList
  return []
}

export function useCommonTokens(chain) {
  const tokenList = useMapTokenList(chain)
  const commonTokens = ChainConfig[chain].commonTokens
  return commonTokens.map(address => {
    return tokenList.filter(obj => address === obj?.address)[0]
  })
}

export function useTokenPair({origin, toChain, token}) {
  const allTokenList = useAllTokenList()
  return allTokenList.filter(
    obj =>
      obj?.origin === origin &&
      obj?.to_chain === toChain &&
      (obj?.reference === token || obj?.ctoken === token),
  )
}
