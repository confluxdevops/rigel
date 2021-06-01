import useSWR from 'swr'
import {requestAllTokenList, requestToken} from '../utils/api'
import {ProxyUrlPrefix} from '../constants'
import Config, {KeyOfCfx} from '../constants/chainConfig'

// get all token list from backend
export function useAllTokenList() {
  const {data} = useSWR(ProxyUrlPrefix.shuttleflow, requestAllTokenList, {
    refreshInterval: 60000,
  })
  return data
}

// token list of one chain
export function useTokenList(chain) {
  const allTokenList = useAllTokenList()
  return allTokenList
    .filter(obj => obj?.origin === chain || obj?.to_chain === chain)
    .filter(Config[chain].displayFilter)
}

// search token address from backend
function useSearchAddressFromBackend(chain, search, fromChain, toChain) {
  const searchTokens = useSearchAddressFromList(chain, search)
  const {data} = useSWR(
    [
      Config[chain].checkAddress(search) && searchTokens.length === 0
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
  const tokenList = useTokenList(chain)

  if (Config[chain].checkAddress(search)) {
    return tokenList.filter(obj => {
      if (chain === KeyOfCfx) {
        return obj?.ctoken.toLowerCase() === search
      } else {
        return obj?.reference.toLowerCase() === search
      }
    })
  }

  return []
}

// serach token name from current list
function useSearchNameFromList(chain, search) {
  const tokenList = useTokenList(chain)

  return tokenList.filter(obj => {
    if (chain === KeyOfCfx) {
      return (
        obj?.symbol.toLowerCase().indexOf(search) > -1 ||
        obj?.name.toLowerCase().indexOf(search) > -1
      )
    } else {
      return (
        obj?.reference_symbol.toLowerCase().indexOf(search) > -1 ||
        obj?.reference_name.toLowerCase().indexOf(search) > -1
      )
    }
  })
}

export function useTokenListBySearch(chain, search, fromChain, toChain) {
  const lowerSearch = search.toLowerCase()
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
  const tokenList = useTokenList(chain)
  const commonTokens = Config[chain].commonTokens
  return tokenList.filter(obj => {
    if (chain === KeyOfCfx) {
      return commonTokens.filter(token => token === obj?.ctoken)
    } else {
      return commonTokens.filter(token => token === obj?.reference)
    }
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
