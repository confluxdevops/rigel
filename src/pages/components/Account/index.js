import PropTypes from 'prop-types'
import {
  SupportedChains,
  WalletIcon,
  ChainConfig,
} from '../../../constants/chainConfig'
import useWallet from '../../../hooks/useWallet'
import {shortenAddress} from '../../../utils/address'

function Account({
  chain,
  className,
  iconClassName,
  iconSize,
  showIcon = false,
}) {
  const {address} = useWallet(chain)
  const walletKey = ChainConfig[chain].wallet
  return (
    <div className={`flex justify-center ${className}`}>
      {showIcon && (
        <WalletIcon
          type={walletKey}
          className={iconClassName}
          size={iconSize}
        />
      )}
      {address ? shortenAddress(chain, address) : ''}
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
