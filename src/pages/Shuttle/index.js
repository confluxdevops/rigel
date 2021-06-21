import {createContext, useState, useEffect} from 'react'
import queryString from 'query-string'
import {useHistory, useLocation} from 'react-router-dom'

import ShuttleForm from './ShuttleForm'
import TokenList from './TokenList'
import {
  DefaultFromChain,
  DefaultToChain,
  SupportedChains,
  ChainConfig,
  KeyOfCfx,
} from '../../constants/chainConfig'
import {useMapTokenList} from '../../hooks/useTokenList'
import ConfirmModal from './ConfirmModal'

export const PageType = {
  shuttle: 'shuttle',
  tokenList: 'tokenList',
  confirmModal: 'confirmModal',
}

export const PageContext = createContext({type: PageType.shuttle})

export function useToken(fromChain, fromTokenAddress) {
  const tokenList = useMapTokenList(fromChain)
  const data =
    tokenList.filter(token => token.address === fromTokenAddress) || []
  return data && data[0]
}

function Shuttle() {
  const location = useLocation()
  const history = useHistory()
  const [pageType, setPageType] = useState('shuttleform')
  const [pageProps, setPageProps] = useState({})
  const [fromChain, setFromChain] = useState(DefaultFromChain)
  const [toChain, setToChain] = useState(DefaultToChain)
  const [fromTokenAddress, setFromTokenAddress] = useState('')
  const token = useToken(fromChain, fromTokenAddress)

  //TODO: set default fromToken when the fromToken is not in tokenList

  /**
   * 1. The fromChain and toChain must be in the SupportChains list
   * 2. The fromChain and toChain must be different, the one must be cfx chain , another one must be not cfx chain
   */
  useEffect(() => {
    const {fromChain, toChain, fromTokenAddress, ...others} = queryString.parse(
      location.search,
    )
    let nFromChain =
      SupportedChains.indexOf(fromChain) !== -1 ? fromChain : DefaultFromChain
    let nToChain =
      SupportedChains.indexOf(toChain) !== -1 ? toChain : DefaultToChain
    if (fromChain === toChain && fromChain === KeyOfCfx) {
      nFromChain = DefaultFromChain
    }
    if (fromChain === toChain && fromChain !== KeyOfCfx) {
      nFromChain = KeyOfCfx
    }
    let nFromTokenAddress = fromTokenAddress
    if (!fromTokenAddress) {
      nFromTokenAddress = ChainConfig[fromChain]?.tokenName?.toLowerCase()
    } else {
      if (!token) {
        nFromTokenAddress = ChainConfig[fromChain]?.tokenName?.toLowerCase()
      }
    }
    setFromChain(nFromChain)
    setToChain(nToChain)
    setFromTokenAddress(nFromTokenAddress)
    const pathWithQuery = queryString.stringifyUrl({
      url: location.pathname,
      query: {
        ...others,
        fromChain: nFromChain,
        toChain: nToChain,
        fromTokenAddress: nFromTokenAddress,
      },
    })
    history.push(pathWithQuery)
    setPageType(PageType.shuttle)
    // TODO:(discussion)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, location.pathname, location.search, JSON.stringify(token)])

  return (
    <PageContext.Provider
      value={{type: pageType, setPageType, pageProps, setPageProps}}
    >
      <div className="flex justify-center px-3 md:px-0">
        {pageType === PageType.shuttle && (
          <ShuttleForm
            fromChain={fromChain}
            toChain={toChain}
            fromTokenAddress={fromTokenAddress}
            token={token}
          />
        )}
        {pageType === PageType.tokenList && (
          <TokenList
            chain={pageProps && pageProps.chain}
            selectedToken={(pageProps && pageProps.selectedToken) || {}}
          />
        )}
      </div>
      <ConfirmModal
        open={pageType === PageType.confirmModal}
        fromChain={pageProps.fromChain}
        toChain={pageProps.toChain}
        value={pageProps.value}
        fromToken={pageProps.fromToken || {}}
      />
    </PageContext.Provider>
  )
}

export default Shuttle
