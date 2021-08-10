import {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {useTranslation} from 'react-i18next'
import Big from 'big.js'

import {Button} from '../../../../components'
import {Send} from '../../../../assets/svg'
import {SupportedChains, KeyOfCfx} from '../../../../constants/chainConfig'
import useShuttleAddress from '../../../../hooks/useShuttleAddress'
import {useIsCfxChain, useIsBtcChain} from '../../../../hooks'
import {useShuttleContract} from '../../../../hooks/useShuttleContract'
import {ContractType} from '../../../../constants/contractConfig'
import {useCustodianData} from '../../../../hooks/useShuttleData'
import {
  ZeroAddrHex,
  TxReceiptModalType,
  TypeTransaction,
} from '../../../../constants'
import {useShuttleState} from '../../../../state'
import {getExponent} from '../../../../utils'
import {useTxState} from '../../../../state/transaction'

function ShuttleOutButton({
  fromChain,
  toChain,
  fromToken,
  toToken,
  value,
  onClose,
  disabled,
  setTxModalType,
  setTxModalShow,
  setTxHash,
  fromAddress,
  toAddress,
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
  const confluxJS = window?.confluxJS
  const {out_fee} = useCustodianData(toChain, toToken)
  const {toBtcAddress} = useShuttleState()
  const [didMount, setDidMount] = useState(false)
  const {unshiftTx} = useTxState()

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

  const onSubmit = async () => {
    setTxModalShow(true)
    onClose && onClose()
    setTxModalType(TxReceiptModalType.ongoing)
    if (isCfxChain) {
      const amountVal = Big(value).mul(getExponent(decimals))
      if (ctoken === KeyOfCfx) {
        try {
          const data = await confluxJS.sendTransaction({
            from: fromAddress,
            to: shuttleAddress,
            value: amountVal,
          })
          unshiftTx(getShuttleStatusData(data))
          setTxHash(data)
          setTxModalType(TxReceiptModalType.success)
        } catch {
          setTxModalType(TxReceiptModalType.error)
        }
      } else {
        try {
          const data = await tokenBaseContract
            .transfer(shuttleAddress, amountVal)
            .sendTransaction({
              from: fromAddress,
              to: ctoken,
            })
          unshiftTx(getShuttleStatusData(data))
          setTxHash(data)
          setTxModalType(TxReceiptModalType.success)
        } catch {
          setTxModalType(TxReceiptModalType.error)
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
        setTxHash(data)
        setTxModalType(TxReceiptModalType.success)
      } catch {
        setTxModalType(TxReceiptModalType.error)
      }
    }
  }

  if (!didMount) {
    return null
  }
  return (
    <Button
      startIcon={<Send />}
      onClick={onSubmit}
      disabled={disabled}
      size="large"
      id="shuttleOut"
    >
      {t('send')}
    </Button>
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
  setTxModalType: PropTypes.func,
  setTxHash: PropTypes.func,
  setTxModalShow: PropTypes.func,
  fromAddress: PropTypes.string,
  toAddress: PropTypes.string,
}

export default ShuttleOutButton
