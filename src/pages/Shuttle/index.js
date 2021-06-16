import ShuttleForm from './ShuttleForm'
import ConfirmModal from './ConfirmModal'

function Shuttle() {
  return (
    <div className="flex justify-center">
      <ShuttleForm />
      <ConfirmModal
        open={true}
        fromChain="eth"
        toChain="cfx"
        value="26.38"
        fromToken={{
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
