import {useState, useContext} from 'react'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import {useTranslation} from 'react-i18next'
import {useHistory, useLocation} from 'react-router-dom'

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
import {useWallet} from '../../../hooks/useWallet'
import {BgChange} from '../../../assets/svg'
import {PageContext, PageType} from './../index'

function ShuttleForm({fromChain, toChain, tokenInfo}) {
  const {t} = useTranslation()
  const location = useLocation()
  const history = useHistory()
  const [balanceVal] = useState(0)
  const {address: fromAddress} = useWallet(fromChain)
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
  }

  const onChooseToken = () => {
    setPageType(PageType.tokenList)
    setPageProps({chain: fromChain, selectedToken: tokenInfo})
  }

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
                <span>Balance</span>
                <span className="ml-2">{balanceVal}</span>
              </div>
            )}
          </div>
          <div className="flex">
            <Input bordered={false} />
            {fromAddress && <Tag>Max</Tag>}
          </div>
        </div>
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
          onClick={onChainChange}
          fromChain={fromChain || DefaultFromChain}
        ></ChainSelect>
        {/* TODO UI */}
        <div className="flex flex-col justify-between flex-1 border-2 border-gray-10 rounded p-2">
          <div className="flex flex-1 justify-between">
            <div>Receive as</div>
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
      <Button className="mt-6" fullWidth>
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
