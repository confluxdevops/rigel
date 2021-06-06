import PropTypes from 'prop-types'
import Config, {SupportedChains} from '../../../constants/chainConfig'

function WalletIcon({chain, className}) {
  const walletConfig = Config[chain]?.wallet
  return (
    <img src={walletConfig?.logo} className={`w-3 ${className}`} alt="icon" />
  )
}

WalletIcon.propTypes = {
  chain: PropTypes.oneOf(SupportedChains).isRequired,
  className: PropTypes.string,
}
export default WalletIcon
