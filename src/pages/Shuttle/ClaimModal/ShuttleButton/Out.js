import {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {useTranslation} from 'react-i18next'
import Big from 'big.js'

import {Button} from '../../../../components'
import {SupportedChains, KeyOfCfx} from '../../../../constants/chainConfig'
import useShuttleAddress from '../../../../hooks/useShuttleAddress'
import {useIsCfxChain, useIsBtcChain} from '../../../../hooks'
import {useShuttleContract} from '../../../../hooks/useShuttleContract'
import {ContractType} from '../../../../constants/contractConfig'
import {useCustodianData} from '../../../../hooks/useShuttleData'
import {
  ZeroAddrHex,
  TypeTransaction,
  SendStatus,
  ProxyUrlPrefix,
} from '../../../../constants'
import {useShuttleState} from '../../../../state'
import {getExponent, calculateGasMargin, updateTx} from '../../../../utils'
import {useTxState} from '../../../../state/transaction'
import {requestUserOperationByHash} from '../../../../utils/api'
import {useAllTokenList} from '../../../../hooks/useTokenList'
import {mapData} from '../../../../hooks/useTransaction'

function ShuttleOutButton({
  fromChain,
  toChain,
  fromToken,
  toToken,
  value,
  onClose,
  disabled,
  setTxHash,
  fromAddress,
  toAddress,
  setSendStatus,
}) {
  const {t} = useTranslation()
  const {origin, decimals, ctoken} = toToken
  const isCfxChain = useIsCfxChain(origin)
  const isToChainBtc = useIsBtcChain(toChain)
  const [outAddress, setOutAddress] = useState('')
  const shuttleAddress = useShuttleAddress(
    outAddress,
    fromChain,
    toChain,
    'out',
  )
  const tokenBaseContract = useShuttleContract(ContractType.tokenBase)
  const drCfxContract = useShuttleContract(
    ContractType.depositRelayerCfx,
    toChain,
  )
  const {out_fee} = useCustodianData(toChain, toToken)
  const {toBtcAddress} = useShuttleState()
  const [didMount, setDidMount] = useState(false)
  const {unshiftTx, transactions, setTransactions} = useTxState()
  const tokenList = useAllTokenList()
  window._transactions = new Map(Object.entries(transactions))
  useEffect(() => {
    setDidMount(true)
    if (isToChainBtc) {
      setOutAddress(toBtcAddress)
    } else {
      setOutAddress(toAddress)
    }
    return () => {
      setDidMount(false)
    }
  }, [isToChainBtc, toAddress, toBtcAddress])

  function getShuttleStatusData(hash, type = TypeTransaction.transaction) {
    const data = {
      hash: hash,
      fromChain,
      toChain,
      fromAddress,
      toAddress,
      amount: new Big(value).toString(10),
      fromToken,
      toToken,
      tx_type: type,
      shuttleAddress: shuttleAddress,
    }
    return data
  }

  function fetchShuttleData(hash) {
    const interval = setInterval(async () => {
      const operationData = await requestUserOperationByHash(
        ProxyUrlPrefix.shuttleflow,
        hash,
        'out',
        origin,
        isCfxChain ? toChain : KeyOfCfx,
      )
      if (operationData?.tx_to && operationData?.tx_input) {
        setSendStatus(SendStatus.claim)
        updateTx(window._transactions, hash, mapData(operationData, tokenList))
        setTransactions(window._transactions)
        interval && clearInterval(interval)
      }
    }, 1000)
  }

  const onSubmit = async () => {
    onClose && onClose()
    setSendStatus(SendStatus.ongoing)
    if (isCfxChain) {
      const amountVal = Big(value).mul(getExponent(decimals))
      if (ctoken === KeyOfCfx) {
        try {
          const estimateData = await drCfxContract
            .deposit(toAddress, ZeroAddrHex)
            .estimateGasAndCollateral({
              from: fromAddress,
              value: amountVal,
            })
          const txHash = await drCfxContract
            .deposit(toAddress, ZeroAddrHex)
            .sendTransaction({
              from: fromAddress,
              value: amountVal,
              gas: calculateGasMargin(estimateData?.gasLimit, 0.5),
              storageLimit: calculateGasMargin(
                estimateData?.storageCollateralized,
                0.5,
              ),
            })
          unshiftTx(getShuttleStatusData(txHash))
          fetchShuttleData(txHash)
          setTxHash(txHash)
          setSendStatus(SendStatus.success)
        } catch {
          setSendStatus(SendStatus.error)
        }
      } else {
        try {
          const estimateData = await drCfxContract
            .depositToken(ctoken, toAddress, ZeroAddrHex, amountVal)
            .estimateGasAndCollateral({
              from: fromAddress,
            })
          const txHash = await drCfxContract
            .depositToken(ctoken, toAddress, ZeroAddrHex, amountVal)
            .sendTransaction({
              from: fromAddress,
              gas: calculateGasMargin(estimateData?.gasLimit, 0.5),
              storageLimit: calculateGasMargin(
                estimateData?.storageCollateralized,
                0.5,
              ),
            })
          unshiftTx(getShuttleStatusData(txHash))
          fetchShuttleData(txHash)
          setTxHash(txHash)
          setSendStatus(SendStatus.success)
        } catch {
          setSendStatus(SendStatus.error)
        }
      }
    } else {
      const amountVal = Big(value).mul(getExponent(18))
      try {
        const data = await tokenBaseContract['burn'](
          fromAddress,
          amountVal,
          Big(out_fee).mul(getExponent(18)),
          outAddress,
          ZeroAddrHex,
        ).sendTransaction({
          from: fromAddress,
          to: ctoken,
        })
        unshiftTx(getShuttleStatusData(data))
        fetchShuttleData(data)
        setTxHash(data)
        setSendStatus(SendStatus.success)
      } catch {
        setSendStatus(SendStatus.error)
      }
    }
  }

  if (!didMount) {
    return null
  }
  return (
    <>
      {
        <Button
          onClick={onSubmit}
          disabled={disabled}
          size="small"
          id="shuttleOut"
        >
          {t('send')}
        </Button>
      }
    </>
  )
}

ShuttleOutButton.propTypes = {
  fromChain: PropTypes.oneOf(SupportedChains).isRequired,
  toChain: PropTypes.oneOf(SupportedChains).isRequired,
  fromToken: PropTypes.object.isRequired,
  toToken: PropTypes.object.isRequired,
  value: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  disabled: PropTypes.bool,
  setTxHash: PropTypes.func,
  fromAddress: PropTypes.string,
  toAddress: PropTypes.string,
  setSendStatus: PropTypes.func,
}

export default ShuttleOutButton
