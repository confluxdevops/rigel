import {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {useTranslation} from 'react-i18next'
import {convertDecimal} from '@cfxjs/data-format'
import Big from 'big.js'

import ChainSelect from './ChainSelect'
import {WrapIcon, Button, Input, Tag} from '../../../components'
import {
  DefaultFromChain,
  DefaultToChain,
  SupportedChains,
} from '../../../constants/chainConfig'
import TokenSelect from './TokenSelect'
import {AccountStatus} from '../../components'
import {useWallet, useBalance, useIsNativeToken} from '../../../hooks/useWallet'
import {BgChange} from '../../../assets/svg'
import {getMaxAmount} from '../../../utils'
import {BigNumZero} from '../../../constants'

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
  onChainChange,
  onInvertChain,
}) {
  const {t} = useTranslation()
  const [balanceVal, setBalanceVal] = useState(BigNumZero.toString(10))
  const [maxAmount, setMaxAmount] = useState(BigNumZero.toString(10))
  const [errorMsg, setErrorMsg] = useState('')
  const [btnDisabled, setBtnDisabled] = useState(true)
  const {address: fromAddress} = useWallet(fromChain)
  const isNativeToken = useIsNativeToken(fromChain, fromTokenAddress)
  const {address, decimal} = fromToken
  const balance = useBalance(fromChain, fromAddress, address, [fromAddress])

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

  function validateData(value) {
    if (!fromAddress) return ''
    const val = Number(value)
    let error = ''
    if (!isNaN(val)) {
      const valBig = new Big(val)
      if (valBig.gt(0)) {
        //must be greater than zero
        if (!valBig.lte(maxAmount)) {
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
    if (fromAddress && value && !errorMsg) {
      setBtnDisabled(false)
    } else {
      setBtnDisabled(true)
    }
  }, [value, errorMsg, fromAddress])

  return (
    <div className="flex flex-col mt-4 md:mt-16 w-full md:w-110 items-center shadow-common py-6 px-3 md:px-6 bg-gray-0 rounded-2.5xl h-fit">
      <div className="flex w-full">
        <ChainSelect
          chain={fromChain || DefaultFromChain}
          type="from"
          onClick={onChainChange}
        ></ChainSelect>
        {/* TODO:UI and extract componnent FromToken */}
        <div className="flex-1 border-2 border-gray-10 rounded p-2">
          <div className="flex flex-1 justify-between">
            <TokenSelect
              token={fromToken}
              type="from"
              chain={fromChain}
              onClick={() => onChooseToken && onChooseToken()}
            ></TokenSelect>
            <AccountStatus chain={fromChain} size="medium"></AccountStatus>
          </div>
          <div className="flex justify-end">
            {fromAddress && (
              <div>
                <span>{t('balance')}</span>
                <span className="ml-2">{balanceVal}</span>
              </div>
            )}
          </div>
          <div className="flex">
            <Input
              bordered={false}
              value={value}
              onChange={onInputChange}
              placeholder="0.00"
            />
            {fromAddress && <Tag onClick={onMaxClick}>{t('max')}</Tag>}
          </div>
        </div>
      </div>
      {errorMsg && <div className="text-xs text-error mt-2">{errorMsg}</div>}
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
          onClick={onChainChange}
          fromChain={fromChain || DefaultFromChain}
        ></ChainSelect>
        {/* TODO:UI and extract componnent ToToken */}
        <div className="flex flex-col justify-between flex-1 border-2 border-gray-10 rounded p-2">
          <div className="flex flex-1 justify-between">
            <div>{t('receiveAs')}</div>
            <AccountStatus chain={toChain} size="medium"></AccountStatus>
          </div>
          <div className="flex">
            <TokenSelect
              token={toToken}
              type="to"
              chain={toChain}
            ></TokenSelect>
          </div>
        </div>
      </div>
      <Button
        className="mt-6"
        fullWidth
        size="large"
        disabled={btnDisabled}
        onClick={() => onNextClick && onNextClick()}
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
  onChainChange: PropTypes.func,
  onInvertChain: PropTypes.func,
}

export default ShuttleForm
