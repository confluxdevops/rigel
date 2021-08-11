import {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {useTranslation} from 'react-i18next'
import Big from 'big.js'
import {MaxUint256} from '@ethersproject/constants'

import {Button, Loading} from '../../../../components'
import {SupportedChains, KeyOfCfx} from '../../../../constants/chainConfig'
import useShuttleAddress from '../../../../hooks/useShuttleAddress'
import {useIsCfxChain, useIsBtcChain} from '../../../../hooks'
import {useShuttleContract} from '../../../../hooks/useShuttleContract'
import {
  ContractType,
  ContractConfig,
} from '../../../../constants/contractConfig'
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
import {useTokenContract, useTokenAllowance} from '../../../../hooks/usePortal'
import {useIsNativeToken} from '../../../../hooks/useWallet'
import {requestUserOperationByHash} from '../../../../utils/api'

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
  const {display_symbol} = fromToken
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
  window._transactions = new Map(Object.entries(transactions))
  const drContractAddress =
    ContractConfig[ContractType.depositRelayerCfx]?.address?.[toChain]
  const [approveShown, setApproveShown] = useState(false)
  const [isApproving, setIsApproving] = useState(false)
  const [fetchApprove, setFetchApprove] = useState(false)
  const tokenContract = useTokenContract(ctoken)
  const tokenAllownace = useTokenAllowance(ctoken, [
    fromAddress,
    drContractAddress,
  ])
  const isNativeToken = useIsNativeToken(fromChain, ctoken)
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

  useEffect(() => {
    setDidMount(true)
    if (
      isCfxChain &&
      !isNativeToken &&
      new Big(tokenAllownace.toString(10)).lt(
        new Big(value).times(getExponent(decimals)),
      )
    ) {
      setApproveShown(true)
    } else {
      setApproveShown(false)
    }
    return () => {
      setDidMount(false)
    }
  }, [decimals, tokenAllownace, value, isNativeToken, isCfxChain, fetchApprove])

  function getShuttleStatusData(hash, type = TypeTransaction.transaction) {
    let fee = out_fee ? out_fee.toString(10) : '0'
    const data = {
      hash: hash,
      fromChain,
      toChain,
      fromAddress,
      toAddress,
      amount: new Big(value).minus(fee).toString(10),
      fromToken,
      toToken,
      tx_type: type,
      shuttleAddress: shuttleAddress,
      fee,
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
        updateTx(window._transactions, hash, {
          tx_to: operationData?.tx_to,
          tx_input: operationData?.tx_input,
        })
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

  function contractApprove(tokenContract, value, gas, storage) {
    tokenContract
      .approve(drContractAddress, value)
      .sendTransaction({
        gas: gas ? calculateGasMargin(gas, 0.5) : undefined,
        from: fromAddress,
        storageLimit: storage ? calculateGasMargin(storage, 0.5) : undefined,
      })
      .confirmed()
      .then(receipt => {
        unshiftTx(
          getShuttleStatusData(
            receipt?.transactionHash,
            TypeTransaction.approve,
          ),
        )
        setFetchApprove(!fetchApprove)
        setIsApproving(false)
        setApproveShown(false)
      })
      .catch(() => {
        setIsApproving(false)
      })
  }

  const onApprove = async () => {
    if (isApproving) return
    setIsApproving(true)
    //MaxUint256
    tokenContract
      .approve(drContractAddress, MaxUint256)
      .estimateGasAndCollateral({
        from: fromAddress,
      })
      .then(estimateData => {
        contractApprove(
          tokenContract,
          MaxUint256,
          estimateData?.gasLimit,
          estimateData?.storage,
        )
      })
      .catch(error => {
        if (error.data && error.data.code === -32000) {
          contractApprove(tokenContract, 0)
        } else {
          setIsApproving(false)
        }
      })
  }

  if (!didMount) {
    return null
  }
  return (
    <>
      {approveShown && (
        <Button
          fullWidth
          onClick={onApprove}
          disabled={disabled}
          size="large"
          id="approve"
        >
          {isApproving && <Loading className="!w-6 !h-6" />}
          {!isApproving && t('approve', {tokenSymbol: display_symbol})}
        </Button>
      )}
      {!approveShown && (
        <Button
          onClick={onSubmit}
          disabled={disabled}
          size="small"
          id="shuttleOut"
        >
          {t('send')}
        </Button>
      )}
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
