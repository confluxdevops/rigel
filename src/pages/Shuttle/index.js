import {useState} from 'react'
import {useDeepCompareEffect} from 'react-use'
import queryString from 'query-string'
import {useHistory, useLocation} from 'react-router-dom'

import {useFromToken, useToToken} from '../../hooks/useTokenList'
import ShuttleForm from './ShuttleForm'
import TokenList from './TokenList'
import {
  DefaultFromChain,
  DefaultToChain,
  SupportedChains,
  ChainConfig,
  KeyOfCfx,
  KeyOfBtc,
} from '../../constants/chainConfig'
import {TxReceiptModalType} from '../../constants'
import ConfirmModal from './ConfirmModal'
import {TransactionReceiptionModal} from '../components'

function Shuttle() {
  const location = useLocation()
  const history = useHistory()
  const [tokenListShow, setTokenListShow] = useState(false)
  const [confirmModalShow, setConfirmModalShow] = useState(false)
  const [value, setValue] = useState('')
  const [txModalShow, setTxModalShow] = useState(false)
  const [txModalType, setTxModalType] = useState(TxReceiptModalType.ongoing)
  const [txHash, setTxHash] = useState('')
  const {fromChain, toChain, fromTokenAddress, ...others} = queryString.parse(
    location.search,
  )
  const fromToken = useFromToken(fromChain, toChain, fromTokenAddress)
  const toToken = useToToken(fromChain, toChain, fromTokenAddress)
  const btcTokenPair = useToToken(
    KeyOfBtc,
    KeyOfCfx,
    ChainConfig[KeyOfBtc]?.tokenName?.toLowerCase(),
  )

  /**
   * 1. The fromChain and toChain must be in the SupportChains list
   * 2. The fromChain and toChain must be different, the one must be cfx chain , another one must be not cfx chain
   */
  useDeepCompareEffect(() => {
    let nFromChain =
      SupportedChains.indexOf(fromChain) !== -1 ? fromChain : DefaultFromChain
    let nToChain =
      SupportedChains.indexOf(toChain) !== -1 ? toChain : DefaultToChain
    if (fromChain === toChain) {
      nFromChain = DefaultFromChain
      nToChain = DefaultToChain
    }
    let nFromTokenAddress = fromTokenAddress
    if (!fromTokenAddress || Object.keys(fromToken).length === 0) {
      nFromTokenAddress = ChainConfig[nFromChain]?.tokenName?.toLowerCase()
    }
    if (nFromChain === KeyOfCfx && nToChain === KeyOfBtc) {
      nFromTokenAddress = btcTokenPair?.address
    }
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
  }, [
    fromChain,
    toChain,
    fromTokenAddress,
    fromToken,
    others,
    history,
    location.pathname,
    btcTokenPair?.address,
  ])

  const onSelectToken = token => {
    setTokenListShow(false)
    const pathWithQuery = queryString.stringifyUrl({
      url: location.pathname,
      query: {
        ...others,
        fromChain,
        toChain,
        fromTokenAddress: token.address,
      },
    })
    history.push(pathWithQuery)
  }

  const onChangeChain = (chain, type) => {
    if (type === 'from' && chain === toChain) {
      onInvertChain()
      return
    }
    let nFromTokenAddress
    if (type === 'from') {
      nFromTokenAddress = ChainConfig[chain]?.tokenName?.toLowerCase()
    }
    if (type === 'to' && chain === KeyOfBtc) {
      nFromTokenAddress = btcTokenPair?.address
    }
    if (type === 'to' && chain !== KeyOfBtc) {
      nFromTokenAddress = ChainConfig[fromChain]?.tokenName?.toLowerCase()
    }
    const pathWithQuery = queryString.stringifyUrl({
      url: location.pathname,
      query: {
        ...others,
        fromChain: type === 'from' ? chain : fromChain,
        toChain:
          type === 'to' ? chain : chain !== KeyOfCfx ? KeyOfCfx : toChain,
        fromTokenAddress: nFromTokenAddress,
      },
    })
    history.push(pathWithQuery)
  }

  const onInvertChain = () => {
    const pathWithQuery = queryString.stringifyUrl({
      url: location.pathname,
      query: {
        ...others,
        fromChain: toChain,
        toChain: fromChain,
        fromTokenAddress: toToken?.address,
      },
    })
    history.push(pathWithQuery)
    setValue('')
  }

  if (!fromChain) return null
  return (
    <div className="flex justify-center px-3 md:px-0">
      {!tokenListShow && (
        <ShuttleForm
          fromChain={fromChain}
          toChain={toChain}
          fromTokenAddress={fromTokenAddress}
          fromToken={fromToken}
          toToken={toToken}
          onChooseToken={() => setTokenListShow(true)}
          onNextClick={() => setConfirmModalShow(true)}
          onChangeValue={value => setValue(value)}
          value={value}
          onChangeChain={onChangeChain}
          onInvertChain={onInvertChain}
        />
      )}
      {tokenListShow && (
        <TokenList
          fromChain={fromChain}
          toChain={toChain}
          selectedToken={fromToken}
          onSelectToken={onSelectToken}
          onBack={() => setTokenListShow(false)}
        />
      )}
      {true && (
        <ConfirmModal
          open={confirmModalShow}
          onClose={() => setConfirmModalShow(false)}
          fromChain={fromChain}
          toChain={toChain}
          value={value}
          fromToken={fromToken}
          setTxModalType={setTxModalType}
          setTxModalShow={setTxModalShow}
          setTxHash={setTxHash}
        />
      )}
      {txModalShow && (
        <TransactionReceiptionModal
          type={txModalType}
          open={txModalShow}
          fromChain={fromChain}
          toChain={toChain}
          fromToken={fromToken}
          toToken={toToken}
          value={value}
          txHash={txHash}
          onClose={() => setTxModalShow(false)}
        />
      )}
    </div>
  )
}

export default Shuttle
