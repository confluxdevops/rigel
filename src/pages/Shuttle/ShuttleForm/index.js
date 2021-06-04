import {useEffect} from 'react'
import queryString from 'query-string'
import {useTranslation} from 'react-i18next'
import {useHistory, useLocation} from 'react-router-dom'

import {ChainSelect} from '../components'
import {WrapIcon, Button} from '../../../components'
import {
  DefaultFromChain,
  DefaultToChain,
  KeyOfCfx,
} from '../../../constants/chainConfig'
import {ChangeWithBg} from '../../../assets/svg'

function ShuttleForm() {
  const {t} = useTranslation()
  const location = useLocation()
  const history = useHistory()
  const {fromChain, toChain, ...others} = queryString.parse(location.search)

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

  useEffect(() => {
    if (!fromChain || !toChain) {
      const nFromChain = fromChain || DefaultFromChain
      const nToChain = toChain || DefaultToChain
      const pathWithQuery = queryString.stringifyUrl({
        url: location.pathname,
        query: {
          ...others,
          fromChain: nFromChain,
          toChain: nToChain,
        },
      })
      history.push(pathWithQuery)
    }
  }, [fromChain, toChain, history, location.pathname, others])

  return (
    <div className="flex flex-col mt-16 w-110 items-center shadow-common p-6">
      <div className="flex w-full">
        <ChainSelect
          chain={fromChain || DefaultFromChain}
          type="from"
          onClick={onChainChange}
        ></ChainSelect>
        {/* TODO SelectToken */}
        <div className="flex-1"></div>
      </div>
      <WrapIcon type="circle" size="w-8 h-8" className="my-4">
        <ChangeWithBg />
      </WrapIcon>
      <div className="flex w-full">
        <ChainSelect
          chain={toChain || DefaultToChain}
          type="to"
          onClick={onChainChange}
          fromChain={fromChain || DefaultFromChain}
        ></ChainSelect>
        {/* TODO SelectToken */}
        <div className="flex-1"></div>
      </div>
      <Button className="mt-6" fullWidth>
        {t('next')}
      </Button>
    </div>
  )
}

export default ShuttleForm
