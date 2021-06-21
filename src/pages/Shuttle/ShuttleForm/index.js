import {useState, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import {useTranslation} from 'react-i18next'
import {useHistory, useLocation} from 'react-router-dom'
import {convertDecimal} from '@cfxjs/data-format'
import Big from 'big.js'

import ChainSelect from './ChainSelect'
import {WrapIcon, Button, Input, Tag} from '../../../components'
import {
  DefaultFromChain,
  DefaultToChain,
  KeyOfCfx,
  SupportedChains,
} from '../../../constants/chainConfig'
import TokenSelect from './TokenSelect'
import {AccountStatus} from '../../components'
import {useWallet, useBalance, useIsNativeToken} from '../../../hooks/useWallet'
import {useIsCfxChain, useIsBtcChain} from '../../../hooks'
import {BgChange} from '../../../assets/svg'
import {PageContext, PageType} from '../../Shuttle'
import {getMaxAmount} from '../../../utils'
import {checkBtcAddress} from '../../../utils/address'
import {BigNumZero} from '../../../constants'
import useShuttleAddress from '../../../hooks/useShuttleAddress'
import {useShuttleState} from '../../../state'
import {AlertTriangle} from '../../../assets/svg'

function ShuttleForm({fromChain, toChain, fromTokenAddress, token = {}}) {
  const {t} = useTranslation()
  const location = useLocation()
  const history = useHistory()
  const [balanceVal, setBalanceVal] = useState(BigNumZero.toString(10))
  const [maxAmount, setMaxAmount] = useState(BigNumZero.toString(10))
  const [amountVal, setAmountVal] = useState('')
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
  const balance = useBalance(
    fromChain,
    fromAddress,
    isFromChainCfx ? token?.ctoken : token?.reference,
    [fromAddress],
  )
  const {setPageType, setPageProps} = useContext(PageContext)
  const {setFromBtcAddress, setToBtcAddress} = useShuttleState()

  const onChainChange = (chain, type) => {
    if (type === 'from' && chain === toChain) {
      onInvertChain()
      return
    }
    const {...others} = queryString.parse(location.search)
    const pathWithQuery = queryString.stringifyUrl({
      url: location.pathname,
      query: {
        ...others,
        fromChain: type === 'from' ? chain : fromChain,
        toChain:
          type === 'to' ? chain : chain !== KeyOfCfx ? KeyOfCfx : toChain,
        fromTokenAddress: '',
      },
    })
    history.push(pathWithQuery)
  }

  const onInvertChain = () => {
    const {...others} = queryString.parse(location.search)
    const pathWithQuery = queryString.stringifyUrl({
      url: location.pathname,
      query: {
        ...others,
        fromChain: toChain,
        toChain: fromChain,
        fromTokenAddress:
          fromChain !== KeyOfCfx ? token?.ctoken : token?.reference,
      },
    })
    history.push(pathWithQuery)
    setAmountVal('')
  }

  const onChooseToken = () => {
    setPageType(PageType.tokenList)
    setPageProps({chain: fromChain, selectedToken: token})
  }

  const onMaxClick = () => {
    setAmountVal(maxAmount)
    setErrorMsg('')
  }

  const onInputChange = e => {
    let value = e.target.value
    setAmountVal(value)
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

  const onNextClick = () => {
    if (isFromChainBtc) {
      setFromBtcAddress(shuttleAddress)
    }
    if (isToChainBtc) {
      setToBtcAddress(btcAddressVal)
    }
    setPageType(PageType.confirmModal)
    setPageProps({
      fromChain,
      toChain,
      fromToken: token,
      value: amountVal,
    })
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
      setBalanceVal(convertDecimal(balance, undefined, token?.decimal))
    }
  }, [balance, fromAddress, token?.decimal])

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
      if (fromAddress && amountVal && !errorMsg) {
        setBtnDisabled(false)
      }
    } else {
      if (isFromChainBtc && toAddress && amountVal && !errorMsg) {
        setBtnDisabled(false)
      }
      if (
        isToChainBtc &&
        fromAddress &&
        amountVal &&
        !errorMsg &&
        btcAddressVal &&
        !errorBtcAddressMsg
      ) {
        setBtnDisabled(false)
      }
    }
  }, [
    amountVal,
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
    <div className="flex flex-col mt-4 md:mt-16 w-full md:w-110 items-center shadow-common py-6 px-3 md:px-6 bg-gray-0 rounded-2.5xl">
      <div className="flex w-full">
        <ChainSelect
          chain={fromChain || DefaultFromChain}
          type="from"
          onClick={onChainChange}
        ></ChainSelect>
        {/* TODO:UI */}
        <div className="flex-1 border-2 border-gray-10 rounded p-2">
          <div className="flex flex-1 justify-between">
            <TokenSelect
              token={token}
              type="from"
              chain={fromChain}
              onClick={onChooseToken}
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
              value={amountVal}
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
        {/* TODO UI */}
        <div className="flex flex-col justify-between flex-1 border-2 border-gray-10 rounded p-2">
          <div className="flex flex-1 justify-between">
            <div>{t('receiveAs')}</div>
            <AccountStatus chain={toChain} size="medium"></AccountStatus>
          </div>
          <div className="flex">
            <TokenSelect token={token} type="to" chain={toChain}></TokenSelect>
          </div>
        </div>
      </div>
      {isToChainBtc && (
        <>
          <Input
            value={btcAddressVal}
            onChange={onAddressInputChange}
            placeholder={t('destination')}
            width="w-full"
            className="mt-3"
          />
          {errorBtcAddressMsg && (
            <div className="text-xs text-error mt-2">{errorBtcAddressMsg}</div>
          )}
          <div className="flex flex-col w-full bg-warning-10 p-3 text-xs mt-3">
            <span className="text-warning-dark flex items-center">
              <AlertTriangle className="mr-2 w-4 h-4" />
              {t('notice')}
            </span>
            <ul className="text-gray-80">
              <li className="list-disc leading-4 ml-4">{t('btcTips.first')}</li>
              <li className="list-disc leading-4 ml-4">
                {t('btcTips.second')}
              </li>
              <li className="list-disc leading-4 ml-4">{t('btcTips.third')}</li>
            </ul>
          </div>
        </>
      )}
      <Button
        className="mt-6"
        fullWidth
        disabled={btnDisabled}
        onClick={onNextClick}
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
  token: PropTypes.object,
}

export default ShuttleForm
