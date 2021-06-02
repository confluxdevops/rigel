import {useEffect} from 'react'
import queryString from 'query-string'
import {useHistory, useLocation} from 'react-router-dom'

import ChainSelect from '../components/ChainSelect'
import {
  DefaultFromChain,
  DefaultToChain,
  KeyOfCfx,
} from '../../constants/chainConfig'

function Shuttle() {
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
    <>
      <div className="flex flex-col mt-12">
        <div className="flex">
          <div className="mr-4 ml-4 w-24">
            <ChainSelect
              chain={fromChain || DefaultFromChain}
              type="from"
              onClick={onChainChange}
            ></ChainSelect>
          </div>
          <div>
            <span>test2</span>
          </div>
        </div>
        <div className="mr-4 ml-4 mt-24 w-24">
          <ChainSelect
            chain={toChain || DefaultToChain}
            type="to"
            onClick={onChainChange}
            fromChain={fromChain || DefaultFromChain}
          ></ChainSelect>
        </div>
      </div>
    </>
  )
}

export default Shuttle
