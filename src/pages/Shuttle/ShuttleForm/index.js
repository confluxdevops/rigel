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
import {useIsCfxChain} from '../../../hooks'
import {BgChange} from '../../../assets/svg'
import {PageContext, PageType} from '../../Shuttle'
import {getMaxAmount} from '../../../utils'
import {BigNumZero} from '../../../constants'

function ShuttleForm({fromChain, toChain, fromToken, tokenInfo = {}}) {
  const {t} = useTranslation()
  const location = useLocation()
  const history = useHistory()
  const [balanceVal, setBalanceVal] = useState(BigNumZero.toString(10))
  const [maxAmount, setMaxAmount] = useState(BigNumZero.toString(10))
  const [amountVal, setAmountVal] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [btnDisabled, setBtnDisabled] = useState(true)
  const {address: fromAddress} = useWallet(fromChain)
  const isNativeToken = useIsNativeToken(fromChain, fromToken)
  const isCfxChain = useIsCfxChain(fromChain)
  const balance = useBalance(
    fromChain,
    fromAddress,
    isCfxChain ? tokenInfo?.ctoken : tokenInfo?.reference,
    fromAddress,
  )
  const {setPageType, setPageProps} = useContext(PageContext)

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
        fromToken: '',
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
        fromToken:
          fromChain !== KeyOfCfx ? tokenInfo?.ctoken : tokenInfo?.reference,
      },
    })
    history.push(pathWithQuery)
    setAmountVal('')
  }

  const onChooseToken = () => {
    setPageType(PageType.tokenList)
    setPageProps({chain: fromChain, selectedToken: tokenInfo})
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

  function validateData(value) {
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
      setBalanceVal(convertDecimal(balance, undefined, tokenInfo?.decimal))
    }
  }, [balance, fromAddress, tokenInfo?.decimal])

  useEffect(() => {
    const maxAmount = isNativeToken
      ? getMaxAmount(fromChain, balanceVal)
      : balanceVal

    setMaxAmount(maxAmount.toString(10))
  }, [balanceVal, fromChain, isNativeToken])

  useEffect(() => {
    if (amountVal && !errorMsg) {
      setBtnDisabled(false)
    } else {
      setBtnDisabled(true)
    }
  }, [amountVal, errorMsg])

  return (
    <div className="flex flex-col mt-16 w-110 items-center shadow-common p-6 bg-gray-0 rounded-2.5xl">
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
              token={tokenInfo}
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
            <TokenSelect
              token={tokenInfo}
              type="to"
              chain={toChain}
            ></TokenSelect>
          </div>
        </div>
      </div>
      <Button className="mt-6" fullWidth disabled={btnDisabled}>
        {t('next')}
      </Button>
    </div>
  )
}

ShuttleForm.propTypes = {
  fromChain: PropTypes.oneOf(SupportedChains).isRequired,
  toChain: PropTypes.oneOf(SupportedChains).isRequired,
  fromToken: PropTypes.string,
  tokenInfo: PropTypes.object,
}

export default ShuttleForm
