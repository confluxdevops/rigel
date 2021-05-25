import useSWR from 'swr'
import {getAllTokenList, searchToken} from '../utils/api'
import {ProxyUrlPrefix} from '../constants'
import Config, {ChainShortNameCfx} from '../constants/chainConfig'

export function useAllTokenList() {
  const {data} = useSWR(ProxyUrlPrefix.shuttleflow, getAllTokenList, {
    refreshInterval: 60000,
  })
  return data
}

export function useTokenList(chain) {
  const allTokenList = useAllTokenList()
  return allTokenList
    .filter(obj => obj?.origin === chain || obj?.to_chain === chain)
    .filter(Config[chain].displayFilter)
}

export function useTokenListBySearch(chain, search, fromChain, toChain) {
  const tokenList = useTokenList(chain)
  const lowerSearch = search.toLowerCase()
  let filterResult
  if (search) {
    if (Config[chain].checkAddress(search)) {
      // search token addresss
      filterResult = tokenList.filter(obj => {
        if (chain === ChainShortNameCfx) {
          return obj?.ctoken.toLowerCase() === lowerSearch
        } else {
          return obj?.reference.toLowerCase() === lowerSearch
        }
      })
      if (filterResult.length === 1) {
        return filterResult
      } else {
        // search token address from backend
        return searchToken(fromChain, toChain, lowerSearch).then(result =>
          result ? [result] : [],
        )
      }
    } else {
      // search symnol or name
      filterResult = tokenList.filter(obj => {
        if (chain === ChainShortNameCfx) {
          return (
            obj?.symbol.toLowerCase().indexOf(lowerSearch) > -1 ||
            obj?.name.toLowerCase().indexOf(lowerSearch) > -1
          )
        } else {
          return (
            obj?.reference_symbol.toLowerCase().indexOf(lowerSearch) > -1 ||
            obj?.reference_name.toLowerCase().indexOf(lowerSearch) > -1
          )
        }
      })
      if (filterResult.length === 1) return filterResult
    }
    return []
  }
}

export function useCommonTokens(chain) {
  const tokenList = useTokenList(chain)
  const commonTokens = Config[chain].commonTokens
  return tokenList.filter(obj => {
    if (chain === ChainShortNameCfx) {
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
