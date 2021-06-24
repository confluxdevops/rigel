import {useMemo, useEffect} from 'react'
import useSWR from 'swr'
import {requestAllTokenList, requestToken} from '../utils/api'
import {ProxyUrlPrefix} from '../constants'
import {ChainConfig} from '../constants/chainConfig'
import {useIsCfxChain} from '../hooks'
import {useShuttleState} from '../state'

function mapToken(token, isCfxChain) {
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
    symbol: isCfxChain ? symbol : reference_symbol,
    name: isCfxChain ? name : reference_name,
    address: isCfxChain ? ctoken : reference, // address may be string, such as 'eth', 'cfx'
    ctoken,
    csymbol: symbol,
    cname: name,
    reference,
    reference_symbol,
    reference_name,
    ...others,
  }
}

// only use for display
export function useDisplayTokenList(fromChain, toChain) {
  const tokenList = useMapTokenList(fromChain, toChain)

  return useMemo(
    () => tokenList.filter(ChainConfig[fromChain].displayFilter),
    [fromChain, tokenList],
  )
}

// filter with fromChain and toChain, then map token
export function useMapTokenList(fromChain, toChain) {
  const tokenList = useAllTokenList()
  const isFromCfxChain = useIsCfxChain(fromChain)

  return useMemo(
    () =>
      tokenList
        .filter(
          token => token?.origin === fromChain || token?.to_chain === fromChain,
        )
        .filter(
          token => token?.origin === toChain || token?.to_chain === toChain,
        )
        .map(token => mapToken(token, isFromCfxChain)),
    [tokenList, isFromCfxChain, fromChain, toChain],
  )
}

// get all token list from backend
export function useAllTokenList() {
  const {data} = useSWR(ProxyUrlPrefix.sponsor, requestAllTokenList, {
    refreshInterval: 60000,
  })
  return data ? data : []
}

// search token address from backend
function useSearchAddressFromBackend(fromChain, toChain, search) {
  const isFromCfxChain = useIsCfxChain(fromChain)
  const {setTokenFromBackend} = useShuttleState()
  const searchTokens = useSearchAddressFromList(fromChain, toChain, search)
  const {data} = useSWR(
    ChainConfig[fromChain].checkAddress(search) && searchTokens.length === 0
      ? [ProxyUrlPrefix.sponsor, fromChain, toChain, search]
      : null,
    requestToken,
  )
  const searchTokensFromBackend = useMemo(
    () => (data ? [data].map(token => mapToken(token, isFromCfxChain)) : []),
    [data, isFromCfxChain],
  )
  useEffect(() => {
    if (searchTokensFromBackend.length === 1) {
      setTokenFromBackend(searchTokensFromBackend[0])
    }
  }, [searchTokensFromBackend, setTokenFromBackend])
  return searchTokensFromBackend
}

// search token adddress from current list
function useSearchAddressFromList(fromChain, toChain, search) {
  const tokenList = useMapTokenList(fromChain, toChain)
  const isValidAddress = ChainConfig[fromChain].checkAddress(search)

  return useMemo(
    () =>
      isValidAddress
        ? tokenList.filter(obj => {
            return obj?.address === search
          })
        : [],
    [isValidAddress, tokenList, search],
  )
}

// serach token name from current list
function useSearchNameFromList(fromChain, toChain, search) {
  const tokenList = useMapTokenList(fromChain, toChain)

  return useMemo(
    () =>
      tokenList.filter(obj => {
        return (
          obj?.symbol?.toLowerCase().indexOf(search) > -1 ||
          obj?.name?.toLowerCase().indexOf(search) > -1
        )
      }),
    [search, tokenList],
  )
}

export function useTokenListBySearch(fromChain, toChain, search) {
  const lowerSearch = search?.toLowerCase()
  const tokenList = useDisplayTokenList(fromChain, toChain)
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

  if (!search) return tokenList
  if (searchAddressFromList.length === 1) return searchAddressFromList
  if (searchAddressFromBackend.length === 1) return searchAddressFromBackend
  if (searchNameFromList.length > 0) return searchNameFromList
  return []
}

export function useCommonTokens(fromChain, toChain) {
  const tokenList = useDisplayTokenList(fromChain, toChain)
  const commonTokens = ChainConfig[fromChain].commonTokens
  return commonTokens.map(address => {
    return tokenList.filter(obj => address === obj?.address)[0]
  })
}

export function useFromToken(fromChain, toChain, fromTokenAddress) {
  const tokenList = useMapTokenList(fromChain, toChain)

  const data = useMemo(
    () => tokenList.filter(token => token.address === fromTokenAddress),
    [tokenList, fromTokenAddress],
  )

  return (data && data[0]) || {}
}

export function useToToken(fromChain, toChain, fromTokenAddress) {
  const tokenList = useMapTokenList(toChain, fromChain)

  const data = useMemo(
    () =>
      tokenList.filter(
        token =>
          (token.address === token.ctoken &&
            token.reference === fromTokenAddress) ||
          (token.address === token.reference &&
            token.ctoken === fromTokenAddress),
      ),
    [tokenList, fromTokenAddress],
  )

  return (data && data[0]) || {}
}
