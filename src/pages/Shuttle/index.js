import {useState, useEffect} from 'react'
import {usePrevious} from 'react-use'

import ChainSelect from '../components/ChainSelect'
import {DefaultFromChain, DefaultToChain} from '../../constants/chainConfig'
import {useIsCfxChain} from '../../hooks/useTokenList'
// import {useConnectWalletType} from '../../hooks/useWallet'
import {AccountStatus} from '../components'

function Shuttle() {
  const [fromChain, setFromChain] = useState(DefaultFromChain)
  const isFromCfxChain = useIsCfxChain(fromChain)
  const [toChain, setToChain] = useState(DefaultToChain)
  const prevFromChain = usePrevious(fromChain)
  const prevToChain = usePrevious(toChain)
  const fromChainClickHandler = chain => {
    setFromChain(chain)
  }
  const toChainClickHandler = chain => {
    setToChain(chain)
  }
  useEffect(() => {
    if (fromChain === toChain) {
      setFromChain(prevToChain)
      setToChain(prevFromChain)
    } else {
      if (!isFromCfxChain) {
        setToChain(DefaultToChain)
      }
    }
  }, [fromChain, toChain, prevFromChain, prevToChain, isFromCfxChain])

  return (
    <>
      <div className="flex flex-col mt-12">
        <div className="flex">
          <div className="mr-4 ml-4 w-24">
            <ChainSelect
              chain={fromChain}
              type="from"
              onClick={fromChainClickHandler}
            ></ChainSelect>
          </div>
          <div>
            <span>test2</span>
          </div>
        </div>
        <div className="mr-4 ml-4 mt-24 w-24">
          <ChainSelect
            chain={toChain}
            type="to"
            onClick={toChainClickHandler}
            fromChain={fromChain}
          ></ChainSelect>
        </div>
      </div>
      <div>
        <AccountStatus chain="eth" size="big"></AccountStatus>
      </div>
    </>
  )
}

export default Shuttle
