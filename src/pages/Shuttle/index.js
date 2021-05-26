import {useState} from 'react'

import ChainSelect from '../components/ChainSelect'
import {DefaultFromChain, DefaultToChain} from '../../constants/chainConfig'

function Shuttle() {
  const [fromChain, setFromChain] = useState(DefaultFromChain)
  const [toChain, setToChain] = useState(DefaultToChain)
  console.log('fromChain', fromChain)
  console.log('toChain', toChain)
  const fromChainClickHandler = chain => {
    setFromChain(chain)
  }
  const toChainClickHandler = chain => {
    setToChain(chain)
  }
  // useEffect(()=>{
  //   if(fromChain==toChain){
  //     setFromChain(toChain)
  //     setToChain(fromChain)
  //   }
  // },[fromChain,toChain])

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
    </>
  )
}

export default Shuttle
