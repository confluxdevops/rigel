import {useState} from 'react'
import {useEffectOnce} from 'react-use'
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
} from '../../constants/chainConfig'
import {TxReceiptModalType} from '../../constants'
import ConfirmModal from './ConfirmModal'
import {useShuttleState} from '../../state'
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
  const fromToken = useFromToken(fromChain, fromTokenAddress)
  const toToken = useToToken(toChain, fromTokenAddress)

  const {setFromBtcAddress} = useShuttleState()
  useEffectOnce(() =>
    setFromBtcAddress('bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'),
  )
  //TODO: set default fromToken when the fromToken is not in tokenList

  /**
   * 1. The fromChain and toChain must be in the SupportChains list
   * 2. The fromChain and toChain must be different, the one must be cfx chain , another one must be not cfx chain
   */
  useEffectOnce(() => {
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
  })

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
        />
      )}
      {tokenListShow && (
        <TokenList chain={fromChain} selectedToken={fromToken} />
      )}
      {confirmModalShow && (
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
