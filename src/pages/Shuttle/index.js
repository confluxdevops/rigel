import {useState} from 'react'
import {useEffectOnce} from 'react-use'
import queryString from 'query-string'
import {useHistory, useLocation} from 'react-router-dom'

import {useToken} from '../../hooks/useTokenList'
import ShuttleForm from './ShuttleForm'
import TokenList from './TokenList'
import {
  DefaultFromChain,
  DefaultToChain,
  SupportedChains,
  ChainConfig,
} from '../../constants/chainConfig'
import ConfirmModal from './ConfirmModal'
import {useShuttleState} from '../../state'

function Shuttle() {
  const location = useLocation()
  const history = useHistory()
  const [showTokenList, setShowTokenList] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [value, setValue] = useState('')
  const [fromChain, setFromChain] = useState(DefaultFromChain)
  const [toChain, setToChain] = useState(DefaultToChain)
  const [fromTokenAddress, setFromTokenAddress] = useState('')
  // const [txModalShown, setTxModalShown] = useState(false)
  // const [txModalType, setTxModalType] = useState(TxReceiptModalType.ongoing)
  // const [txHash, setTxHash] = useState('')
  const token = useToken(fromChain, fromTokenAddress)

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
    const {fromChain, toChain, fromTokenAddress, ...others} = queryString.parse(
      location.search,
    )
    let nFromChain =
      SupportedChains.indexOf(fromChain) !== -1 ? fromChain : DefaultFromChain
    let nToChain =
      SupportedChains.indexOf(toChain) !== -1 ? toChain : DefaultToChain
    if (fromChain === toChain) {
      nFromChain = DefaultFromChain
      nToChain = DefaultToChain
    }
    let nFromTokenAddress = fromTokenAddress
    if (!fromTokenAddress || !token) {
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
  })

  return (
    <div className="flex justify-center px-3 md:px-0">
      {!showTokenList && (
        <ShuttleForm
          fromChain={fromChain}
          toChain={toChain}
          fromTokenAddress={fromTokenAddress}
          token={token}
          onChooseToken={() => setShowTokenList(true)}
          onNextClick={() => setShowConfirmModal(true)}
          onChangeValue={value => setValue(value)}
          value={value}
        />
      )}
      {showTokenList && <TokenList chain={fromChain} selectedToken={token} />}
      <ConfirmModal
        open={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        fromChain={fromChain}
        toChain={toChain}
        value={value}
        fromToken={token}
      />
      {/* {txModalShown &&     <TransactionReceiptionModal
        type={txModalType}
        open={txModalShown}
        fromChain={fromChain}
        toChain={toChain}
        fromToken={token}
        toToken={}
        value={value}
        txHash={txHash}
      />} */}
    </div>
  )
}

export default Shuttle
