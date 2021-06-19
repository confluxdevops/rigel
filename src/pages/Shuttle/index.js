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
  const {setFromBtcAddress} = useShuttleState()
  useEffectOnce(() =>
    setFromBtcAddress('bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'),
  )

  //TODO: set default fromToken when the fromToken is not in tokenList

  // useEffect(() => {
  //   console.log('eeee')
  //   const {fromToken,...others} = queryString.parse(location.search)

  //   let nFromToken =fromToken
  //   if(!token){
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
  // }, [fromChain, history, location.pathname, location.search, token]);

  useEffect(() => {
    const {fromChain, toChain, fromTokenAddress, ...others} = queryString.parse(
      location.search,
    )
    const nFromChain =
      SupportedChains.indexOf(fromChain) !== -1 ? fromChain : DefaultFromChain
    const nToChain =
      SupportedChains.indexOf(toChain) !== -1 ? toChain : DefaultToChain
    let nFromTokenAddress = fromTokenAddress
    if (!fromTokenAddress) {
      nFromTokenAddress = ChainConfig[fromChain]?.tokenName?.toLowerCase()
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
  }, [history, location.pathname, location.search])

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
