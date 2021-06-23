import PropTypes from 'prop-types'
import {
  SupportedChains,
  WalletIcon,
  ChainConfig,
} from '../../../constants/chainConfig'
import {useWallet} from '../../../hooks/useWallet'
import {shortenAddress} from '../../../utils/address'
import {useIsBtcChain} from '../../../hooks'
import {useShuttleState} from '../../../state'

function Account({chain, className, iconClassName, showIcon = false}) {
  const {address} = useWallet(chain)
  const walletKey = ChainConfig[chain].wallet
  const isBtcChain = useIsBtcChain(chain)
  const {toBtcAddress} = useShuttleState()

  return (
    <div className={`flex items-center ${className}`}>
      {showIcon && !isBtcChain && (
        <WalletIcon type={walletKey} className={iconClassName} />
      )}
      {!isBtcChain && address && shortenAddress(chain, address)}
      {isBtcChain && toBtcAddress && shortenAddress(chain, toBtcAddress)}
    </div>
  )
}

Account.propTypes = {
  chain: PropTypes.oneOf(SupportedChains).isRequired,
  className: PropTypes.string,
  iconClassName: PropTypes.string,
  showIcon: PropTypes.bool,
}
export default Account
