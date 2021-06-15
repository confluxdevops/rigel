import {useEffect, useState} from 'react'
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
import {ChangeWithBg} from '../../../assets/svg'
import TokenSelect from './TokenSelect'
import {AccountStatus} from '../../components'
import {useWallet} from '../../../hooks/useWallet'

const TokenSample = {
  burn_fee: '5834000',
  // ctoken: 'cfxtest:acbp2sm9d1ajzthsep0nkmpm0su0n4dzmeexzdcksf',
  decimals: 6,
  icon: 'https://conflux-static.oss-cn-beijing.aliyuncs.com/icons/default.png',
  id: 58,
  in_token_list: 1,
  is_admin: 0,
  minimal_burn_value: '19527000',
  minimal_mint_value: '0',
  mint_fee: '0',
  // name: 'conflux USD Tether',
  origin: 'eth',
  address: '0xae080e58d91cf0b8a8de18ddcf92b9e5fbfadec5',
  name: 'USD Tether',
  symbol: 'usdt',
  sponsor: 'cfxtest:aajbjw3xb9u581j4hn0n15ys7t6f61kr1628kf304y',
  sponsor_value: '2999860445361000000',
  supported: 1,
  // symbol: 'cUSDT',
  to_chain: 'cfx',
  total_supply: '99997085589000000000000',
  wallet_fee: '0',
}

function ShuttleForm() {
  const {t} = useTranslation()
  const location = useLocation()
  const history = useHistory()
  const [fromChain, setFromChain] = useState(DefaultFromChain)
  const [toChain, setToChain] = useState(DefaultToChain)
  const [others, setOthers] = useState({})
  const [balanceVal] = useState(0)
  const {address: fromAddress} = useWallet(fromChain)
  const onChainChange = (chain, type) => {
    if (type === 'from' && chain === toChain) {
      invertChain()
      return
    }
    const pathWithQuery = queryString.stringifyUrl({
      url: location.pathname,
      query: {
        ...others,
        fromChain: type === 'from' ? chain : fromChain,
        toChain:
          type === 'to' ? chain : chain !== KeyOfCfx ? KeyOfCfx : toChain,
      },
    })
    history.push(pathWithQuery)
  }

  const invertChain = () => {
    const pathWithQuery = queryString.stringifyUrl({
      url: location.pathname,
      query: {
        ...others,
        fromChain: toChain,
        toChain: fromChain,
      },
    })
    history.push(pathWithQuery)
  }

  const onChooseToken = () => {}

  useEffect(() => {
    const {fromChain, toChain, ...others} = queryString.parse(location.search)
    const nFromChain =
      SupportedChains.indexOf(fromChain) !== -1 ? fromChain : DefaultFromChain
    const nToChain =
      SupportedChains.indexOf(toChain) !== -1 ? toChain : DefaultToChain
    const nOthers = others || {}
    setFromChain(nFromChain)
    setToChain(nToChain)
    setOthers(nOthers)
    const pathWithQuery = queryString.stringifyUrl({
      url: location.pathname,
      query: {
        ...others,
        fromChain: nFromChain,
        toChain: nToChain,
      },
    })
    history.push(pathWithQuery)
  }, [history, location.pathname, location.search])

  return (
    <div className="flex flex-col mt-16 w-110 items-center shadow-common p-6">
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
              token={TokenSample}
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
      <WrapIcon type="circle" size="w-8 h-8" className="my-4">
        <ChangeWithBg onClick={invertChain} />
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
              token={TokenSample}
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

export default ShuttleForm
