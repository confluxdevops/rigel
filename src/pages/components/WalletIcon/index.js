import PropTypes from 'prop-types'
import {
  ChainConfig,
  WalletConfig,
  SupportedChains,
} from '../../../constants/chainConfig'

function WalletIcon({chain, className}) {
  const walletConfig = WalletConfig[ChainConfig[chain]?.wallet]
  return walletConfig.icon(`w-3 ${className}`)
}

WalletIcon.propTypes = {
  chain: PropTypes.oneOf(SupportedChains).isRequired,
  className: PropTypes.string,
}
export default WalletIcon
