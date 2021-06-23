import {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {useTranslation} from 'react-i18next'
import {convertDecimal} from '@cfxjs/data-format'
import Big from 'big.js'

import {WrapIcon, Button} from '../../../components'
import {
  DefaultFromChain,
  DefaultToChain,
  SupportedChains,
} from '../../../constants/chainConfig'

import {useWallet, useBalance, useIsNativeToken} from '../../../hooks/useWallet'
import {useIsCfxChain, useIsBtcChain} from '../../../hooks'
import {BgChange} from '../../../assets/svg'
import {getMaxAmount} from '../../../utils'
import {checkBtcAddress} from '../../../utils/address'
import {BigNumZero} from '../../../constants'
import useShuttleAddress from '../../../hooks/useShuttleAddress'
import {useShuttleState} from '../../../state'
import ChainSelect from './ChainSelect'
import FromToken from './FromToken'
import ToToken from './ToToken'
import ToBtcAddress from './ToBtcAddress'

function ShuttleForm({
  fromChain,
  toChain,
  fromTokenAddress,
  fromToken,
  toToken,
  onChooseToken,
  onNextClick,
  onChangeValue,
  value,
  onChangeChain,
  onInvertChain,
}) {
  const {t} = useTranslation()
  const [balanceVal, setBalanceVal] = useState(BigNumZero.toString(10))
  const [maxAmount, setMaxAmount] = useState(BigNumZero.toString(10))
  const [errorMsg, setErrorMsg] = useState('')
  const [errorBtcAddressMsg, setErrorBtcAddressMsg] = useState('')
  const [btcAddressVal, setBtcAddressVal] = useState('')
  const [originalShuttleAddress, setOriginalShuttleAddress] = useState()
  const [btnDisabled, setBtnDisabled] = useState(true)
  const {address: fromAddress} = useWallet(fromChain)
  const {address: toAddress} = useWallet(toChain)
  const isNativeToken = useIsNativeToken(fromChain, fromTokenAddress)
  const isFromChainCfx = useIsCfxChain(fromChain)
  const isToChainCfx = useIsCfxChain(toChain)
  const isFromChainBtc = useIsBtcChain(fromChain)
  const isToChainBtc = useIsBtcChain(toChain)
  const shuttleAddress = useShuttleAddress(
    originalShuttleAddress,
    fromChain,
    toChain,
    isFromChainCfx ? 'out' : 'in',
  )
  const {address, decimal} = fromToken
  const balance = useBalance(fromChain, fromAddress, address, [fromAddress])
  const {setFromBtcAddress, setToBtcAddress} = useShuttleState()

  const onMaxClick = () => {
    onChangeValue && onChangeValue(maxAmount)
    setErrorMsg('')
  }

  const onInputChange = e => {
    let value = e.target.value
    onChangeValue && onChangeValue(value)
    const error = validateData(value)
    setErrorMsg(error)
  }

  const onAddressInputChange = e => {
    let value = e.target.value
    setBtcAddressVal(value)
    const isBtcAddress = checkBtcAddress(value)
    if (!isBtcAddress) {
      setErrorBtcAddressMsg(t('error.addressInvalid'))
    } else {
      setErrorBtcAddressMsg('')
    }
  }

  const onNextBtnClick = () => {
    if (isFromChainBtc) {
      setFromBtcAddress(shuttleAddress)
    }
    if (isToChainBtc) {
      setToBtcAddress(btcAddressVal)
    }
    onNextClick && onNextClick()
  }

  function validateData(value) {
    if (!isFromChainBtc && !fromAddress) return ''
    const val = Number(value)
    let error = ''
    if (!isNaN(val)) {
      const valBig = new Big(val)
      if (valBig.gt(0)) {
        //must be greater than zero
        if (!isFromChainBtc && !valBig.lte(maxAmount)) {
          //must be less than Max value
          error = t('error.mustLsMax', {value: maxAmount})
        }
      } else {
        error = t('error.mustGtZero')
      }
    } else {
      //not a valid number
      error = t('error.inputValidAmount')
    }
    return error
  }

  useEffect(() => {
    if (fromAddress) {
      setBalanceVal(convertDecimal(balance, undefined, decimal))
    }
  }, [balance, fromAddress, decimal])

  useEffect(() => {
    const maxAmount = isNativeToken
      ? getMaxAmount(fromChain, balanceVal)
      : balanceVal

    setMaxAmount(maxAmount.toString(10))
  }, [balanceVal, fromChain, isNativeToken])

  useEffect(() => {
    setBtnDisabled(true)
    if (
      (!isFromChainBtc && isToChainCfx) ||
      (isFromChainCfx && !isToChainBtc)
    ) {
      if (fromAddress && value && !errorMsg) {
        setBtnDisabled(false)
      }
    } else {
      if (isFromChainBtc && toAddress && value && !errorMsg) {
        setBtnDisabled(false)
      }
      if (
        isToChainBtc &&
        fromAddress &&
        value &&
        !errorMsg &&
        btcAddressVal &&
        !errorBtcAddressMsg
      ) {
        setBtnDisabled(false)
      }
    }
  }, [
    value,
    btcAddressVal,
    errorBtcAddressMsg,
    errorMsg,
    fromAddress,
    isFromChainCfx,
    isFromChainBtc,
    isToChainBtc,
    isToChainCfx,
    toAddress,
  ])

  useEffect(() => {
    if (isFromChainBtc) {
      setOriginalShuttleAddress(toAddress)
    } else {
      setOriginalShuttleAddress('')
    }
  }, [fromChain, isFromChainBtc, toAddress])

  return (
    <div className="flex flex-col relative mt-4 md:mt-16 w-full md:w-110 items-center shadow-common py-6 px-3 md:px-6 bg-gray-0 rounded-2.5xl h-fit">
      <div className="flex w-full">
        <ChainSelect
          chain={fromChain || DefaultFromChain}
          type="from"
          onClick={onChangeChain}
        />
        <FromToken
          fromChain={fromChain}
          toChain={toChain}
          fromToken={fromToken}
          fromAddress={fromAddress}
          value={value}
          balanceVal={balanceVal}
          onMaxClick={onMaxClick}
          onChooseToken={onChooseToken}
          onInputChange={onInputChange}
        />
      </div>
      <div className="flex w-full">
        <div className="w-29.5" />
        {errorMsg && <div className="text-xs text-error mt-2">{errorMsg}</div>}
      </div>
      <WrapIcon
        type="circle"
        size="w-8 h-8"
        className="my-4"
        onClick={onInvertChain}
      >
        <BgChange />
      </WrapIcon>
      <div className="flex w-full">
        <ChainSelect
          chain={toChain || DefaultToChain}
          type="to"
          onClick={onChangeChain}
          fromChain={fromChain || DefaultFromChain}
        />
        <ToToken fromChain={fromChain} toChain={toChain} toToken={toToken} />
      </div>
      {isToChainBtc && (
        <ToBtcAddress
          btcAddressVal={btcAddressVal}
          errorBtcAddressMsg={errorBtcAddressMsg}
          onAddressInputChange={onAddressInputChange}
        />
      )}
      <Button
        className="mt-6"
        fullWidth
        size="large"
        disabled={btnDisabled}
        onClick={onNextBtnClick}
      >
        {t('next')}
      </Button>
    </div>
  )
}

ShuttleForm.propTypes = {
  fromChain: PropTypes.oneOf(SupportedChains).isRequired,
  toChain: PropTypes.oneOf(SupportedChains).isRequired,
  fromTokenAddress: PropTypes.string,
  fromToken: PropTypes.object,
  toToken: PropTypes.object,
  onChooseToken: PropTypes.func,
  onNextClick: PropTypes.func,
  onChangeValue: PropTypes.func,
  value: PropTypes.string,
  onChangeChain: PropTypes.func,
  onInvertChain: PropTypes.func,
}

export default ShuttleForm