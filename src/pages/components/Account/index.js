import PropTypes from 'prop-types'
import {
  SupportedChains,
  WalletIcon,
  ChainConfig,
} from '../../../constants/chainConfig'
import {useWallet} from '../../../hooks/useWallet'
import {shortenAddress} from '../../../utils/address'
import {useIsBtcChain} from '../../../hooks'
import {useState} from '../../../state'

function Account({
  chain,
  className,
  iconClassName,
  iconSize,
  showIcon = false,
}) {
  const {address} = useWallet(chain)
  const walletKey = ChainConfig[chain].wallet
  const isBtcChain = useIsBtcChain(chain)
  const {btcAddress} = useState()

  return (
    <div className={`flex justify-center ${className}`}>
      {showIcon && !isBtcChain && (
        <WalletIcon
          type={walletKey}
          className={iconClassName}
          size={iconSize}
        />
      )}
      {!isBtcChain && address && shortenAddress(chain, address)}
      {isBtcChain && btcAddress && shortenAddress(chain, btcAddress)}
    </div>
  )
}

Account.propTypes = {
  chain: PropTypes.oneOf(SupportedChains).isRequired,
  className: PropTypes.string,
  iconClassName: PropTypes.string,
  iconSize: PropTypes.string,
  showIcon: PropTypes.bool,
}
export default Account
