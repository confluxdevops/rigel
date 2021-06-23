import {useMemo, useEffect} from 'react'
import useSWR from 'swr'
import {requestAllTokenList, requestToken} from '../utils/api'
import {ProxyUrlPrefix} from '../constants'
import {ChainConfig} from '../constants/chainConfig'
import {useIsCfxChain} from '../hooks'
import {useShuttleState} from '../state'

function mapToken(token, isFromCfxChain) {
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
}

// only use for display
export function useMapTokenList(fromChain, toChain) {
  const tokenList = useTokenList(fromChain)
  const isFromCfxChain = useIsCfxChain(fromChain)
  return useMemo(
    () =>
      tokenList
        .filter(
          token => token?.to_chain === toChain || token?.origin === toChain,
        )
        .map(token => mapToken(token, isFromCfxChain)),
    [isFromCfxChain, toChain, tokenList],
  )
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

  return useMemo(
    () =>
      !chain
        ? []
        : allTokenList
            .filter(obj => obj?.origin === chain || obj?.to_chain === chain)
            .filter(ChainConfig[chain].displayFilter),
    [allTokenList, chain],
  )
}

// search token address from backend
function useSearchAddressFromBackend(fromChain, toChain, search) {
  const isFromCfxChain = useIsCfxChain(fromChain)
  const {setTokenFromBackend} = useShuttleState()
  const searchTokens = useSearchAddressFromList(fromChain, search)
  const {data} = useSWR(
    ChainConfig[fromChain].checkAddress(search) && searchTokens.length === 0
      ? [ProxyUrlPrefix.sponsor, fromChain, toChain, search]
      : null,
    requestToken,
  )
  const mapToken = useMemo(
    () => (data ? [data].map(token => mapToken(token, isFromCfxChain)) : []),
    [data, isFromCfxChain],
  )
  useEffect(() => {
    if (Object.keys(mapToken).length > 0) {
      setTokenFromBackend(mapToken)
    }
  }, [mapToken, setTokenFromBackend])
  return mapToken
}

// search token adddress from current list
function useSearchAddressFromList(fromChain, search) {
  const tokenList = useAllTokenList()
  const isFromCfxChain = useIsCfxChain(fromChain)
  const isValidAddress = ChainConfig[fromChain].checkAddress(search)

  return useMemo(
    () =>
      isValidAddress
        ? tokenList
            .map(token => mapToken(token, isFromCfxChain))
            .filter(obj => {
              return obj?.address === search
            })
        : [],
    [isValidAddress, tokenList, search, isFromCfxChain],
  )
}

// serach token name from current list
function useSearchNameFromList(fromChain, search) {
  const tokenList = useAllTokenList()
  const isFromCfxChain = useIsCfxChain(fromChain)

  return useMemo(
    () =>
      tokenList
        .filter(obj => {
          return (
            obj?.symbol?.toLowerCase().indexOf(search) > -1 ||
            obj?.name?.toLowerCase().indexOf(search) > -1
          )
        })
        .map(token => mapToken(token, isFromCfxChain)),
    [search, tokenList, isFromCfxChain],
  )
}

export function useTokenListBySearch(fromChain, toChain, search) {
  const lowerSearch = search?.toLowerCase()
  const tokenList = useMapTokenList(fromChain, toChain)
  const searchAddressFromList = useSearchAddressFromList(fromChain, lowerSearch)
  const searchAddressFromBackend = useSearchAddressFromBackend(
    fromChain,
    toChain,
    lowerSearch,
  )
  const searchNameFromList = useSearchNameFromList(lowerSearch)

  if (!search) return tokenList
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

export function useFromToken(fromChain, fromTokenAddress) {
  const tokenList = useAllTokenList()
  const isFromCfxChain = useIsCfxChain(fromChain)
  const data = tokenList
    .map(token => mapToken(token, isFromCfxChain))
    .filter(token => token.address === fromTokenAddress)

  return (data && data[0]) || {}
}

export function useToToken(toChain, fromTokenAddress) {
  const tokenList = useAllTokenList()
  const isToCfxChain = useIsCfxChain(toChain)
  const data = tokenList
    .map(token => mapToken(token, isToCfxChain))
    .filter(
      token =>
        (token.address === token.ctoken &&
          token.reference === fromTokenAddress) ||
        (token.address === token.reference &&
          token.ctoken === fromTokenAddress),
    )
  return (data && data[0]) || {}
}
