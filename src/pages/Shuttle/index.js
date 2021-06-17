import {createContext, useState, useEffect} from 'react'
import queryString from 'query-string'
import {useHistory, useLocation} from 'react-router-dom'
import {useEffectOnce} from 'react-use'

import ShuttleForm from './ShuttleForm'
import TokenList from './TokenList'
import {
  DefaultFromChain,
  DefaultToChain,
  SupportedChains,
  ChainConfig,
} from '../../constants/chainConfig'
import {useMapTokenList} from '../../hooks/useTokenList'
import ConfirmModal from './ConfirmModal'
import {useShuttleState} from '../../state'

export const PageType = {
  shuttle: 'shuttle',
  tokenList: 'tokenList',
  confirmModal: 'confirmModal',
}

export const PageContext = createContext({type: PageType.shuttle})

export function useTokenInfo(fromChain, fromToken) {
  const tokenList = useMapTokenList(fromChain)
  const data = tokenList.filter(token => token.address === fromToken) || []
  return data && data[0]
}

function Shuttle() {
  const location = useLocation()
  const history = useHistory()
  const [pageType, setPageType] = useState('shuttleform')
  const [pageProps, setPageProps] = useState({})
  const [fromChain, setFromChain] = useState(DefaultFromChain)
  const [toChain, setToChain] = useState(DefaultToChain)
  const [fromToken, setFromToken] = useState('')
  const tokenInfo = useTokenInfo(fromChain, fromToken)
  const {setBtcAddress} = useShuttleState()
  useEffectOnce(() =>
    setBtcAddress('bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'),
  )

  //TODO: set default fromToken when the fromToken is not in tokenList

  // useEffect(() => {
  //   console.log('eeee')
  //   const {fromToken,...others} = queryString.parse(location.search)

  //   let nFromToken =fromToken
  //   if(!tokenInfo){
  //     nFromToken=ChainConfig[fromChain]?.tokenName?.toLowerCase()
  //   }
  //   setFromToken(nFromToken)
  //   const pathWithQuery = queryString.stringifyUrl({
  //     url: location.pathname,
  //     query: {
  //       ...others,
  //       fromToken:nFromToken
  //     },
  //   })
  //   history.push(pathWithQuery)
  // }, [fromChain, history, location.pathname, location.search, tokenInfo]);

  useEffect(() => {
    const {fromChain, toChain, fromToken, ...others} = queryString.parse(
      location.search,
    )
    const nFromChain =
      SupportedChains.indexOf(fromChain) !== -1 ? fromChain : DefaultFromChain
    const nToChain =
      SupportedChains.indexOf(toChain) !== -1 ? toChain : DefaultToChain
    let nFromToken = fromToken
    if (!fromToken) {
      nFromToken = ChainConfig[fromChain]?.tokenName?.toLowerCase()
    }
    setFromChain(nFromChain)
    setToChain(nToChain)
    setFromToken(nFromToken)
    const pathWithQuery = queryString.stringifyUrl({
      url: location.pathname,
      query: {
        ...others,
        fromChain: nFromChain,
        toChain: nToChain,
        fromToken: nFromToken,
      },
    })
    history.push(pathWithQuery)
    setPageType(PageType.shuttle)
  }, [history, location.pathname, location.search])

  return (
    <PageContext.Provider
      value={{type: pageType, setPageType, pageProps, setPageProps}}
    >
      <div className="flex justify-center">
        {pageType === PageType.shuttle && (
          <ShuttleForm
            fromChain={fromChain}
            toChain={toChain}
            fromToken={fromToken}
            tokenInfo={tokenInfo}
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
        fromTokenInfo={pageProps.fromTokenInfo || {}}
      />
    </PageContext.Provider>
  )
}

export default Shuttle
