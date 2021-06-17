import {useEffectOnce} from 'react-use'
import ShuttleForm from './ShuttleForm'
import ConfirmModal from './ConfirmModal'
import {useShuttleState} from '../../state'

function Shuttle() {
  const {setFromBtcAddress} = useShuttleState()
  useEffectOnce(() =>
    setFromBtcAddress('bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'),
  )

  return (
    <div className="flex justify-center">
      <ShuttleForm />
      <ConfirmModal
        open={true}
        fromChain="btc"
        toChain="cfx"
        value="26.38"
        fromTokenInfo={{
          symbol: 'KNC',
          icon: 'https://conflux-static.oss-cn-beijing.aliyuncs.com/icons/default.png',
          origin: 'eth',
          supported: 1,
        }}
      />
    </div>
  )
}

export default Shuttle
