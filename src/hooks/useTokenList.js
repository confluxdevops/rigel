import useSWR from 'swr'
import {requestAllTokenList, requestToken} from '../utils/api'
import {ProxyUrlPrefix} from '../constants'
import {ChainConfig} from '../constants/chainConfig'
import {useIsCfxChain} from '../hooks'

// only use for display
export function useMapTokenList(fromChain, toChain) {
  const tokenList = useTokenList(fromChain)
  const isFromCfxChain = useIsCfxChain(fromChain)
  return tokenList
    .filter(token => token?.to_chain === toChain || token?.origin === toChain)
    .map(token => {
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
        //symbol, name,cname address is only for dispalying
        // ctoken, csymbol, cname is conflux token info
        // reference, reference_symbol, reference_name is other chain token info
        symbol: isFromCfxChain ? symbol : reference_symbol,
        name: isFromCfxChain ? name : reference_name,
        address: isFromCfxChain ? ctoken : reference, // address may be string, such as 'eth', 'cfx'
        ctoken,
        csymbol: symbol,
        cname: name,
        reference,
        reference_symbol,
        reference_name,
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
  if (!chain) return []
  return allTokenList
    .filter(obj => obj?.origin === chain || obj?.to_chain === chain)
    .filter(ChainConfig[chain].displayFilter)
}

// search token address from backend
function useSearchAddressFromBackend(fromChain, toChain, search) {
  const searchTokens = useSearchAddressFromList(fromChain, toChain, search)
  const {data} = useSWR(
    [
      ChainConfig[fromChain].checkAddress(search) && searchTokens.length === 0
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
function useSearchAddressFromList(fromChain, toChain, search) {
  const tokenList = useMapTokenList(fromChain, toChain)

  if (ChainConfig[fromChain].checkAddress(search)) {
    return tokenList.filter(obj => {
      return obj?.address?.toLowerCase() === search
    })
  }

  return []
}

// serach token name from current list
function useSearchNameFromList(fromChain, toChain, search) {
  const tokenList = useMapTokenList(fromChain, toChain)

  return tokenList.filter(obj => {
    return (
      obj?.symbol?.toLowerCase().indexOf(search) > -1 ||
      obj?.name?.toLowerCase().indexOf(search) > -1
    )
  })
}

export function useTokenListBySearch(fromChain, toChain, search) {
  const lowerSearch = search?.toLowerCase()
  const searchAddressFromList = useSearchAddressFromList(
    fromChain,
    toChain,
    lowerSearch,
  )
  const searchAddressFromBackend = useSearchAddressFromBackend(
    fromChain,
    toChain,
    lowerSearch,
  )
  const searchNameFromList = useSearchNameFromList(
    fromChain,
    toChain,
    lowerSearch,
  )

  if (searchAddressFromList.length === 1) return searchAddressFromList
  if (searchAddressFromBackend.length === 1) return searchAddressFromBackend
  if (searchNameFromList.length > 0) return searchNameFromList
  return []
}

export function useCommonTokens(fromChain, toChain) {
  const tokenList = useMapTokenList(fromChain, toChain)
  const commonTokens = ChainConfig[fromChain].commonTokens
  return commonTokens.map(address => {
    return tokenList.filter(obj => address === obj?.address)[0]
  })
}

export function useTokenPair({fromChain, toChain, token}) {
  const allTokenList = useAllTokenList()
  return allTokenList.filter(
    obj =>
      obj?.origin === fromChain &&
      obj?.to_chain === toChain &&
      (obj?.reference === token || obj?.ctoken === token),
  )
}

export function useFromToken(fromChain, toChain, fromTokenAddress) {
  const tokenList = useMapTokenList(fromChain, toChain)
  const data =
    tokenList.filter(token => token.address === fromTokenAddress) || []
  return (data && data[0]) || {}
}

export function useToToken(fromChain, toChain, fromTokenAddress) {
  const tokenList = useMapTokenList(toChain, fromChain)
  const data =
    tokenList.filter(
      token =>
        (token.address === token.ctoken &&
          token.reference === fromTokenAddress) ||
        (token.address === token.reference &&
          token.ctoken === fromTokenAddress),
    ) || []
  return (data && data[0]) || {}
}
